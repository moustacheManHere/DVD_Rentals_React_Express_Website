# DVD Rental Shop Website

## Overview

This project is a DVD rental website built using React for the frontend and Node.js with Express for the backend. It allows customers to browse and rent DVDs, create accounts, like and review DVDs, and more. The website relies on a MySQL database to store and manage DVD rental data.

## Getting Started

### Prerequisites

- **MySQL Server**: Make sure you have MySQL Server and MySQL Workbench installed. You'll need this to create and manage the database.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/moustacheManHere/DVD_Rentals_React_Express_Website.git
   ```

2. In your MySQL Workbench, run the "newSakila.sql" script included in the project to create the necessary database. If a database with the same name exists, it will be replaced, so be cautious.

3. Open the project in your code editor (e.g., Visual Studio Code).

4. In the project directory (where both frontend and backend folders are located), open your terminal and run the following command to install the dependencies:

   ```bash
   npm install
   ```

5. After the installation is complete, you can start the project by running:

   ```bash
   npm start
   ```

6. Access the website in your browser at `http://localhost:3001`.

### Usage

- To access the website as a regular user, use the following login credentials:
  - Email: "PATRICIA.JOHNSON@sakilacustomer.org"
  - Password: "yes"

- To access the website as an admin, use the following login credentials:
  - Username: "admin"
  - Password: "admin"

## Features

- **Browse DVDs**: Users can browse the available DVDs in the shop.
- **Account Creation**: Users can create accounts and log in.
- **Rental**: Users can rent DVDs.
- **Likes and Reviews**: Users can like and review DVDs.
- **Admin Panel**: Admins have access to an admin panel for managing DVDs and users.

## Database Schema

The MySQL database schema is defined in the "newSakila.sql" script. It includes tables for customers, rentals, DVDs, likes, reviews, and more.

## License

This project is licensed under the MIT License

