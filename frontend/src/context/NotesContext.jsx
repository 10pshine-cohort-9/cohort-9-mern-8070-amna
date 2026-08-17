import { createContext, useContext, useState } from 'react'

const NotesContext = createContext()

const initialCategories = [
  { id: 1, name: 'General', description: 'All your general notes', noteCount: 0, isDefault: true, color: '#187171' },
  { id: 2, name: 'University', description: 'My academic journey', noteCount: 8, isDefault: false, color: '#7B5EA7' },
  { id: 3, name: 'Development', description: 'Coding and projects', noteCount: 15, isDefault: false, color: '#2E86AB' },
]

const colors = ['#7B5EA7', '#2E86AB', '#C17D3C', '#E05C8A', '#3DAA6E', '#E07B39']

export function NotesProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories)
  const [notes, setNotes] = useState([])

  const addCategory = (name) => {
    const duplicate = categories.some(
      cat => cat.name.toLowerCase() === name.toLowerCase()
    )
    if (duplicate) return false

    const newCategory = {
      id: Date.now(),
      name,
      description: 'My new category',
      noteCount: 0,
      isDefault: false,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
    setCategories(prev => [...prev, newCategory])
    return true
  }

  const deleteCategory = (name, option) => {
    const deletedCat = categories.find(cat => cat.name === name)
    if (option === 'move') {
      setNotes(prev => prev.map(note =>
        note.categoryName === name
          ? { ...note, categoryName: 'General' }
          : note
      ))
      setCategories(prev => prev.map(cat =>
        cat.isDefault
          ? { ...cat, noteCount: cat.noteCount + deletedCat.noteCount }
          : cat
      ).filter(cat => cat.name !== name))
    } else {
      setNotes(prev => prev.filter(note => note.categoryName !== name))
      setCategories(prev => prev.filter(cat => cat.name !== name))
    }
  }

  const addNote = (title, content, categoryName) => {
    const newNote = {
      id: Date.now(),
      title,
      content,
      categoryName: categoryName || 'General',
      createdAt: new Date().toLocaleDateString()
    }
    setNotes(prev => [...prev, newNote])
    setCategories(prev => prev.map(cat =>
      cat.name === (categoryName || 'General')
        ? { ...cat, noteCount: cat.noteCount + 1 }
        : cat
    ))
  }

  const deleteNote = (id) => {
    const note = notes.find(n => n.id === id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setCategories(prev => prev.map(cat =>
      cat.name === note.categoryName
        ? { ...cat, noteCount: cat.noteCount - 1 }
        : cat
    ))
  }

  const editNote = (id, title, content, newCategoryName) => {
    const oldNote = notes.find(n => n.id === id)

    if (newCategoryName && newCategoryName !== oldNote.categoryName) {
      // category change hui
      setCategories(prev => prev.map(cat => {
        if (cat.name === oldNote.categoryName) {
          return { ...cat, noteCount: cat.noteCount - 1 }
        }
        if (cat.name === newCategoryName) {
          return { ...cat, noteCount: cat.noteCount + 1 }
        }
        return cat
      }))
      setNotes(prev => prev.map(n =>
        n.id === id
          ? { ...n, title, content, categoryName: newCategoryName }
          : n
      ))
    } else {
      setNotes(prev => prev.map(n =>
        n.id === id ? { ...n, title, content } : n
      ))
    }
  }

  const moveNotes = (noteIds, targetCategory) => {
    const movingNotes = notes.filter(n => noteIds.includes(n.id))
  
    setNotes(prev => prev.map(n =>
      noteIds.includes(n.id)
        ? { ...n, categoryName: targetCategory }
        : n
    ))
  
    setCategories(prev => prev.map(cat => {
      if (cat.name === 'General') {
        return { ...cat, noteCount: cat.noteCount - movingNotes.length }
      }
      if (cat.name === targetCategory) {
        return { ...cat, noteCount: cat.noteCount + movingNotes.length }
      }
      return cat
    }))
  }

  return (
    <NotesContext.Provider value={{
      categories,
      notes,
      addCategory,
      deleteCategory,
      addNote,
      deleteNote,
      editNote,
      moveNotes
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  return useContext(NotesContext)
}