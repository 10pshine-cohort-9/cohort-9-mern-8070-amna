import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useNotes } from '../context/NotesContext'
import './NoteView.css'

function NoteView() {
  const { noteId } = useParams()
  const { notes, categories, editNote } = useNotes()
  const navigate = useNavigate()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const note = notes.find(n => n.id === parseInt(noteId))
  const category = note ? categories.find(cat => cat.name === note.categoryName) : null

  if (!note) {
    return (
      <div className="note-view-page">
        <div className="note-not-found">
          <h2>Note not found</h2>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleChangeCategory = () => {
    if (selectedCategory && selectedCategory !== note.categoryName) {
      editNote(note.id, note.title, note.content, selectedCategory)
      navigate(`/category/${encodeURIComponent(selectedCategory)}`)
    }
    setShowCategoryModal(false)
  }

  return (
    <div className="note-view-page">
      <div className="note-view-container">

        <div className="note-view-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="note-view-actions">
            <button
              className="btn-change-category"
              onClick={() => {
                setSelectedCategory(note.categoryName)
                setShowCategoryModal(true)
              }}
            >
              📁 Change Category
            </button>
            <button
              className="btn-edit"
              onClick={() => navigate(`/notes/edit/${note.id}`)}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="note-view-meta">
          <span
            className="note-category-badge"
            style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
          >
            {note.categoryName}
          </span>
          <span className="note-date">
                {note.updatedAt ? `Updated: ${note.updatedAt}` : `Created: ${note.createdAt}`}
          </span>
        </div>

        <h1 className="note-view-title">{note.title}</h1>

        <div
          className="note-view-content ProseMirror"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

      </div>

      {showCategoryModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Change Category</h3>
            <p>Move "<strong>{note.title}</strong>" to:</p>
            <select
              className="category-select-modal"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button
                className="modal-cancel"
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-confirm-teal"
                onClick={handleChangeCategory}
              >
                Move Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteView