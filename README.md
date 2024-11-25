# **Novelle - A Full-Stack MERN Bookstore Application**

Novelle is a comprehensive online bookstore application developed using the MERN stack. It provides a reliable, user-friendly platform for customers, sellers, and admins to browse, purchase, and manage books.

---

## **Demo Links**

### **Frontend** (Hosted on [Vercel](https://vercel.com)):
- **User Homepage**: [https://novelle-store.vercel.app/](https://novelle-store.vercel.app/)
- **Admin Dashboard**: [https://novelle-store.vercel.app/admin/](https://novelle-store.vercel.app/admin/)

### **Backend** (Hosted on [Render](https://render.com)):
- **Base Endpoint**: [https://novelle.onrender.com](https://novelle.onrender.com)

---

## **Table of Contents**

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [Running the Application](#running-the-application)

---

## **Introduction**

Novelle is a simple yet efficient platform designed for:
- **Customers**: Browse and purchase books.
- **Sellers**: Manage inventory and fulfill orders.
- **Admins**: Oversee users, sellers, and platform operations.

### **Team Details**

| **Name**             | **Role**             | **Responsibilities**                                              |
|-----------------------|----------------------|--------------------------------------------------------------------|
| **Salmaan Ahmed K N** | Tech & Design Lead  | Technical architecture, UI/UX design, and project management.     |
| **Rahaman A**         | Backend Developer   | Backend development, database schema design, and API integration. |
| **Santheep S**        | Frontend Developer  | User interface development and backend integration.               |
| **Suraj R**           | System Tester       | System testing and quality assurance.                             |

---

## **Features**

### **Customers**
- **Book Browsing**: Explore books with details like title, author, genre, and price.
- **Shopping Cart**: Add books, adjust quantities, and checkout securely.
- **Order Management**: View order history and track active orders.

### **Sellers**
- **Inventory Management**: Add, update, and delete book listings.
- **Order Fulfillment**: Manage customer orders efficiently.

### **Admins**
- **Platform Oversight**: Manage users, sellers, and book listings.
- **Reports**: Track platform performance.

### **Common Features**
- Secure **User Registration and Authentication** using JWT.
- **Role-Based Access Control (RBAC)** to ensure security.
- **Responsive Design** for cross-device compatibility.

---

## **Architecture**

### **Technologies Used**

| **Component**   | **Technology**          | **Description**                                   |
|------------------|-------------------------|---------------------------------------------------|
| **Frontend**    | React, Vite             | Custom-built UI for smooth user interactions.    |
| **Backend**     | Node.js, Express.js     | RESTful APIs for business logic and data handling.|
| **Database**    | MongoDB                 | Scalable NoSQL database for data storage.        |

---

## **Setup Instructions**

### **Prerequisites**
- [Node.js (v14+)](https://nodejs.org)
- [MongoDB](https://www.mongodb.com)
- [Git](https://git-scm.com/)

### **Installation**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/salmaanahmeddd/novelle-book-store-nm.git
   cd <project_folder>
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

4. **Set Environment Variables**:
   - **Backend**: Create a `.env` file in the `Backend` folder and add:
     ```env
     MONGO_URI=<your_mongodb_connection_string>
     JWT_SECRET=<your_jwt_secret>
     CLOUDINARY_URL=<your_cloudinary_url>
     PORT=5000
     ```
   - **Frontend**: Create a `.env` file in the `Frontend` folder and add:
     ```env
     VITE_APP_API_URL=http://localhost:5000
     ```

---

## **Folder Structure**

### **Frontend**
- **components**: Reusable UI components (e.g., headers, modals).
- **layouts**: Layouts for admin and user views.
- **pages**: Role-based pages (e.g., Admin Dashboard).
- **styles**: Custom CSS files for styling.

### **Backend**
- **db**: Database schema files.
- **middleware**: Token verification and role-based access middleware.
- **routes**: API routes for users, books, and orders.

---

## **Running the Application**

1. **Run Backend Server**:
   ```bash
   cd Backend
   npm start
   ```

   Backend will start at `http://localhost:5000`.

2. **Run Frontend Development Server**:
   ```bash
   cd Frontend
   npm run dev
   ```

   Frontend will start at `http://localhost:5173`.
