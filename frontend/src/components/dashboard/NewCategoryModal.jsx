import { useState } from 'react'
import './NewCategoryModal.css'

function NewCategoryModal({ onClose, onAdd, existingCategories }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (name.trim() === '') {
      setError('Category name cannot be empty.')
      return
    }

    const duplicate = existingCategories.some(
      cat => cat.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (duplicate) {
      setError('Category with this name already exists.')
      return
    }

    onAdd(name.trim())
    onClose()
  }

  return (
    <div className="new-category-overlay">
      <div className="new-category-modal">
        <h3>New Category</h3>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
        />
        {error && <p className="error-msg">{error}</p>}
        <div className="new-category-buttons">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-confirm-teal" onClick={handleAdd}>Create</button>
        </div>
      </div>
    </div>
  )
}

export default NewCategoryModal