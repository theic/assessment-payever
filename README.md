# Backend Software Web Engineer (m/f/x) Assessment at payever

This repository contains a NestJS application developed as part of the Backend Software Web Engineer (m/f/x) assessment at payever.

## Table of Contents
- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Description
The application is a backend system built using NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It provides API endpoints for managing users, handling file uploads, and integrating with external services such as RabbitMQ and MongoDB.

## Prerequisites
Before running the application, ensure that you have the following dependencies installed:
- Node.js (version >= 16)
- npm (version >= 6)
- RabbitMQ server
- MongoDB server

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/theic/assesment-payever.git
   ```

2. Install the dependencies:
   ```
   cd your-repository
   npm ci
   ```

## Configuration
1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:
   ```
   RABBITMQ_URI=amqp://localhost:5672
   MONGODB_URI=mongodb://localhost:27017/
   MONGODB_NAME=your-database-name
   USER_QUEUE_NAME=user_queue
   HTTP_PORT=3000
   ```

   Replace the placeholder values with your actual RabbitMQ and MongoDB connection details.

## Running the Application
To start the application in development mode, run the following command:
```
npm run start:dev
```

This command will start the NestJS application with hot-reloading enabled.

## API Endpoints
The application provides the following API endpoints:
- `POST /api/user`: Create a new local user.
- `GET /api/user/:userId`: Get external user info by ID.
- `GET /api/user/:userId/avatar`: Get the avatar of a user.
- `DELETE /api/user/:userId`: Delete a user by ID.

For detailed information about the request and response formats, please refer to the API documentation.

## Technologies Used
The application utilizes the following technologies and frameworks:
- NestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- RabbitMQ: A messaging queue system used for asynchronous communication between services.
- MongoDB: A NoSQL database used for storing user data and file metadata.
- class-validator: A library for validating and sanitizing input data using decorators.
- class-transformer: A library for transforming plain objects to instances of classes and vice versa.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

## Project Structure
The project follows the standard NestJS project structure:
- `src/`: Contains the source code of the application.
  - `user/`: User module responsible for user-related functionality.
  - `file/`: File module responsible for file upload and management.
- `test/`: Contains the unit and integration tests for the application.
- `config/`: Configuration files for different environments.
- `dist/`: The compiled output of the application.

## Contributing
Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
