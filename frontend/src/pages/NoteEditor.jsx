import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useNotes } from '../context/NotesContext'
import './NoteEditor.css'

function NoteEditor() {
  const { categories, addCategory, addNote, editNote, notes } = useNotes()
  const { categoryName, noteId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'General')
  const prevCategoryRef = useRef(categoryName || 'General')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [, forceUpdate] = useState(0)

  const isEditMode = !!noteId && !categoryName
  const existingNote = noteId ? notes.find(n => n.id === parseInt(noteId)) : null

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: () => forceUpdate(n => n + 1),
    onSelectionUpdate: () => forceUpdate(n => n + 1),
    onTransaction: () => forceUpdate(n => n + 1),
  })

  useEffect(() => {
    if (!editor) return
    if (existingNote) {
      setTitle(existingNote.title)
      setSelectedCategory(existingNote.categoryName)
      editor.commands.setContent(existingNote.content)
    } else {
      setTitle('')
      setSelectedCategory(categoryName || 'General')
      editor.commands.setContent('')
    }
  }, [editor, existingNote, categoryName])

  const handleSave = () => {
    if (title.trim() === '') {
      setError('Please add a title.')
      return
    }
    if (!editor || editor.getText().trim() === '') {
      setError('Note content cannot be empty.')
      return
    }

    if (isEditMode && existingNote) {
      editNote(existingNote.id, title, editor.getHTML())
      navigate(`/category/${existingNote.categoryName}`)
    } else {
      addNote(title, editor.getHTML(), selectedCategory)
      navigate(`/category/${selectedCategory}`)
    }
  }

  return (
    <div className="note-editor-page">
      <div className="note-editor-container">

        <div className="note-editor-header">
          <h2>{isEditMode ? 'Edit Note' : 'New Note'}</h2>
          <div className="note-editor-actions">
            <button className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave}>
              Save Note
            </button>
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <input
          type="text"
          className="note-title-input"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError('')
          }}
        />

        {!isEditMode && (
          <div className="category-section">
            <label className="category-label">Category</label>
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  prevCategoryRef.current = selectedCategory
                  setShowNewCategory(true)
                } else {
                  setSelectedCategory(e.target.value)
                  setShowNewCategory(false)
                }
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="__new__">+ Create New Category</option>
            </select>

            {showNewCategory && (
              <div className="new-category-inline">
                <input
                  type="text"
                  placeholder="New category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="new-category-input"
                />
                <button
                  className="btn-create-category"
                  onClick={() => {
                    if (newCategoryName.trim() === '') return
                    const success = addCategory(newCategoryName.trim())
                    if (success) {
                      setSelectedCategory(newCategoryName.trim())
                      setNewCategoryName('')
                      setShowNewCategory(false)
                    } else {
                      setError('Category already exists.')
                    }
                  }}
                >
                  Create
                </button>
                <button
                  className="btn-cancel-category"
                  onClick={() => {
                    setShowNewCategory(false)
                    setSelectedCategory(prevCategoryRef.current)
                    setNewCategoryName('')
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="toolbar">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'toolbar-btn active' : 'toolbar-btn'}
          ><b>B</b></button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'toolbar-btn active' : 'toolbar-btn'}
          ><i>I</i></button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor?.isActive('strike') ? 'toolbar-btn active' : 'toolbar-btn'}
          ><s>S</s></button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor?.isActive('heading', { level: 1 }) ? 'toolbar-btn active' : 'toolbar-btn'}
          >H1</button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor?.isActive('heading', { level: 2 }) ? 'toolbar-btn active' : 'toolbar-btn'}
          >H2</button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'toolbar-btn active' : 'toolbar-btn'}
          >• List</button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor?.isActive('orderedList') ? 'toolbar-btn active' : 'toolbar-btn'}
          >1. List</button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor?.isActive('codeBlock') ? 'toolbar-btn active' : 'toolbar-btn'}
          >{'</>'}</button>
        </div>

        <div className="note-editor-content">
          <EditorContent editor={editor} />
        </div>

      </div>
    </div>
  )
}

export default NoteEditor