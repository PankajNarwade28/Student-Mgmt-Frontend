# MINI Production-Level ERP – Student Management System

## Project Overview

A mini production-level ERP Student Management System built using the PERN stack with TypeScript, implementing Role-Based Access Control (RBAC) for **Admin**, **Teacher**, and **Student** roles. The system follows clean architecture principles with proper separation of concerns, centralized error handling, secure APIs, and a fully responsive UI using Tailwind CSS.

---

# 📁 FRONTEND REPOSITORY README

## Description

This repository contains the **Frontend application** of the ERP Student Management System. It provides a modern, fully responsive user interface with protected routes and role-based views for Admin, Teacher, and Student users. The frontend ensures strong data validation, secure API handling, and smooth user experience across devices.

## Key Features

* Role-based UI (Admin / Teacher / Student)
* Secure authentication & protected routes
* Course listing, enrollment & management
* Student enrollment requests and status tracking
* Teacher announcements (notes & notices)
* Admin dashboard for approvals and recent activities
* Advanced filtering & responsive layouts
* Centralized API handling

## Tech Stack

* React.js
* TypeScript
* Tailwind CSS
* Axios (API handling)
* Zod (Frontend data validation)
* React Router (Protected routes)
* Context API / State Management

## Folder Structure (High-Level)

```
src/
 ├─ components/
 ├─ pages/
 ├─ routes/
 ├─ services/        # Axios API layer
 ├─ validations/     # Zod schemas
 ├─ hooks/
 ├─ utils/
 └─ styles/
```

## Security & Architecture

* Protected routes based on user role
* Centralized API error handling
* Clean separation between UI, logic, and API layers

## Frontend Skills Demonstrated

* Role-Based Access Control (RBAC)
* Secure frontend routing
* Scalable UI architecture
* Strong TypeScript usage
* Production-ready validation patterns
* Responsive design using Tailwind CSS

---
