import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'
import CategoryCard from '../components/dashboard/CategoryCard'
import NewCategoryModal from '../components/dashboard/NewCategoryModal'
import { useNotes } from '../context/NotesContext'
import './Dashboard.css'

function Dashboard() {
  const { categories, deleteCategory, addCategory } = useNotes()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleDeleteCategory = (name, option) => {
    deleteCategory(name, option)
  }

  const handleAddCategory = (name) => {
    addCategory(name)
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="dashboard">
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, Amna! 👋</h1>
            <p>Capture your ideas and never lose track.</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn-primary" onClick={() => navigate('/notes/new')}>
              + New Note
            </button>
            <button className="btn-outline" onClick={() => setShowCategoryModal(true)}>
              + New Category
            </button>
          </div>
        </div>

        <div className="categories-section">
          <h2>📁 Categories</h2>
          <div className="categories-grid">
            {filteredCategories.map(cat => (
              <CategoryCard
                key={cat.id}
                {...cat}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <NewCategoryModal
          onClose={() => setShowCategoryModal(false)}
          onAdd={handleAddCategory}
          existingCategories={categories}
        />
      )}

      <footer className="dashboard-footer">
        © 2025 My Notes. All rights reserved.
      </footer>
    </div>
  )
}

export default Dashboard