# cohort-9-mern-8070-amna
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Amna Saeed

## Project Overview
A full-stack Notes App with user authentication, category management, and rich text note editing. Frontend is complete with mock data. Backend REST APIs are implemented and ready for frontend integration.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- TipTap Rich Text Editor
- Context API
- Plain CSS

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Pino Logger
- Bcrypt password hashing

### Upcoming
- Frontend-Backend integration
- Mocha/Chai backend tests
- Jest frontend tests
- SonarQube integration

## Current Progress

### ✅ Frontend — Auth
- Login page with form validation and semantic form structure
- Signup page with form validation and labels
- Mock authentication (test@test.com / 123456)
- Signup saves mock user to localStorage
- React Router navigation between Login, Signup, Dashboard
- Protected routes — dashboard inaccessible without login

### ✅ Frontend — Dashboard
- Navbar with search bar, user avatar, logout button
- Categories displayed in a responsive grid
- General category — built-in, cannot be deleted
- User-created categories with 3-dot menu
- Delete category modal — move notes to General OR delete all notes
- New Category modal with duplicate name validation (case-insensitive)
- Global search — searches both categories and notes simultaneously

### ✅ Frontend — Note Editor
- Rich text editor using TipTap
- Toolbar with Bold, Italic, Strike, H1, H2, Bullet List, Ordered List, Code Block
- Category selection dropdown — choose existing or create new inline
- Save note → redirects to respective category

### ✅ Frontend — Category View
- View all notes inside a category
- Search within a category
- Edit, delete note
- Move notes from General to user categories

### ✅ Frontend — Note View
- Readable note page with full rich text rendering
- Change category button
- Edit button → opens Note Editor in edit mode

### ✅ Backend — Auth APIs
- POST /api/auth/signup — register user + auto-create General category
- POST /api/auth/login — login with JWT token

### ✅ Backend — Category APIs
- GET /api/categories — get all user categories
- POST /api/categories — create new category
- DELETE /api/categories/:id — delete category (move or delete notes)

### ✅ Backend — Notes APIs
- GET /api/notes — get all user notes
- GET /api/notes/category/:categoryId — get notes by category
- POST /api/notes — create note
- PUT /api/notes/:id — update note
- DELETE /api/notes/:id — delete note
- PUT /api/notes/move — move notes to another category
- GET /api/notes/search?q= — search notes by title

### ✅ Backend — Middleware
- JWT auth middleware — protected routes
- Global error handler
- 404 not found handler
- Pino HTTP request logging

### 🔄 In Progress
- Frontend-Backend integration
- Mocha/Chai backend tests
- Jest frontend tests
- SonarQube integration

## Folder Structure

```text
cohort-9-mern-8070-amna/
  frontend/
    src/
      components/
        auth/
          Login.jsx
          Login.css
          Signup.jsx
          Signup.css
        dashboard/
          Navbar.jsx
          Navbar.css
          CategoryCard.jsx
          CategoryCard.css
          NewCategoryModal.jsx
          NewCategoryModal.css
      context/
        NotesContext.jsx
      pages/
        Dashboard.jsx
        Dashboard.css
        NoteEditor.jsx
        NoteEditor.css
        CategoryView.jsx
        CategoryView.css
        NoteView.jsx
        NoteView.css
      api/
        axios.js
      index.css
      App.jsx
      main.jsx
  backend/
    src/
      config/
        db.js
      controllers/
        authController.js
        categoryController.js
        noteController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        User.js
        Category.js
        Note.js
      routes/
        authRoutes.js
        categoryRoutes.js
        noteRoutes.js
    server.js
    .env.example
```

## How to Run

### Backend
```bash
cd backend
npm install
# .env file banao aur MONGODB_URI, JWT_SECRET, PORT add karo
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Test Credentials
- **Email:** amna@test.com
- **Password:** 123456

## Environment Variables
```text
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```