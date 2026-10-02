BizMind AI
AI-Powered Business Data Decision Engine
BizMind AI is a simple AI-powered web application that helps businesses understand their sales data quickly and easily.
1. Problem Statement
PS04 – AI Decision Engine for Business Data
Businesses often have a large amount of sales data, but analyzing it manually can take time. Important information such as sales, profit, product performance, regional performance, and trends may be difficult to find quickly.
Common problems include:
Large amounts of data are difficult to analyze manually.
Finding important information takes time.
Best-performing products are not always easy to identify.
Regions needing attention may be difficult to spot.
Sales and profit trends can be difficult to understand.
Raw data can make business decisions confusing.
2. Our Solution
We created BizMind AI to make business data easier to understand.
Simple workflow
Upload CSV → Analyze Data → View Dashboard → Get Insights → Ask BizMind
The application analyzes uploaded business data and presents the important information through a simple dashboard.
3. Why We Created It
Businesses already have useful data, but they often spend time checking tables and doing calculations manually.
We wanted to create a tool where a user can upload a CSV file and quickly understand what is happening in the business.
BizMind AI also allows users to ask questions in simple language instead of manually searching through the data.
4. Objectives
Make business data easier to understand.
Reduce manual analysis.
Show important business metrics in one place.
Compare products and regions.
Show monthly sales trends.
Provide useful business insights.
Allow users to ask questions about their data.
5. Key Features
Business Dashboard
Shows total sales, total profit, profit margin, top product, and top region.
CSV Upload
Users can upload business data in CSV format.
Expected fields include:
Date
Product
Region
Sales
Profit
Quantity
Sales & Profit Analysis
Calculates total sales, total profit, and profit margin.
Product Performance
Shows sales, profit, quantity, and profit margin for products.
Regional Performance
Shows sales, profit, quantity, and profit margin for regions.
Monthly Sales Trend
Shows how sales change over time.
AI Insights
Provides simple observations based on the analyzed business data.
Ask BizMind
Users can ask business questions in natural language.
Example questions:
Which product performs best?
Which region needs attention?
What are the main business risks?
What is the overall profit margin?
Where am I getting profit?
6. How It Works
Upload Data – The user uploads a CSV file.
Validate File – The system checks the file and required columns.
Analyze Data – Python and Pandas process the data.
Build Dashboard – Calculated results are sent to the frontend.
Show Insights – Metrics, charts, and performance sections are displayed.
Ask BizMind – The user can ask questions about the analyzed data.
7. Technology Stack
Frontend
HTML
CSS
JavaScript
Chart.js
Backend
Python
Flask
Data Analysis
Pandas
AI
OpenRouter API
Deployment
Render
Version Control
GitHub
8. Project Structure
```text
BizMind-AI/
├── app.py
├── requirements.txt
├── .env
├── .gitignore
├── controllers/
│   └── analysis_controller.py
├── models/
│   └── analysis_model.py
├── services/
│   ├── analyzer.py
│   └── ai_engine.py
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
└── data/
    └── sample_sales.csv
```
9. Backend Routes
Dashboard
```text
GET /
```
Loads the BizMind AI dashboard.
Analyze CSV
```text
POST /analyze
```
Accepts an uploaded CSV file and returns analyzed business data.
Ask BizMind
```text
POST /ask-gemini
```
Accepts a business question and analyzed data and returns the AI response.
> The current route name is kept as `ask-gemini` for compatibility, while the AI service used by the project is OpenRouter.
10. Data Analysis
BizMind AI calculates:
Summary
Number of rows
Available columns
Total sales
Total profit
Profit margin
Product Performance
Sales
Profit
Quantity
Profit margin
Regional Performance
Sales
Profit
Quantity
Profit margin
Monthly Trend
Monthly sales values
11. Sample Result
For the included sample dataset:
Total Sales: ₹1,365,000
Total Profit: ₹207,000
Profit Margin: 15.16%
Top Product by Sales: Laptop
Region with Lowest Sales: North
These values are based on the included sample sales dataset.
12. Example AI Interaction
User
```text
Which product performs best?
```
BizMind AI
```text
Laptop is the top-performing product based on sales.

Total Sales: ₹660,000
```
User
```text
Which region needs attention?
```
BizMind AI
```text
North is the region that requires attention because it recorded the lowest sales.

Sales: ₹375,000
Profit: ₹56,000
Profit Margin: 14.93%
Quantity Sold: 54 units
```
13. Benefits
Saves time on manual analysis.
Makes important information easier to find.
Helps compare products and regions.
Makes sales trends easier to understand.
Lets users ask questions using simple language.
Converts raw data into useful business insights.
14. Use Case
A business can follow this simple process:
```text
Collect Sales Data
       ↓
Store Data in CSV
       ↓
Upload to BizMind AI
       ↓
Analyze Data
       ↓
View Dashboard
       ↓
Review Insights
       ↓
Ask Questions
```
15. Installation
Clone the Repository
```bash
git clone https://github.com/smani12022006-gif/BizMind-AI.git
cd BizMind-AI
```
Install Dependencies
```bash
pip install -r requirements.txt
```
Add API Key
Create a `.env` file:
```env
OPENROUTER_API_KEY=
```
Do not publish the real API key in GitHub.
Run the Application
```bash
python app.py
```
Open:
```text
http://127.0.0.1:5000
```
16. Requirements
Main Python packages:
```text
Flask
pandas
python-dotenv
google-genai
gunicorn
requests
```
17. Environment Variables
The application uses:
```env
OPENROUTER_API_KEY=
```
Keep the API key private.
The `.gitignore` file contains:
```gitignore
.env
venv/
__pycache__/
*.pyc
```
18. Deployment
The project is deployed on Render.
Live Application
https://bizmind-ai-qxku.onrender.com/
GitHub Repository
https://github.com/smani12022006-gif/BizMind-AI
The free hosting instance may take some time to wake up after inactivity.
19. Demo Video
Add the final public demo video link here:
```text
https://youtu.be/OfkGB32Fcc0?si=loVcyUjBDuo6f0hs
```
The video should demonstrate:
Opening the application.
Uploading the CSV.
Viewing the dashboard.
Reviewing business insights.
Checking product and regional performance.
Viewing the monthly trend.
Using Ask BizMind.
Asking business questions.
20. Hackathon Information
Project: BizMind AI – AI-Powered Business Data Decision Engine
Problem Statement: PS04 – AI Decision Engine for Business Data
Team Name: smani12022006
Presented By: SAI MANIKANTA
21. AI Usage
AI tools were used during development for assistance with:
Project idea refinement
Coding support
Debugging
UI/UX improvements
Troubleshooting
Development guidance
The AI question-answer feature uses the OpenRouter API.
22. Security
The OpenRouter API key is stored in an environment variable.
The key should:
Stay in `.env`.
Never be committed to GitHub.
Never be shared publicly.
Never be hard-coded into source files.
23. Future Improvements
Possible future improvements include:
Support for more data formats.
Advanced sales forecasting.
More AI recommendations.
More dashboards and charts.
User accounts.
Saved reports.
Exportable business reports.
More business-specific questions.
More advanced trend analysis.
Additional data validation.
24. Project Vision
> **Make business data easy to understand and easy to use.**
BizMind AI aims to provide a simple place where users can:
Upload → Analyze → Understand → Ask → Decide
25. Conclusion
BizMind AI combines CSV data processing, automated analysis, business dashboards, visualizations, product and region analysis, monthly trends, and AI-powered question answering in one simple web application.
It turns raw business data into clear and useful information so users can understand their business data faster and more easily.
---
Thank You
BizMind AI
AI-Powered Business Data Decision Engine
SAI MANIKANTA
Team: smani12022006
Live Project:  
https://bizmind-ai-qxku.onrender.com/
GitHub:  
https://github.com/smani12022006-gif/BizMind-AI
