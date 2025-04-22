# Repair and Accessory Management System

## Table of Contents

- [Introduction](#introduction)
- [Purpose](#purpose)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

## Introduction

This project is a web application built using React and Vite, designed to manage repair orders and accessories. It provides a user-friendly interface for managing customer repair requests, tracking device statuses, and handling accessory inventory.

## Purpose

The primary goal of this project is to streamline the process of managing repair orders and accessories for a repair shop or service center. It aims to improve efficiency by providing a centralized platform for tracking and updating repair statuses, managing customer information, and maintaining an inventory of accessories.

## Features

### Repair Order Management
- Create, update, and delete repair orders.
- Track the status of each repair (e.g., pending, in-progress, completed, cancelled).
- Filter and search repair orders by customer name, device model, or status.

### Accessory Management
- Add, edit, and delete accessories.
- Manage inventory levels and categorize accessories.
- Upload and display images for each accessory.

### User Management
- Admin functionality to view and manage user accounts.
- Secure authentication and authorization using JWT.

### Responsive Design
- Optimized for both desktop and mobile devices.
- Modern UI components with intuitive navigation.

## Technology Stack

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend.
- **Tailwind CSS**: For styling and responsive design.

### Backend
- **Node.js**: For server-side logic.
- **Express**: For building RESTful APIs.
- **Sequelize**: For ORM and database interactions.
- **PostgreSQL**: As the database for storing user, repair, and accessory data.

### Authentication
- **JWT**: For secure user authentication and session management.
- **Bcrypt**: For password hashing.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jaysisharma/Inventory_Management_Full_Stack.git
   cd Inventory_Management_Full_Stack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables (e.g., `JWT_SECRET`, `DATABASE_URL`).

4. **Run the application**:
   ```bash
   npm run dev
   ```

## Future Enhancements

- Implement role-based access control for more granular permissions.
- Add reporting and analytics features for repair and accessory data.
- Integrate with third-party services for enhanced functionality (e.g., payment processing).

## Conclusion

This project provides a comprehensive solution for managing repair orders and accessories, with a focus on usability and efficiency. It leverages modern web technologies to deliver a robust and scalable application.
