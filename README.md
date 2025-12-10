# Health and Fitness Tracker

A full-stack web application designed to help users track their daily workouts, manage weight loss goals, and visualize fitness progress. The application is built using Node.js, Express, and MySQL, featuring secure user authentication and a dynamic dashboard.

## Features

### User Account Management
* **Secure Authentication:** Users can register and log in securely. Passwords are hashed using `bcrypt` before storage.
* **Session Management:** Uses `express-session` to maintain user state across pages.
* **Authorization:** Middleware protects specific routes (e.g Dashboard, My Workouts) to ensure only logged-in users can access them.

### Workout Tracking
* **Log Workouts:** Users can record workout activities including name, duration (minutes), and calories burned.
* **View History:** A tabular view of all recorded workouts, sorted by date.
* **Search:** Users can search through their workout history by keyword.
* **Delete:** Users can remove incorrect entries from their history.
* **Data Isolation:** Users can only view and edit their own private data.

### Goals and Dashboard
* **Goal Setting:** Users can set their height, starting weight, and target weight.
* **Progress Calculation:** The app automatically calculates the percentage of weight loss achieved.
* **BMI Calculator:** Automatically calculates Body Mass Index (BMI) and provides a health category (e.g Healthy Weight, Overweight) based on current stats.
* **Weight History:** Users can log daily weight entries to track progress over time.
* **Visualization:** A dynamic chart (using Chart.js) visualizes calorie burn history.

### API
* **JSON Endpoint:** Includes a RESTful API endpoint at `/api/workouts` that returns user workout data in JSON format for external use.
* **Security:** The API is secured using session validation to prevent unauthorized access to data.

---

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Templating Engine:** EJS
* **Frontend:** HTML5, CSS3, Client-side JavaScript (Chart.js)
* **Key Libraries:**
    * `mysql2` (Database connection)
    * `bcrypt` (Password hashing)
    * `express-session` (Session management)
    * `express-validator` (Input validation)
    * `dotenv` (Environment variable management)

---

## Installation and Setup

Follow these instructions to set up the project locally.

### 1. Prerequisites
Ensure you have the following installed:
* Node.js
* MySQL Server

### 2. Installation
Open your terminal or command prompt and navigate to the project directory. Install the required dependencies:

```bash
npm install
```

### 3. Database Setup
You need to create the database and tables before running the application.

1. Log into your MySQL client (Workbench or Command Line).
2. Execute the SQL commands found in `create_db.sql` to create the `health` database and required tables (`users`, `workouts`, `goals`, `weight_history`).
3. *(Optional)* Insert dummy data for testing purposes.

### 4. Configuration
Create a file named `.env` in the root directory of the project. Add your database connection details:

```env
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=your_mysql_password
HEALTH_DATABASE=health
HEALTH_BASE_PATH=http://localhost:8000
PORT=8000
```
Note: Replace `your_mysql_password` with your own MySQL password

### 5. Running the Application

To start the node.js server:

```bash
node index.js
```

if successful, you will see a message indicating the server is running (usually on port 8000).

### 6. Accessing the App
Open your browser and navigate to: `https://localhost:8000`
A list of links to the live application deployed can be found in `links.txt` in the root directory

## Project Structure

* **routes/**: Contains the logic for different parts of the application.
    * `main.js`: Home and About page routes.
    * `users.js`: Registration, Login, and Logout logic.
    * `workouts.js`: CRUD operations for workouts.
    * `goals.js`: Logic for weight tracking, BMI, and goals.
    * `api.js`: JSON API endpoints.
* **views/**: EJS templates for the frontend user interface.
* **public/**: Static assets (CSS files, client-side images).
* **index.js**: The main entry point for the Express server.

## Security Implementation

This project implements several security best practices:

* **Password Hashing:** Passwords are never stored in plain text.
* **Input Sanitization:** Inputs are sanitized to prevent XSS attacks.
* **Prepared Statements:** SQL queries use prepared statements to prevent SQL Injection.
* **Access Control:** Middleware checks for active sessions before allowing access to private data.