# Dummy Books Data for Postman Testing

## 📚 Sample Book Data for POST Requests

### Book 1 - Fiction
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
  "isbn": "978-0-7432-7356-5",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg",
  "publishedDate": "1925-04-10",
  "genre": "Fiction",
  "pages": 180,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 2 - Science Fiction
```json
{
  "title": "Dune",
  "author": "Frank Herbert",
  "description": "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
  "isbn": "978-0-441-17271-9",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/81zN2U0A1kL.jpg",
  "publishedDate": "1965-08-01",
  "genre": "Science Fiction",
  "pages": 688,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 3 - Mystery
```json
{
  "title": "The Girl with the Dragon Tattoo",
  "author": "Stieg Larsson",
  "description": "A journalist and a hacker investigate a decades-old disappearance.",
  "isbn": "978-0-307-26975-1",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/91Q5d6Tc6OL.jpg",
  "publishedDate": "2005-08-01",
  "genre": "Mystery",
  "pages": 672,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 4 - Fantasy
```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "description": "Bilbo Baggins goes on an unexpected journey to help a group of dwarves reclaim their homeland.",
  "isbn": "978-0-544-17697-3",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/712cDO7d73L.jpg",
  "publishedDate": "1937-09-21",
  "genre": "Fantasy",
  "pages": 310,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 5 - Biography
```json
{
  "title": "Steve Jobs",
  "author": "Walter Isaacson",
  "description": "The exclusive biography of the Apple co-founder, based on more than forty interviews with Jobs conducted over two years.",
  "isbn": "978-1-4516-4853-9",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/81VStYnDGrL.jpg",
  "publishedDate": "2011-10-24",
  "genre": "Biography",
  "pages": 656,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 6 - Romance
```json
{
  "title": "Pride and Prejudice",
  "author": "Jane Austen",
  "description": "The romantic story of Elizabeth Bennet and Mr. Darcy in 19th century England.",
  "isbn": "978-0-14-143951-8",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg",
  "publishedDate": "1813-01-28",
  "genre": "Romance",
  "pages": 432,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 7 - Thriller
```json
{
  "title": "The Da Vinci Code",
  "author": "Dan Brown",
  "description": "A murder in the Louvre museum leads to a trail of clues hidden in the works of Leonardo da Vinci.",
  "isbn": "978-0-385-50420-5",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/71QxYz8VHxL.jpg",
  "publishedDate": "2003-03-18",
  "genre": "Thriller",
  "pages": 489,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 8 - Non-Fiction
```json
{
  "title": "Sapiens: A Brief History of Humankind",
  "author": "Yuval Noah Harari",
  "description": "A brief history of how Homo sapiens conquered the world.",
  "isbn": "978-0-06-231609-7",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/713jIo8EGsL.jpg",
  "publishedDate": "2011-02-10",
  "genre": "Non-Fiction",
  "pages": 443,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 9 - Horror
```json
{
  "title": "The Shining",
  "author": "Stephen King",
  "description": "A writer becomes the winter caretaker of an isolated hotel where his son sees terrifying visions.",
  "isbn": "978-0-385-12167-5",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/81Th0bAZJDL.jpg",
  "publishedDate": "1977-01-28",
  "genre": "Horror",
  "pages": 447,
  "user": "REPLACE_WITH_USER_ID"
}
```

### Book 10 - Adventure
```json
{
  "title": "The Adventures of Huckleberry Finn",
  "author": "Mark Twain",
  "description": "The story of a young boy's journey down the Mississippi River with a runaway slave.",
  "isbn": "978-0-14-243717-9",
  "coverImage": "https://images-na.ssl-images-amazon.com/images/I/71h5+dp8vIL.jpg",
  "publishedDate": "1884-12-10",
  "genre": "Adventure",
  "pages": 366,
  "user": "REPLACE_WITH_USER_ID"
}
```

## 🔧 How to Use in Postman

1. **First, get a User ID:**
   - Make a GET request to: `http://localhost:5000/api/auth`
   - Copy any user's `_id` from the response
   - Replace `REPLACE_WITH_USER_ID` in the JSON above with the actual user ID

2. **Create Books:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/books`
   - Headers: `Content-Type: application/json`
   - Body: Copy any of the JSON examples above (with user ID replaced)

3. **Get All Books:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/books`

4. **Get Single Book:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/books/:id`
   - Replace `:id` with a book ID from the database

## 📝 Minimal Book Data (Required Fields Only)

If you want to test with minimal data, only these fields are required:
- `title` (required)
- `author` (required)
- `user` (required - user ID)

```json
{
  "title": "Simple Book Title",
  "author": "Author Name",
  "user": "REPLACE_WITH_USER_ID"
}
```
