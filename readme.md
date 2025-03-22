# Recipe App Backend 🍽️

## Overview
This is the **backend for the Recipe App**, built using **Node.js, Express, and MongoDB**. It provides a REST API for managing recipes, users, and favorites.

## Features
✅ **CRUD operations for recipes** (Create, Read, Update, Delete)  
✅ **Search & Filter** recipes by name and category  
✅ **User system** (Register users with email)  
✅ **Save & retrieve favorite recipes**  

## Tech Stack
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Mongoose ORM)  
- **API Testing:** Postman  

## Installation & Setup
### 1️⃣ Clone the Repository
```sh
git https://github.com/itzxtito/capstone-backend.git
cd backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Create a `.env` File

Inside the **backend** folder, create a file named `.env` and add:
```sh
MONGO_URI="mongodb+srv://itzxtito:Titojose100@cluster0.xxu6e.mongodb.net/Capstone?retryWrites=true&w=majority&appName=Cluster0"
PORT=5001

Replace `your_mongodb_connection_string` with your actual MongoDB URI.
```

### 4️⃣ Start the Backend Server
```sh
node server.js
```
The server should now run at:  
```
http://localhost:5001
```

---

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | Get all recipes (supports search & filter) |
| `GET` | `/api/recipes/:id` | Get a single recipe |
| `POST` | `/api/recipes` | Add a new recipe |
| `PUT` | `/api/recipes/:id` | Update a recipe |
| `DELETE` | `/api/recipes/:id` | Delete a recipe |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/users/:email/favorites` | Save a recipe to favorites |
| `GET` | `/api/users/:email/favorites` | Get a user’s favorite recipes |

---

## How to Test the API (Postman)
1. Open **Postman**  
2. Use `http://localhost:5001/api/recipes` for testing  
3. **Example: Add a Recipe**  
   - Method: `POST`  
   - URL: `http://localhost:5001/api/recipes`  
   - Body (JSON):  
     ```json
     {
       "name": "Spaghetti Carbonara",
       "category": "Italian",
       "ingredients": ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black Pepper"],
       "instructions": "Boil spaghetti. Fry pancetta. Mix eggs and cheese. Combine everything.",
       "image": "https://source.unsplash.com/400x300/?pasta"
     }
     ```
4. **Search Recipes by Name**  
   ```
   GET http://localhost:5001/api/recipes?search=pasta
   ```
5. **Filter by Category**  
   ```
   GET http://localhost:5001/api/recipes?category=Italian
   ```
6. **Save a Recipe to Favorites**  
   ```
   POST http://localhost:5001/api/users/test@example.com/favorites
   Body: { "recipeId": "64a1d7f0e4b3f4e2d3b5c9a1" }
   ```
7. **Retrieve User Favorites**  
   ```
   GET http://localhost:5001/api/users/test@example.com/favorites
   ```

---

## Future Improvements
🔹 More Recipes!

## Author
📌 **Tito Feliciano** – [GitHub Profile](https://github.com/itzxtito)
