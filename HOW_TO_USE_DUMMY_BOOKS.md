# How to Use Dummy Books Data

## 🚀 Quick Start - Two Methods

### Method 1: Use Seed Script (Recommended - Fastest)

1. **Run the seed script:**
   ```bash
   npm run seed:books
   ```

2. **This will:**
   - Connect to your MongoDB database
   - Find the first available user
   - Create 10 dummy books automatically
   - Display all created books

3. **Test in Postman:**
   - GET `http://localhost:5000/api/books` - See all books
   - GET `http://localhost:5000/api/books/:id` - Get a specific book

### Method 2: Manual Entry via Postman

1. **Get a User ID first:**
   - GET `http://localhost:5000/api/auth`
   - Copy any user's `_id` from the response

2. **Create books manually:**
   - POST `http://localhost:5000/api/books`
   - Use the sample JSON from `DUMMY_BOOKS_DATA.md`
   - Replace `REPLACE_WITH_USER_ID` with the actual user ID

## 📋 Sample Book Data

See `DUMMY_BOOKS_DATA.md` for 10 complete book examples including:
- The Great Gatsby
- Dune
- The Girl with the Dragon Tattoo
- The Hobbit
- Steve Jobs
- Pride and Prejudice
- The Da Vinci Code
- Sapiens
- The Shining
- The Adventures of Huckleberry Finn

## 🔧 Troubleshooting

### Seed Script Issues

**Error: "No user found"**
- Solution: Create a user first using POST `/api/auth/signup`
- Then run the seed script again

**Error: "Cannot find module 'ts-node'"**
- Solution: Install ts-node: `npm install --save-dev ts-node`
- Or run: `npx ts-node src/scripts/seedBooks.ts`

**Error: Connection failed**
- Solution: Check your MongoDB connection string in `seedBooks.ts`
- Make sure your database is accessible

### Postman Issues

**Error: "user is required"**
- Solution: Make sure you include a valid user ID in the request body
- Get user ID from GET `/api/auth`

**Error: "Book not found"**
- Solution: Use GET `/api/books` to see all available book IDs
- Make sure the book ID is correct

## 📝 Minimal Book Example

If you just want to test with minimal data:

```json
{
  "title": "Test Book",
  "author": "Test Author",
  "user": "YOUR_USER_ID_HERE"
}
```

Only `title`, `author`, and `user` are required fields.

## ✅ Verify Books Were Created

After seeding or creating books:

1. **Get all books:**
   ```
   GET http://localhost:5000/api/books
   ```

2. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Books retrieved successfully",
     "data": [
       {
         "_id": "...",
         "title": "The Great Gatsby",
         "author": "F. Scott Fitzgerald",
         ...
       },
       ...
     ]
   }
   ```

## 🎯 Next Steps

1. ✅ Run seed script or create books manually
2. ✅ Test GET all books endpoint
3. ✅ Test GET single book endpoint
4. ✅ Test UPDATE book endpoint
5. ✅ Test DELETE book endpoint

Happy testing! 🚀
