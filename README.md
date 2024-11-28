# DAO

DAO is a full-stack application designed for amateur musicians looking to find other musicians and join ensembles. This project is an exam project, built with React for the frontend and NestJS for the backend, leveraging Turborepo for efficient monorepo management. It uses MongoDB as the database with Mongoose for object modeling.

## Installation

1. Clone the repo:

```bash
git clone https://github.com/Wanesia/DAO.git
```

2. Install dependencies:

```bash
cd DAO
npm i
```

## Environment variables
Create a .env file and include the following:
```bash
# MongoDB connection string
DB_URI=mongodb://localhost:27017/dao

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=60

# Cloudinary configuration
CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_NAME=your_cloudinary_account_name
```

## Run the application
```bash
npm run dev
```
