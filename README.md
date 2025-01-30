# GuestHouse Backoffice System

Welcome to the **GuestHouseBackOffice** project! This repository contains two main components: a backend built with ASP.NET Core and a frontend developed using React. Together, they provide a robust solution for managing guesthouse operations, including booking, user management, and reporting.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Installation and Setup](#installation-and-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

---

## Project Overview

**GuestHouseBackOffice** is designed to streamline the management of guesthouses by providing:
- A backend API to handle data storage, authentication, and business logic.
- A frontend application for an intuitive user interface to manage bookings, guests, and reports.

This project aims to simplify operations for guesthouse owners and staff by offering a centralized platform.

---

## Tech Stack

### Backend (GuestHouseBackOffice.Backend)
- **Framework**: ASP.NET Core 9
- **Database**: MySQL Server
- **Authentication**: ASP.NET Identity with JWT
- **Other Tools**: MediatR for CQRS pattern

### Frontend (GuestHouseBackOffice.Frontend)
- **Framework**: React 18
- **State Management**: Zustand
- **Styling**: AntDesign, SASS
- **API Communication**: Axios

---

## Features

### Backend Features:
- User authentication and role-based authorization.
- RESTful APIs for managing bookings, users, and reports.
- Implementation of CQRS using MediatR for clean architecture.
- Secure communication with JWT tokens.

### Frontend Features:
- Responsive design for desktop and mobile devices.
- User-friendly interface for managing bookings and guests.
- Integration with the backend API for real-time data updates.
- Error handling and notifications for better user experience.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- .NET SDK 9.0+
- Node.js 18+
- MySQL Server

### Backend Setup
1. Clone the repository
2. Update the connection string in `appsettings.json`:
   cd /guesthouse.backoffice/GuestHouseBackOffice.Backend/GuestHouseBackOffice.Api/Properties/launchSettings.json
3. Apply migrations to set up the database:
    cd /guesthouse.backoffice/GuestHouseBackOffice.Backend/GuestHouseBackOffice.Infrastructure/Migrations
   dotnet ef database update
4. Run the backend application:
    dotnet run

The backend will start on `http://localhost:5005` by default.

### Frontend Setup
1. Navigate to the frontend directory:
   cd /guesthouse.backoffice/GuestHouseBackOffice.Frontend
2. Install dependencies:
   npm install
3. Create a `.env` file in the root of the frontend directory with the following content:
   VITE_BE_API_PATH=http://localhost:5005/
4. Start the development server:
    npm run dev

The frontend will start on `http://localhost:3000`.

---

## Usage

1. Access the frontend at `http://localhost:3000`.
2. Use the login page to authenticate with your credentials.
3. Navigate through the dashboard to manage bookings, guests, and reports.

---

## Contributing

We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

Please ensure your code adheres to our coding standards and is well-documented.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Feel free to reach out if you have any questions or suggestions!
"""