# Ecommerce-API Project

Welcome to the Ecommerce-API Project! This project provides a set of API endpoints to support various e-commerce operations such as product and category management, cart handling, order processing, user registration, and authentication. The APIs are built using Node.js, Express, MongoDB, and utilize JSON Web Tokens (JWT) for user authentication.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- MongoDB: [https://www.mongodb.com/](https://www.mongodb.com/)
- Git (optional): [https://git-scm.com/](https://git-scm.com/)

## Getting Started

Follow these steps to set up the project on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/e-commerce-api.git
   
Alternatively, download the project as a ZIP file from GitHub.

Navigate to the project directory:
cd e-commerce-api

Install project dependencies:
npm install

Create a .env file in the project root and add the following environment variables:
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
Replace your-secret-key with a strong secret key for JWT encryption.

Start the server:
npm start
The server will run at 'http://localhost:3000'

API Endpoints
The project provides the following API endpoints:

POST /register: User registration.
POST /login: User login.
GET /categories: Retrieve a list of categories.
GET /products/:categoryId: Retrieve products based on a category.
GET /product/:productId: Retrieve detailed product information.
POST /cart/add: Add a product to the user's cart.
GET /cart/:userId: View the user's cart.
PUT /cart/update/:userId/:productId: Update cart item quantity.
DELETE /cart/remove/:userId/:productId: Remove a product from the cart.
POST /order/place: Place an order using products from the cart.
GET /order/history/:userId: Retrieve the order history for a user.
GET /order/details/:orderId: Retrieve detailed information of a specific order.
