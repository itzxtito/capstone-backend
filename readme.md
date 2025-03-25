## 📦 Potluck Recipe API (Backend)

This is the **backend REST API** for the Potluck Recipe App, built with **Node.js, Express, and MongoDB**. It handles all data operations including authentication, recipe management, comments, and favorites.

---

## 🌐 Live API

- **Backend URL (Render)**: [https://capstone-backend-zdhp.onrender.com](https://capstone-backend-zdhp.onrender.com)

Visit [https://capstone-backend-zdhp.onrender.com/api/recipes](https://capstone-backend-zdhp.onrender.com/api/recipes) to test and view live recipe data in JSON format.

## 🛠 Environment Variables (.env)

Your `.env` file should include:

PORT=5001  
MONGO_URI=mongodb+srv://itzxtito:<your-password>@cluster0.xxu6e.mongodb.net/Capstone?retryWrites=true&w=majority&appName=Cluster0  
JWT_SECRET=randompassword123

⚠️ Be sure not to include your `.env` file in your GitHub repo — your `.gitignore` should already handle this.

---

### ⚙️ Tech Stack

- **Node.js + Express** for server & API
- **MongoDB + Mongoose** for database & models
- **Multer** for image uploads
- **JWT (jsonwebtoken)** for authentication
- **CORS, bcrypt, dotenv**

---

### 📁 Project Structure

```
/backend
│
├── models/           # Mongoose schemas (User, Recipe, Comment)
├── routes/           # API routes (auth, recipes, comments, favorites)
├── middleware/       # Authentication middleware
├── uploads/          # Stores uploaded recipe images
├── server.js         # Main server entry point
└── .env              # Environment variables (Mongo URI, JWT secret)
```

---

### 🔐 Authentication

- Users **sign up & log in** using `/api/auth/register` and `/api/auth/login`
- JWT token is returned and used for protected routes
- `protect` middleware verifies JWT tokens on sensitive routes like creating/editing/deleting recipes

---

### 🍽️ API Endpoints

#### 🔐 Auth Routes (`/api/auth`)
- `POST /register` – Create user
- `POST /login` – Authenticate user & return JWT

#### 🍲 Recipe Routes (`/api/recipes`)
- `GET /` – All recipes (optionally filtered by `search` or `category`)
- `GET /featured` – Random 6 featured recipes
- `GET /:id` – Recipe by ID
- `POST /` – Create new recipe _(protected + image upload)_
- `PUT /:id` – Update recipe _(protected)_
- `DELETE /:id` – Delete recipe _(protected, must be author)_

#### ❤️ Favorite Routes (`/api/users/:username/favorites`)
- `GET /` – Get all favorite recipes for a user
- `POST /:id` – Add a recipe to user's favorites
- `DELETE /:id` – Remove from favorites

#### 💬 Comment Routes (`/api/comments`)
- `POST /` – Post a comment
- `GET /:recipeId` – Get all comments for a recipe

---

### 📦 Sample `.env` File

```
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=supersecretkey
```

---

### 🚀 Running the Server

Make sure you’ve installed the dependencies first:

```bash
npm install
```

Then run the server:

```bash
node server.js
# or with nodemon
npx nodemon server.js
```

Server runs at: `http://localhost:5001`

---

### 🧪 Testing

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test API routes manually — make sure to include `Authorization: Bearer <token>` header for protected routes.

---
