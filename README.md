# ZooExplore 🦁🐘🐒

## Project Overview

ZooExplore is a comprehensive web application designed for managing and showcasing an animal park's collection. The project provides an interactive platform for visitors to explore animals and an administrative interface for park management.

![image](https://github.com/prosabd/zoo-symfony-react/releases/download/README/home.png)

### Key Features
- Public animal catalog with detailed information
- Secure administrative data management
- Responsive and modern web interface
- Easy-to-use animal information system

![image](https://github.com/prosabd/zoo-symfony-react/releases/download/README/detail.png)
## Technical Stack

### Backend
- Framework: Symfony (PHP 8.2+)
- API: API Platform
- Authentication: JWT (JSON Web Token)
- Database: MySQL

### Frontend
- Framework: Vite React
- Styling: Typescript, Tailwind CSS
- Routing: React Router
- UI Components: ShadCN UI

## Installation Guide

### 🐳 Option 1: Docker Installation (Recommended)

#### Prerequisites
- Docker
- Docker Compose

#### Steps
```bash
# Clone the repository
git clone https://github.com/prosabd/zoo-symfony-react.git
cd zoo-symfony-react

# Configure database connection in .env file
cp .env .env.local
# Edit .env.local with your database credentials

# Start the Docker containers
docker-compose up -d

# Initial setup
docker-compose exec fpm composer install
docker-compose exec fpm php bin/console doctrine:migrations:migrate -n
docker-compose exec fpm php bin/console doctrine:fixtures:load -n
```

### 💻 Option 2: Manual Installation

#### Backend Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+
- Symfony CLI (optional but recommended)

#### Frontend Prerequisites
- Node.js 18+
- npm or bun

#### Installation Steps
```bash
# Clone the repository
git clone https://github.com/prosabd/zoo-symfony-react
cd zoo-symfony-react
cd backend

# Backend setup
composer install

# Configure database connection in .env file
cp .env .env.local
# Edit .env.local with your database credentials
# Create database and run migrations
symfony console doctrine:database:create
# or
php bin/console doctrine:database:create

symfony console doctrine:migrations:migrate
# or
php bin/console doctrine:migrations:migrate

# Generate JWT keys
symfony console lexik:jwt:generate-keypair
# or
php bin/console lexik:jwt:generate-keypair

# Initial data from fixtures
symfony console doctrine:fixtures:load
# or
php bin/console doctrine:fixtures:load

# Frontend setup
cd ../frontend
npm install
npm run dev
```

## Access the Application
**Backend API documentation is available at:** http://localhost:8000/api/docs

**Frontend application:** http://localhost:3000

![image](https://github.com/prosabd/zoo-symfony-react/releases/download/README/animals.png)
## Authentication

- Admin access is secured via JWT tokens
- Use the dedicated admin interface for users, animals, families, continents data management

**Default credentials:**   

    Emails: 
     
     +---------------------+----------------------------+
     | email               | roles                      |
     +---------------------+----------------------------+
     | user@test.com       | ["ROLE_USER"]              |
     | user-test@test.com  | ["ROLE_USER"]              |
     | admin@test.com      | ["ROLE_USER","ROLE_ADMIN"] |
     | admin-test@test.com | ["ROLE_USER","ROLE_ADMIN"] |
     +---------------------+----------------------------+

    Password: password

![image](https://github.com/prosabd/zoo-symfony-react/releases/download/README/login.png)

### Protected Actions
**Only authenticated admin users can:**

    - Edit entities
    - Delete entities
    - Create new entities

![image](https://github.com/prosabd/zoo-symfony-react/releases/download/README/dashboard.png)

## Current Project Status

⚠️ **Docker Configuration Note**: 
The Docker setup is currently being refined. While it may not work perfectly, we are actively addressing configuration issues. Manual installation is recommended for the most stable experience.
