# 🧞‍♂️ GSTGenie

GSTGenie is an AI-powered invoice management and tax compliance platform. It streamlines the process of uploading, parsing, and managing GST invoices using advanced OCR (Optical Character Recognition) and automated workflow services.

## ✨ Key Features

* **Smart OCR Parsing:** Automatically extract key data from uploaded invoice documents using Google Cloud Vision.
* **Invoice Dashboard:** View, organize, and track all your invoices in an intuitive UI.
* **Automated Reminders:** Built-in cron jobs for timely tax filing and payment reminders.
* **Insights & Tax Services:** Automated calculations and intelligent insights for better financial compliance.
* **PDF Generation:** Easily generate and download reports.

## 💻 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, TypeScript
* **Backend:** Node.js, Express.js
* **AI & Services:** Google Cloud Vision API for OCR
* **Architecture:** RESTful API with dedicated services for insights, tax, and workflows

## 📂 Project Structure

* `/frontend` - Contains the Next.js web application.
* `/backend` - Contains the Node.js Express server, OCR parsers, cron jobs, and API routes.

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/arc427/GSTGenie.git
cd GSTGenie


### 2. Setup the Backend

cd backend
npm install

*Create a .env file in the backend folder and add your required environment variables. Keep your gstgenie-vision-key.json securely inside backend/keys/ (this folder is git-ignored).*

### 3. Setup the Frontend

cd ../frontend
npm install


### 4. Run the Application
You will need two separate terminal windows to run both servers locally.

**Terminal 1 (Backend):**

cd backend
npm start


**Terminal 2 (Frontend):**

cd frontend
npm run dev


Open http://localhost:3000 in your browser to see the result.
