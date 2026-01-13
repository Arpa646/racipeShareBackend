# Postman Collection Setup Guide

This guide will help you import and use the Postman collection for the Recipe Share Backend API.

## 📦 Files Included

1. **RecipeShareBackend.postman_collection.json** - Complete API collection
2. **RecipeShareBackend.postman_environment.json** - Environment variables

## 🚀 Quick Start

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **RecipeShareBackend.postman_collection.json**
4. Click **Import**

### Step 2: Import Environment

1. Click **Import** button again
2. Select **RecipeShareBackend.postman_environment.json**
3. Click **Import**
4. Select the environment from the dropdown (top right) - "Recipe Share Backend - Local"

### Step 3: Configure Base URL

The default base URL is set to `http://localhost:5000/api`. If your server runs on a different port or URL, update it in the environment variables.

## 📚 API Endpoints Overview

### 🔐 Auth Endpoints
- **POST** `/auth/login` - User login
- **POST** `/auth/forgot-password` - Request password reset
- **GET** `/auth/reset-password/:id` - Get reset password page
- **POST** `/auth/reset-password/:id` - Reset password
- **POST** `/auth/change-password/:id` - Change password

### 👤 User Endpoints
- **POST** `/auth/signup` - Register new user
- **GET** `/auth` - Get all users
- **GET** `/auth/:id` - Get single user
- **PUT** `/auth/updateprofile/:id` - Update user profile
- **DELETE** `/auth/:id` - Delete user
- **PUT** `/auth/change-block/:id` - Toggle user block status
- **POST** `/auth/follow` - Follow a user
- **POST** `/auth/unfollow` - Unfollow a user

### 📚 Book Endpoints
- **POST** `/books` - Create/Add a new book
- **GET** `/books` - Get all books
- **GET** `/books/:id` - Get single book
- **PUT** `/books/:id` - Update a book
- **DELETE** `/books/:id` - Delete a book

### 🍳 Recipe Endpoints
- **POST** `/recipies` - Create a new recipe
- **GET** `/recipies` - Get all recipes
- **GET** `/recipies/:id` - Get single recipe
- **GET** `/recipies/userrecipe/:email` - Get recipes by user email
- **PUT** `/recipies/update/:id` - Update a recipe
- **PUT** `/recipies/:id` - Toggle recipe published status
- **DELETE** `/recipies/:id` - Delete a recipe
- **POST** `/recipies/comment` - Add comment to recipe
- **DELETE** `/recipies/deletecomment/:id` - Delete a comment
- **POST** `/recipies/rating` - Rate a recipe
- **POST** `/recipies/like` - Like a recipe
- **POST** `/recipies/dislike` - Dislike a recipe

### 💎 Premium Endpoints
- **POST** `/premium` - Make user premium (initiate payment)
- **GET** `/premium/success` - Payment success callback

## 📝 Request Examples

### Create Book
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel",
  "isbn": "978-0-7432-7356-5",
  "coverImage": "https://example.com/book-cover.jpg",
  "publishedDate": "1925-04-10",
  "genre": "Fiction",
  "pages": 180,
  "user": "user_id_here"
}
```

### Create Recipe
```json
{
  "title": "Chocolate Cake",
  "time": "45 minutes",
  "image": "https://example.com/cake.jpg",
  "recipe": "Mix flour, sugar, eggs, and chocolate...",
  "user": "user_id_here",
  "rating": 4.5
}
```

### Sign Up
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "user",
    "address": "123 Main St"
  }
}
```

## 🔧 Environment Variables

The environment includes these variables:
- `baseUrl` - Base API URL (default: `http://localhost:5000/api`)
- `userId` - Store user ID for easy access
- `bookId` - Store book ID for easy access
- `recipeId` - Store recipe ID for easy access

## 💡 Tips

1. **Replace Placeholders**: Replace `user_id_here`, `book_id_here`, `recipe_id_here` with actual IDs from your database
2. **Use Environment Variables**: Store frequently used IDs in environment variables
3. **Test in Order**: 
   - First create a user (Sign Up)
   - Then login to get authentication token (if using JWT)
   - Create books/recipes using the user ID
4. **Check Responses**: All endpoints return JSON with `success`, `message`, and `data` fields

## 🐛 Troubleshooting

- **Connection Error**: Make sure your server is running on port 5000
- **404 Not Found**: Check that the base URL is correct
- **400 Bad Request**: Verify request body matches the expected format
- **500 Server Error**: Check server logs for detailed error messages

## 📞 Support

For issues or questions, check the server logs or API documentation.
