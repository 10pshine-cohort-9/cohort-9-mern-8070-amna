import { useState } from 'react'
import Navbar from '../components/dashboard/Navbar'
import CategoryCard from '../components/dashboard/CategoryCard'
import NewCategoryModal from '../components/dashboard/NewCategoryModal'
import './Dashboard.css'

const initialCategories = [
  { id: 1, name: 'General', description: 'All your general notes', noteCount: 12, isDefault: true, color: '#187171' },
  { id: 2, name: 'University', description: 'My academic journey', noteCount: 8, isDefault: false, color: '#7B5EA7' },
  { id: 3, name: 'Development', description: 'Coding and projects', noteCount: 15, isDefault: false, color: '#2E86AB' },
]

const colors = ['#7B5EA7', '#2E86AB', '#C17D3C', '#E05C8A', '#3DAA6E', '#E07B39']

function Dashboard() {
  const [categories, setCategories] = useState(initialCategories)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleDeleteCategory = (name, option) => {
    const deletedCat = categories.find(cat => cat.name === name)
    
    if (option === 'move') {
      setCategories(prev => prev.map(cat => {
        if (cat.isDefault) {
          return { ...cat, noteCount: cat.noteCount + deletedCat.noteCount }
        }
        return cat
      }).filter(cat => cat.name !== name))
    } else {
      setCategories(prev => prev.filter(cat => cat.name !== name))
    }
  }

  const handleAddCategory = (name) => {
    const newCategory = {
      id: Date.now(),
      name: name,
      description: 'My new category',
      noteCount: 0,
      isDefault: false,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
    setCategories(prev => [...prev, newCategory])
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, Amna! 👋</h1>
            <p>Capture your ideas and never lose track.</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn-primary">+ New Note</button>
            <button
              className="btn-outline"
              onClick={() => setShowCategoryModal(true)}
            >
              + New Category
            </button>
          </div>
        </div>

        <div className="categories-section">
          <h2>📁 Categories</h2>
          <div className="categories-grid">
            {categories.map(cat => (
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