// ==========================================
// BizMind AI - Main JavaScript
// ==========================================

let latestBusinessData = null;

let businessChart = null;
let trendChart = null;


// ==========================================
// ELEMENTS
// ==========================================

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const analyzeButton = document.getElementById("analyzeButton");
const status = document.getElementById("status");
const dashboard = document.getElementById("dashboard");

const totalSales = document.getElementById("totalSales");
const totalProfit = document.getElementById("totalProfit");
const topProduct = document.getElementById("topProduct");
const topRegion = document.getElementById("topRegion");

const businessChartCanvas =
    document.getElementById("businessChart");

const trendChartCanvas =
    document.getElementById("trendChart");

const recommendations =
    document.getElementById("recommendations");

const insightsContainer =
    document.getElementById("insights");

const productPerformance =
    document.getElementById("productPerformance");

const regionPerformance =
    document.getElementById("regionPerformance");


// ==========================================
// GEMINI ELEMENTS
// ==========================================

const askGeminiBtn =
    document.getElementById("askGeminiBtn");

const geminiPanel =
    document.getElementById("geminiPanel");

const geminiOverlay =
    document.getElementById("geminiOverlay");

const closeGemini =
    document.getElementById("closeGemini");

const geminiMessages =
    document.getElementById("geminiMessages");

const geminiInput =
    document.getElementById("geminiInput");

const sendGemini =
    document.getElementById("sendGemini");


// ==========================================
// FILE SELECTION
// ==========================================

if (fileInput) {

    fileInput.addEventListener("change", function () {

        if (this.files.length > 0) {

            fileName.textContent =
                this.files[0].name;

        } else {

            fileName.textContent =
                "No file selected";
        }
    });
}


// ==========================================
// ANALYZE BUTTON
// ==========================================

if (analyzeButton) {

    analyzeButton.addEventListener("click", async function () {

        if (!fileInput.files.length) {

            showStatus(
                "Please select a CSV file first.",
                "error"
            );

            return;
        }

        const file = fileInput.files[0];

        if (!file.name.toLowerCase().endsWith(".csv")) {

            showStatus(
                "Please upload a CSV file.",
                "error"
            );

            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        analyzeButton.disabled = true;
        analyzeButton.textContent = "Analyzing...";

        showStatus(
            "Analyzing your business data...",
            "loading"
        );

        try {

            const response = await fetch(
                "/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error || "Analysis failed."
                );
            }

            latestBusinessData = data;

            displayDashboard(data);

            showStatus(
                "Analysis completed successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "Analysis Error:",
                error
            );

            showStatus(
                error.message ||
                "Something went wrong.",
                "error"
            );

        } finally {

            analyzeButton.disabled = false;

            analyzeButton.textContent =
                "Analyze Data →";
        }
    });
}


// ==========================================
// STATUS
// ==========================================

function showStatus(message, type) {

    if (!status) return;

    status.textContent = message;

    status.className = "status-message";

    if (type) {
        status.classList.add(type);
    }
}


// ==========================================
// DISPLAY DASHBOARD
// ==========================================

function displayDashboard(data) {

    if (!dashboard) return;

    dashboard.classList.remove("hidden");

    dashboard.style.display = "block";

    const summary =
        data.summary || {};

    const products =
        data.product_performance || [];

    const regions =
        data.region_performance || [];

    const insights =
        data.business_insights || [];

    // --------------------------------------
    // KPI CARDS
    // --------------------------------------

    if (totalSales) {

        totalSales.textContent =
            formatCurrency(
                summary.total_sales
            );
    }

    if (totalProfit) {

        totalProfit.textContent =
            formatCurrency(
                summary.total_profit
            );
    }


    // --------------------------------------
    // TOP PRODUCT
    // --------------------------------------

    if (products.length > 0) {

        const highestSales =
            Math.max(
                ...products.map(
                    product => product.sales
                )
            );

        const bestProducts =
            products.filter(
                product =>
                    product.sales === highestSales
            );

        if (topProduct) {

            topProduct.textContent =
                bestProducts
                    .map(
                        product =>
                            product.Product
                    )
                    .join(" / ");
        }
    }


    // --------------------------------------
    // TOP REGION
    // --------------------------------------

    if (regions.length > 0) {

        const highestSales =
            Math.max(
                ...regions.map(
                    region => region.sales
                )
            );

        const bestRegions =
            regions.filter(
                region =>
                    region.sales === highestSales
            );

        if (topRegion) {

            topRegion.textContent =
                bestRegions
                    .map(
                        region =>
                            region.Region
                    )
                    .join(" / ");
        }
    }


    // --------------------------------------
    // RENDER ALL SECTIONS
    // --------------------------------------

    renderAIRecommendations(data);

    renderBusinessInsights(insights);

    renderProductPerformance(products);

    renderRegionPerformance(regions);


    // --------------------------------------
    // CHARTS
    // --------------------------------------

    createBusinessChart(
        products,
        regions
    );

    createTrendChart(
        data.monthly_trend || []
    );
}


// ==========================================
// AI RECOMMENDATIONS
// ==========================================


function renderAIRecommendations(data) {

    if (!recommendations) return;

    const insights = data.business_insights || [];
    const summary = data.summary || {};
    const products = data.product_performance || [];
    const regions = data.region_performance || [];

    if (!insights.length) {

        recommendations.innerHTML = `
            <div class="empty-ai">
                <div>✦</div>
                <p>
                    AI insights will appear here after your
                    data is analyzed.
                </p>
            </div>
        `;

        return;
    }

    const totalSales = summary.total_sales || 0;
    const totalProfit = summary.total_profit || 0;
    const margin = summary.profit_margin_percent || 0;

    // Top product
    let bestProduct = null;

    if (products.length) {

        bestProduct = [...products].sort(
            (a, b) => b.sales - a.sales
        )[0];
    }

    // Top region
    let highestRegionSales = 0;
    let bestRegions = [];

    if (regions.length) {

        highestRegionSales = Math.max(
            ...regions.map(region => region.sales)
        );

        bestRegions = regions.filter(
            region => region.sales === highestRegionSales
        );
    }

    let cards = [];

    // --------------------------------------
    // SALES
    // --------------------------------------

    cards.push(`
        <div class="ai-insight-item">

            <div class="ai-insight-icon">
                ✦
            </div>

            <div>

                <strong>
                    Sales
                </strong>

                <p>
                    The business generated total sales of
                    <strong>${formatCurrency(totalSales)}</strong>
                    across the analyzed data.
                </p>

            </div>

        </div>
    `);


    // --------------------------------------
    // PROFIT
    // --------------------------------------

    cards.push(`
        <div class="ai-insight-item">

            <div class="ai-insight-icon">
                ✦
            </div>

            <div>

                <strong>
                    Profit
                </strong>

                <p>
                    The business generated
                    <strong>${formatCurrency(totalProfit)}</strong>
                    in total profit, resulting in an overall
                    profit margin of
                    <strong>${margin}%</strong>.
                </p>

            </div>

        </div>
    `);


    // --------------------------------------
    // TOP PRODUCT
    // --------------------------------------

    if (bestProduct) {

        cards.push(`
            <div class="ai-insight-item">

                <div class="ai-insight-icon">
                    ✦
                </div>

                <div>

                    <strong>
                        Top Product
                    </strong>

                    <p>
                        <strong>
                            ${escapeHTML(
                                bestProduct.Product
                            )}
                        </strong>
                        is the top-performing product based
                        on sales, generating
                        <strong>
                            ${formatCurrency(
                                bestProduct.sales
                            )}
                        </strong>.
                    </p>

                </div>

            </div>
        `);
    }


    // --------------------------------------
    // TOP REGION
    // --------------------------------------

    if (bestRegions.length) {

        const regionNames =
            bestRegions
                .map(
                    region =>
                        escapeHTML(region.Region)
                )
                .join(" and ");

        cards.push(`
            <div class="ai-insight-item">

                <div class="ai-insight-icon">
                    ✦
                </div>

                <div>

                    <strong>
                        Leading Region
                    </strong>

                    <p>
                        ${regionNames}
                        recorded the highest sales of
                        <strong>
                            ${formatCurrency(
                                highestRegionSales
                            )}
                        </strong>.
                    </p>

                </div>

            </div>
        `);
    }


    // --------------------------------------
    // LOWEST REGION
    // --------------------------------------

    if (regions.length) {

        const lowestRegion =
            [...regions].sort(
                (a, b) => a.sales - b.sales
            )[0];

        cards.push(`
            <div class="ai-insight-item">

                <div class="ai-insight-icon">
                    ✦
                </div>

                <div>

                    <strong>
                        Region Needing Attention
                    </strong>

                    <p>
                        <strong>
                            ${escapeHTML(
                                lowestRegion.Region
                            )}
                        </strong>
                        recorded the lowest sales at
                        <strong>
                            ${formatCurrency(
                                lowestRegion.sales
                            )}
                        </strong>.
                        This region may require further
                        business review.
                    </p>

                </div>

            </div>
        `);
    }


    recommendations.innerHTML = `
        <div class="ai-insight-list">
            ${cards.join("")}
        </div>
    `;
}
// ==========================================
// BUSINESS INSIGHTS
// ==========================================

function renderBusinessInsights(insights) {

    if (!insightsContainer) return;

    if (!insights.length) {

        insightsContainer.innerHTML = `
            <p class="empty-message">
                No business insights available.
            </p>
        `;

        return;
    }

    insightsContainer.innerHTML = `

        <div class="insights-list">

            ${insights.map(item => `

                <div class="insight-card">

                    <div class="insight-card-title">

                        ${escapeHTML(
                            formatInsightType(
                                item.type
                            )
                        )}

                    </div>

                    <div class="insight-card-value">

                        ${escapeHTML(
                            String(
                                item.value ?? ""
                            )
                        )}

                    </div>

                    ${
                        item.metric !== undefined
                        ? `
                            <div class="insight-card-metric">
                                ${formatCurrency(
                                    item.metric
                                )}
                            </div>
                          `
                        : ""
                    }

                </div>

            `).join("")}

        </div>
    `;
}


// ==========================================
// PRODUCT PERFORMANCE
// ==========================================

function renderProductPerformance(products) {

    if (!productPerformance) return;

    if (!products.length) {

        productPerformance.innerHTML = `
            <p class="empty-message">
                No product data available.
            </p>
        `;

        return;
    }

    productPerformance.innerHTML = `

        <div class="performance-list">

            ${products.map(product => `

                <div class="performance-card">

                    <div class="performance-main">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    product.Product
                                )}
                            </strong>

                            <span>
                                ${formatCurrency(
                                    product.sales
                                )}
                            </span>

                        </div>

                    </div>

                    <div class="performance-stats">

                        <span>
                            Profit:
                            ${formatCurrency(
                                product.profit
                            )}
                        </span>

                        <span>
                            Margin:
                            ${product.profit_margin_percent}%
                        </span>

                        <span>
                            Quantity:
                            ${product.quantity}
                        </span>

                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


// ==========================================
// REGION PERFORMANCE
// ==========================================

function renderRegionPerformance(regions) {

    if (!regionPerformance) return;

    if (!regions.length) {

        regionPerformance.innerHTML = `
            <p class="empty-message">
                No regional data available.
            </p>
        `;

        return;
    }

    regionPerformance.innerHTML = `

        <div class="performance-list">

            ${regions.map(region => `

                <div class="performance-card">

                    <div class="performance-main">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    region.Region
                                )}
                            </strong>

                            <span>
                                ${formatCurrency(
                                    region.sales
                                )}
                            </span>

                        </div>

                    </div>

                    <div class="performance-stats">

                        <span>
                            Profit:
                            ${formatCurrency(
                                region.profit
                            )}
                        </span>

                        <span>
                            Margin:
                            ${region.profit_margin_percent}%
                        </span>

                        <span>
                            Quantity:
                            ${region.quantity}
                        </span>

                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


// ==========================================
// BUSINESS OVERVIEW CHART
// ==========================================

function createBusinessChart(
    products,
    regions
) {

    if (!businessChartCanvas) return;

    if (businessChart) {

        businessChart.destroy();

        businessChart = null;
    }

    const labels = [
        ...products.map(
            product => product.Product
        ),
        ...regions.map(
            region => region.Region
        )
    ];

    const values = [
        ...products.map(
            product => product.sales
        ),
        ...regions.map(
            region => region.sales
        )
    ];

    businessChart =
        new Chart(
            businessChartCanvas.getContext("2d"),
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label: "Sales",
                            data: values,
                            borderWidth: 1
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: true
                        }
                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(value) {

                                        return "₹" +
                                            Number(
                                                value
                                            ).toLocaleString(
                                                "en-IN"
                                            );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


// ==========================================
// MONTHLY TREND CHART
// ==========================================

function createTrendChart(
    monthlyData
) {

    if (!trendChartCanvas) return;

    if (trendChart) {

        trendChart.destroy();

        trendChart = null;
    }

    const labels = [];
    const values = [];

    monthlyData.forEach(item => {

        const month =
            item.month ??
            item.Month ??
            "";

        const sales =
            item.sales ??
            item.Sales ??
            0;

        labels.push(month);

        values.push(sales);
    });

    trendChart =
        new Chart(
            trendChartCanvas.getContext("2d"),
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label: "Monthly Sales",
                            data: values,
                            borderWidth: 2,
                            tension: 0.3,
                            fill: false
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: true
                        }
                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(value) {

                                        return "₹" +
                                            Number(
                                                value
                                            ).toLocaleString(
                                                "en-IN"
                                            );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


// ==========================================
// OPEN GEMINI PANEL
// ==========================================

if (askGeminiBtn) {

    askGeminiBtn.addEventListener(
        "click",
        function() {

            if (!latestBusinessData) {

                alert(
                    "Please analyze your CSV data first."
                );

                return;
            }

            openGeminiPanel();
        }
    );
}


// ==========================================
// OPEN PANEL
// ==========================================

function openGeminiPanel() {

    if (geminiPanel) {

        geminiPanel.classList.add("active");
    }

    if (geminiOverlay) {

        geminiOverlay.classList.add("active");
    }

    if (geminiInput) {

        setTimeout(() => {

            geminiInput.focus();

        }, 200);
    }
}


// ==========================================
// CLOSE PANEL
// ==========================================

function closeGeminiPanel() {

    if (geminiPanel) {

        geminiPanel.classList.remove("active");
    }

    if (geminiOverlay) {

        geminiOverlay.classList.remove("active");
    }
}


if (closeGemini) {

    closeGemini.addEventListener(
        "click",
        closeGeminiPanel
    );
}


if (geminiOverlay) {

    geminiOverlay.addEventListener(
        "click",
        closeGeminiPanel
    );
}


// ==========================================
// SEND QUESTION
// ==========================================

async function sendQuestion() {

    if (!geminiInput ||
        !geminiMessages) {

        return;
    }

    const question =
        geminiInput.value.trim();

    if (!question) return;


    if (!latestBusinessData) {

        addAIMessage(
            "Please analyze your CSV data first.",
            "BizMind AI"
        );

        return;
    }


    // --------------------------------------
    // USER MESSAGE
    // --------------------------------------

    addUserMessage(question);

    geminiInput.value = "";


    // --------------------------------------
    // LOADING
    // --------------------------------------

    const loading =
        addLoadingMessage();


    try {

        const response =
            await fetch(
                "/ask-gemini",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        question:
                            question,

                        business_data:
                            latestBusinessData
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI request failed."
            );
        }


        if (loading) {

            loading.remove();
        }


        addAIMessage(

            data.answer ||
            "I couldn't generate an answer.",

            data.title ||
            "BizMind AI",

            data.details ||
            []
        );


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        if (loading) {

            loading.remove();
        }


        addAIMessage(

            "The AI service is temporarily unavailable. Please try again.",

            "BizMind AI"
        );
    }
}


// ==========================================
// USER CHAT MESSAGE
// ==========================================

function addUserMessage(message) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "chat-message user";


    wrapper.innerHTML = `

        <div>

            <div class="user-label">
                You
            </div>

            <div class="user-message">

                ${escapeHTML(message)}

            </div>

        </div>

    `;


    geminiMessages.appendChild(
        wrapper
    );


    scrollChat();
}


// ==========================================
// AI CHAT MESSAGE
// ==========================================

function addAIMessage(
    answer,
    title = "BizMind AI",
    details = []
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "chat-message ai";


    let detailsHTML = "";


    if (
        details &&
        details.length > 0
    ) {

        detailsHTML = `

            <div class="ai-details">

                ${details.map(detail => `

                    <div class="ai-detail">

                        ${escapeHTML(
                            detail
                        )}

                    </div>

                `).join("")}

            </div>

        `;
    }


    wrapper.innerHTML = `

        <div class="ai-response-wrapper">

            <div class="ai-label">
                BizMind AI
            </div>

            <div class="ai-response">

                <h4>
                    ${escapeHTML(title)}
                </h4>

                <p class="ai-main-answer">

                    ${formatAIText(answer)}

                </p>

                ${detailsHTML}

            </div>

        </div>

    `;


    geminiMessages.appendChild(
        wrapper
    );


    scrollChat();
}


// ==========================================
// LOADING MESSAGE
// ==========================================

function addLoadingMessage() {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "chat-message ai";


    wrapper.innerHTML = `

        <div class="ai-response-wrapper">

            <div class="ai-label">
                BizMind AI
            </div>

            <div class="ai-response">

                <h4>
                    Thinking...
                </h4>

                <p class="ai-main-answer">
                    Analyzing your business data...
                </p>

            </div>

        </div>

    `;


    geminiMessages.appendChild(
        wrapper
    );


    scrollChat();


    return wrapper;
}


// ==========================================
// AI TEXT FORMATTER
// ==========================================

function formatAIText(text) {

    if (!text) return "";


    let clean =
        String(text);


    // Remove TITLE / ANSWER / DETAILS
    clean = clean.replace(
        /TITLE:\s*/gi,
        ""
    );

    clean = clean.replace(
        /ANSWER:\s*/gi,
        ""
    );

    clean = clean.replace(
        /DETAILS:\s*/gi,
        ""
    );


    // Remove markdown headings
    clean = clean.replace(
        /^#+\s*/gm,
        ""
    );


    // Convert bullet points
    clean = clean.replace(
        /^\s*[-*]\s+/gm,
        "• "
    );


    // Convert new lines
    clean = clean.replace(
        /\n/g,
        "<br>"
    );


    return clean;
}


// ==========================================
// SUGGESTION BUTTONS
// ==========================================

document.querySelectorAll(
    ".suggestion"
).forEach(button => {

    button.addEventListener(
        "click",
        function() {

            if (!geminiInput) return;


            const question =
                this.textContent.trim();


            geminiInput.value =
                question;


            sendQuestion();
        }
    );
});


// ==========================================
// ENTER KEY
// ==========================================

if (geminiInput) {

    geminiInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendQuestion();
            }
        }
    );
}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendGemini) {

    sendGemini.addEventListener(
        "click",
        sendQuestion
    );
}


// ==========================================
// SCROLL CHAT
// ==========================================

function scrollChat() {

    if (!geminiMessages) return;


    setTimeout(() => {

        geminiMessages.scrollTop =
            geminiMessages.scrollHeight;

    }, 50);
}


// ==========================================
// CURRENCY FORMAT
// ==========================================

function formatCurrency(value) {

    if (
        value === undefined ||
        value === null ||
        isNaN(value)
    ) {

        return "₹0";
    }


    return "₹" +
        Number(value)
            .toLocaleString("en-IN");
}


// ==========================================
// INSIGHT TYPE FORMAT
// ==========================================

function formatInsightType(type) {

    if (!type) {
        return "Business Insight";
    }


    const text =
        String(type);


    return text.charAt(0).toUpperCase() +
        text.slice(1);
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}