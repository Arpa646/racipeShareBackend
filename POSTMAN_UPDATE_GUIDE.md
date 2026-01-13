# How to Update Postman Collection

## 🔄 Method 1: Import Updated Collection (Recommended)

### Step 1: Open Postman
1. Launch Postman application

### Step 2: Import the Collection
1. Click **Import** button (top left corner)
2. Click **Upload Files** or drag and drop
3. Select the file: `RecipeShareBackend.postman_collection.json`
4. Click **Import**

### Step 3: Replace Existing Collection
- If you already have the collection, Postman will ask:
  - **Replace** - This will update your existing collection with new endpoints
  - **Create a copy** - This will create a duplicate (not recommended)

Choose **Replace** to update with the new endpoints.

## 🔄 Method 2: Manual Update (If Import Doesn't Work)

### Step 1: Delete Old Collection
1. Right-click on the existing collection
2. Select **Delete**
3. Confirm deletion

### Step 2: Import Fresh Collection
1. Click **Import**
2. Select `RecipeShareBackend.postman_collection.json`
3. Click **Import**

## ✅ Verify Update

After importing, you should see these new folders:
- ✅ **Reviews** (9 endpoints, including 2 admin-only endpoints)
- ✅ **Shelf** (7 endpoints)
- ✅ **Tutorials** (5 endpoints)

## 📋 New Endpoints Added

### Reviews (`/api/reviews`)
- POST `/reviews` - Create Review
- GET `/reviews` - Get All Reviews (supports optional `?status=pending` or `?status=approved` query)
- GET `/reviews?status=pending` - Get Pending Reviews (Admin Only) ⚠️
- GET `/reviews/book/:bookId` - Get Reviews by Book
- GET `/reviews/user/:userId` - Get Reviews by User
- GET `/reviews/:id` - Get Single Review
- PUT `/reviews/:id` - Update Review
- PATCH `/reviews/:id/approve` - Approve Review (Admin Only) ⚠️
- DELETE `/reviews/:id` - Delete Review

### Shelf (`/api/shelf`)
- POST `/shelf` - Add Book to Shelf
- GET `/shelf` - Get All Shelf Entries
- GET `/shelf/user/:userId` - Get User Shelf
- GET `/shelf/book/:bookId` - Get Shelf Entries by Book
- GET `/shelf/:id` - Get Single Shelf Entry
- PUT `/shelf/:id` - Update Shelf Entry
- DELETE `/shelf/:id` - Remove Book from Shelf

### Tutorials (`/api/tutorials`)
- POST `/tutorials` - Create Tutorial
- GET `/tutorials` - Get All Tutorials
- GET `/tutorials/:id` - Get Single Tutorial
- PUT `/tutorials/:id` - Update Tutorial
- DELETE `/tutorials/:id` - Delete Tutorial

## 🔧 Quick Test

1. **Test Reviews:**
   ```
   POST http://localhost:5000/api/reviews
   Body: {
     "userId": "user_id",
     "bookId": "book_id",
     "rating": 5,
     "comment": "Great book!"
   }
   ```

4. **Test Admin Review Endpoints:**
   ```
   # Get pending reviews (requires admin token)
   GET http://localhost:5000/api/reviews?status=pending
   Headers: { Authorization: Bearer <admin_token> }
   
   # Approve a review (requires admin token)
   PATCH http://localhost:5000/api/reviews/:review_id/approve
   Headers: { Authorization: Bearer <admin_token> }
   ```

2. **Test Shelf:**
   ```
   POST http://localhost:5000/api/shelf
   Body: {
     "userId": "user_id",
     "bookId": "book_id",
     "status": "reading",
     "progress": 50
   }
   ```

3. **Test Tutorials:**
   ```
   POST http://localhost:5000/api/tutorials
   Body: {
     "title": "How to Read",
     "youtubeUrl": "https://www.youtube.com/watch?v=..."
   }
   ```

## 💡 Tips

1. **Environment Variables:**
   - Make sure `baseUrl` is set to `http://localhost:5000/api`
   - Set `adminToken` if testing admin-only endpoints (required for:
     - GET `/reviews?status=pending`
     - PATCH `/reviews/:id/approve`)

2. **Replace Placeholders:**
   - Replace `user_id_here`, `book_id_here`, etc. with actual IDs
   - Get IDs from previous API calls (GET requests)

3. **Collection Variables:**
   - The collection includes `baseUrl` and `adminToken` variables
   - Update them in the collection settings if needed

## 🐛 Troubleshooting

**Problem:** Collection not updating
- **Solution:** Delete the old collection and import fresh

**Problem:** Endpoints not showing
- **Solution:** Refresh Postman or restart the application

**Problem:** Variables not working
- **Solution:** Check collection variables in the collection settings

## 📝 File Location

The Postman collection file is located at:
```
RecipeShareBackend.postman_collection.json
```

This file contains all endpoints including the newly added:
- Reviews
- Shelf
- Tutorials

Happy testing! 🚀
