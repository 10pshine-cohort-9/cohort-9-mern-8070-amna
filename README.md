# cohort-9-mern-8070-amna
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Amna Saeed

## Project Overview
A frontend mock of a full-stack Notes App with user authentication, category management, and rich text note editing. Backend integration and remaining features are currently in progress.

## Tech Stack
- **Frontend:** React.js (Vite), React Router DOM, TipTap Rich Text Editor, Context API, Plain CSS
- **Backend:** Node.js, Express.js _(coming soon)_
- **Database:** MongoDB _(coming soon)_
- **Logging:** Pino Logger _(coming soon)_
- **Testing:** Mocha/Chai (backend), Jest (frontend) _(coming soon)_
- **Code Quality:** SonarQube _(coming soon)_
- **Version Control:** Git

## Current Progress

### ✅ Frontend — Auth
- Login page with form validation and semantic form structure
- Signup page with form validation and labels
- Empty field checks on both forms
- Mock authentication (test@test.com / 123456)
- Signup saves mock user to localStorage
- React Router navigation between Login, Signup, Dashboard
- Protected routes — dashboard inaccessible without login
- Teal-themed clean UI

### ✅ Frontend — Dashboard
- Navbar with search bar, user avatar, logout button
- Welcome message with New Note and New Category buttons
- Categories displayed in a responsive grid
- General category — built-in, cannot be deleted
- User-created categories with 3-dot menu
- Delete category modal — move notes to General OR delete all notes
- New Category modal with duplicate name validation (case-insensitive)
- Global search — searches both categories and notes simultaneously
- Search results show matched categories and matched notes with their category
- Back to all categories button when search is active

### ✅ Frontend — Note Editor
- Rich text editor using TipTap
- Toolbar with Bold, Italic, Strike, H1, H2, Bullet List, Ordered List, Code Block
- Active/inactive state for all toolbar buttons
- Note title input
- Category selection dropdown — choose existing or create new inline
- Save note → redirects to respective category
- Cancel → goes back

### ✅ Frontend — Category View
- View all notes inside a category
- Search within a category
- Click note → opens readable Note View
- Edit button → opens Note Editor
- Delete note with confirmation modal
- Move notes (only in General) → select target category → checkbox selection → move selected notes

### ✅ Frontend — Note View
- Readable note page with full rich text rendering
- Change category button → modal to move note to another category
- Edit button → opens Note Editor in edit mode
- Back button → returns to previous page

### ✅ Frontend — State Management
- React Context API (NotesContext)
- Global state for categories and notes
- Functions: addNote, editNote, deleteNote, moveNotes, addCategory, deleteCategory

## Folder Structure

```text
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