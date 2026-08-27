import { useState, useEffect, useRef } from 'react'
import './NewCategoryModal.css'

function NewCategoryModal({ onClose, onAdd, existingCategories }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  const handleAdd = async () => {
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

    try {
      const success = await onAdd(name.trim())
      if (success) {
        onClose()
      } else {
        setError('Failed to create category. Try again.')
      }
    } catch {
      setError('Failed to create category. Try again.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="new-category-overlay"
      aria-labelledby="new-category-title"
      onCancel={onClose}
    >
      <div className="new-category-modal">
        <h3 id="new-category-title">New Category</h3>
        <label htmlFor="category-name">Category Name</label>
        <input
          id="category-name"
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
          <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-confirm-teal" onClick={handleAdd}>Create</button>
        </div>
      </div>
    </dialog>
  )
}

export default NewCategoryModal