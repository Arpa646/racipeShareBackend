# Frontend API Integration Guide

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication

### Getting Token
1. Login: `POST /auth/login`
2. Response includes `accessToken`
3. Store token and use in headers

### Using Token
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📋 Quick Reference

### Auth Endpoints

#### Login
```javascript
POST /auth/login
Body: { email, password }
Response: { accessToken, user }
```

#### Signup
```javascript
POST /auth/signup
Body: { user: { name, email, password, phone, role, address } }
Response: { user data }
```

### Books Endpoints

#### Get All Books
```javascript
GET /books
Response: { success: true, data: [books] }
```

#### Get Single Book
```javascript
GET /books/:id
Response: { success: true, data: book }
```

#### Create Book
```javascript
POST /books
Body: { title, author, description, isbn, coverImage, publishedDate, genre, pages, user }
Response: { success: true, data: book }
```

#### Update Book
```javascript
PUT /books/:id
Body: { title?, author?, description?, ... }
Response: { success: true, data: updatedBook }
```

#### Delete Book
```javascript
DELETE /books/:id
Response: { success: true, message: "Book deleted successfully" }
```

### Genres Endpoints

#### Get All Genres (Public)
```javascript
GET /genres
Response: { success: true, data: [genres] }
```

#### Get Single Genre (Public)
```javascript
GET /genres/:id
Response: { success: true, data: genre }
```

#### Create Genre (Admin Only)
```javascript
POST /genres
Headers: { Authorization: Bearer TOKEN }
Body: { name, description? }
Response: { success: true, data: genre }
```

#### Update Genre (Admin Only)
```javascript
PUT /genres/:id
Headers: { Authorization: Bearer TOKEN }
Body: { name?, description? }
Response: { success: true, data: updatedGenre }
```

#### Delete Genre (Admin Only)
```javascript
DELETE /genres/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success: true, message: "Genre deleted successfully" }
```

### Recipes Endpoints

#### Get All Recipes
```javascript
GET /recipies
Response: { success: true, data: [recipes] }
```

#### Create Recipe
```javascript
POST /recipies
Body: { title, time, image, recipe, user, rating }
Response: { success: true, data: recipe }
```

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details (optional)"
}
```

## 🚨 Common Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

## 💡 Example Usage

### React/JavaScript Example
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.accessToken);
  return data;
};

// Get Books (with auth)
const getBooks = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/books', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};

// Create Book
const createBook = async (bookData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/books', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  });
  return await response.json();
};
```

## 📝 Important Notes

1. **Admin Routes**: Genres create/update/delete require admin role
2. **Soft Delete**: Delete operations set `isDeleted=true`, data remains in DB
3. **Timestamps**: All models auto-include `createdAt` and `updatedAt`
4. **Populated Fields**: User references return full user object
5. **Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

## 🔍 Full API Reference

See `API_DATA_FORMAT.json` for complete request/response examples.
