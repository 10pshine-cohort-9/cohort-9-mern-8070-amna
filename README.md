# cohort-9-mern-8070-amna
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Amna Saeed

## Project Overview
A frontend mock of a full-stack Notes App with user authentication and category management. Backend integration, rich text editing, and remaining features are currently in progress.

## Tech Stack
- **Frontend:** React.js (Vite), React Router DOM, Plain CSS
- **Backend:** Node.js, Express.js _(coming soon)_
- **Database:** MongoDB _(coming soon)_
- **Logging:** Pino Logger _(coming soon)_
- **Testing:** Mocha/Chai (backend), Jest (frontend) _(coming soon)_
- **Code Quality:** SonarQube _(coming soon)_
- **Version Control:** Git

## Current Progress

### ✅ Frontend — Auth
- Login page with form validation
- Signup page with form validation
- Empty field checks on both forms
- Mock authentication (test@test.com / 123456)
- React Router navigation between Login, Signup, Dashboard
- Teal-themed clean UI

### ✅ Frontend — Dashboard
- Navbar with search bar, user avatar, logout button
- Welcome message with New Note and New Category buttons
- Categories displayed in a responsive grid
- General category — built-in, cannot be deleted
- User-created categories with 3-dot menu
- Delete category modal — move notes to General OR delete all notes
- New Category modal with duplicate name validation (case-insensitive)
- Mock data for categories

### 🔄 In Progress
- Note Editor (rich text)
- Category View (notes inside a category)

```
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
    pages/
      Dashboard.jsx
      Dashboard.css
    index.css
    App.jsx
    main.jsx
```

## How to Run
```bash
cd frontend
npm install
npm run dev
```

## Test Credentials (Mock)
- **Email:** test@test.com
- **Password:** 123456