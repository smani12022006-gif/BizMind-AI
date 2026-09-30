import pandas as pd


def analyze_business_data(file_path):
    df = pd.read_csv(file_path)

    # Remove completely empty rows
    df = df.dropna(how="all")

    required_columns = {
        "Date",
        "Product",
        "Region",
        "Sales",
        "Profit",
        "Quantity"
    }

    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {', '.join(sorted(missing_columns))}"
        )

    # Convert numeric columns safely
    numeric_columns = ["Sales", "Profit", "Quantity"]

    for column in numeric_columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    df = df.dropna(subset=numeric_columns)

    # Convert date
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])

    # Overall metrics
    total_sales = float(df["Sales"].sum())
    total_profit = float(df["Profit"].sum())

    profit_margin = (
        (total_profit / total_sales) * 100
        if total_sales else 0
    )

    # Product performance
    product_data = (
        df.groupby("Product")
        .agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            quantity=("Quantity", "sum")
        )
        .reset_index()
    )

    product_data["profit_margin_percent"] = (
        product_data["profit"] /
        product_data["sales"] * 100
    ).round(2)

    # Region performance
    region_data = (
        df.groupby("Region")
        .agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            quantity=("Quantity", "sum")
        )
        .reset_index()
    )

    region_data["profit_margin_percent"] = (
        region_data["profit"] /
        region_data["sales"] * 100
    ).round(2)

    # Monthly trend
    df["Month"] = df["Date"].dt.to_period("M").astype(str)

    monthly_data = (
        df.groupby("Month")["Sales"]
        .sum()
        .reset_index()
    )

    monthly_trend = [
        {
            "month": str(row["Month"]),
            "sales": float(row["Sales"])
        }
        for _, row in monthly_data.iterrows()
    ]

    # Top product
    max_product_sales = product_data["sales"].max()

    top_products = (
        product_data[
            product_data["sales"] == max_product_sales
        ]["Product"]
        .astype(str)
        .tolist()
    )

    # Top region
    max_region_sales = region_data["sales"].max()

    top_regions = (
        region_data[
            region_data["sales"] == max_region_sales
        ]["Region"]
        .astype(str)
        .tolist()
    )

    return {
        "summary": {
            "rows": int(len(df)),
            "columns": [str(column) for column in df.columns],
            "total_sales": float(total_sales),
            "total_profit": float(total_profit),
            "profit_margin_percent": float(round(profit_margin, 2))
        },

        "business_insights": [
            {
                "type": "sales",
                "title": "Total Sales",
                "value": float(total_sales),
                "evidence": "Sum of all valid Sales values."
            },
            {
                "type": "profit",
                "title": "Total Profit",
                "value": float(total_profit),
                "evidence": "Sum of all valid Profit values."
            },
            {
                "type": "product",
                "title": "Top Product",
                "value": ", ".join(top_products),
                "metric": float(max_product_sales),
                "evidence": "Highest total sales after grouping by Product."
            },
            {
                "type": "region",
                "title": "Top Region",
                "value": ", ".join(top_regions),
                "metric": float(max_region_sales),
                "evidence": "Highest total sales after grouping by Region."
            },
            {
                "type": "margin",
                "title": "Overall Profit Margin",
                "value": float(round(profit_margin, 2)),
                "evidence": "Calculated as total profit divided by total sales."
            }
        ],

        "product_performance": [
            {
                "Product": str(row["Product"]),
                "sales": float(row["sales"]),
                "profit": float(row["profit"]),
                "quantity": int(row["quantity"]),
                "profit_margin_percent": float(row["profit_margin_percent"])
            }
            for _, row in product_data.iterrows()
        ],

        "region_performance": [
            {
                "Region": str(row["Region"]),
                "sales": float(row["sales"]),
                "profit": float(row["profit"]),
                "quantity": int(row["quantity"]),
                "profit_margin_percent": float(row["profit_margin_percent"])
            }
            for _, row in region_data.iterrows()
        ],

        "monthly_trend": monthly_trend
    }