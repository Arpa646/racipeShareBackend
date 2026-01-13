# Dummy Genres Data

## 📚 Sample Genre Data for POST Requests

### Genre 1 - Fiction
```json
{
  "name": "Fiction",
  "description": "Literary works of imagination, including novels, short stories, and novellas that are not based on real events."
}
```

### Genre 2 - Non-Fiction
```json
{
  "name": "Non-Fiction",
  "description": "Books based on facts, real events, and real people, such as biography, history, and self-help books."
}
```

### Genre 3 - Science Fiction
```json
{
  "name": "Science Fiction",
  "description": "Fiction that deals with imaginative content such as futuristic settings, futuristic science and technology, space travel, time travel, faster than light travel, parallel universes, and extraterrestrial life."
}
```

### Genre 4 - Fantasy
```json
{
  "name": "Fantasy",
  "description": "Fiction that uses magic or other supernatural elements as a main plot element, theme, or setting."
}
```

### Genre 5 - Mystery
```json
{
  "name": "Mystery",
  "description": "Fiction in which a detective or other professional solves a crime or series of crimes."
}
```

### Genre 6 - Thriller
```json
{
  "name": "Thriller",
  "description": "Fiction that provides excitement, suspense, and high levels of anticipation."
}
```

### Genre 7 - Romance
```json
{
  "name": "Romance",
  "description": "Fiction that focuses on the relationship and romantic love between two people."
}
```

### Genre 8 - Horror
```json
{
  "name": "Horror",
  "description": "Fiction intended to scare, unsettle, or horrify the reader."
}
```

### Genre 9 - Biography
```json
{
  "name": "Biography",
  "description": "An account of someone's life written by someone else."
}
```

### Genre 10 - History
```json
{
  "name": "History",
  "description": "Books about past events, particularly in human affairs."
}
```

## 🔧 How to Use

### Method 1: Use Seed Script (Recommended)

Run the seed script to automatically create 25+ genres:
```bash
npm run seed:genres
```

### Method 2: Manual Entry via Postman

1. **Get Admin Token:**
   - Login as an admin user: `POST /api/auth/login`
   - Copy the `accessToken` from the response
   - Set it in Postman environment variable `adminToken` or use it in the Authorization header

2. **Create Genres:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/genres`
   - Headers: 
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_ADMIN_TOKEN`
   - Body: Copy any of the JSON examples above

3. **View All Genres:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/genres`
   - No authentication required (public endpoint)

4. **Update Genre:**
   - Method: `PUT`
   - URL: `http://localhost:5000/api/genres/:id`
   - Headers: Include admin token
   - Body: Updated genre data

5. **Delete Genre:**
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/genres/:id`
   - Headers: Include admin token

## 📝 Minimal Genre Data

Only `name` is required:
```json
{
  "name": "New Genre"
}
```

## 🔐 Admin Authentication

All create, update, and delete operations require admin authentication:
- Include JWT token in Authorization header: `Bearer YOUR_TOKEN`
- Token must be from a user with `role: "admin"`
- Get token by logging in as admin user

## ✅ Verify Genres Were Created

After seeding or creating genres:

1. **Get all genres:**
   ```
   GET http://localhost:5000/api/genres
   ```

2. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Genres retrieved successfully",
     "data": [
       {
         "_id": "...",
         "name": "Fiction",
         "description": "...",
         "isDeleted": false,
         "createdAt": "...",
         "updatedAt": "..."
       },
       ...
     ]
   }
   ```

## 🎯 Complete Genre List (25 Genres)

The seed script includes:
1. Fiction
2. Non-Fiction
3. Science Fiction
4. Fantasy
5. Mystery
6. Thriller
7. Romance
8. Horror
9. Biography
10. Autobiography
11. History
12. Philosophy
13. Self-Help
14. Business
15. Science
16. Technology
17. Health & Fitness
18. Travel
19. Cooking
20. Poetry
21. Drama
22. Comedy
23. Adventure
24. Young Adult
25. Children's

Happy testing! 🚀
