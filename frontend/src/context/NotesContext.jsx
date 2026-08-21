import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const NotesContext = createContext()

export function NotesProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories")
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes')
      setNotes(res.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      Promise.all([fetchCategories(), fetchNotes()])
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const addCategory = async (name) => {
    try {
      const colors = ['#7B5EA7', '#2E86AB', '#C17D3C', '#E05C8A', '#3DAA6E', '#E07B39']
      const color = colors[Math.floor(Math.random() * colors.length)]
      const res = await api.post('/categories', { name, color })
      setCategories(prev => [...prev, res.data])
      return true
    } catch (error) {
      if (error.response?.status === 400) {
        return false
      }
      console.error('Error creating category:', error)
      return false
    } 
  }

  const deleteCategory = async (name, option) => {
    try {
      const category = categories.find(cat => cat.name === name)
      await api.delete(`/categories/${category._id}`, {
        data: { option }
      })

      if (option === 'move') {
        const generalCat = categories.find(cat => cat.isDefault)
        setNotes(prev => prev.map(note =>
          note.categoryId._id === category._id
            ? { ...note, categoryId: { _id: generalCat._id, name: generalCat.name, color: generalCat.color } }
            : note
        ))
      } else {
        setNotes(prev => prev.filter(note => note.categoryId._id !== category._id))
      }

      setCategories(prev => prev.filter(cat => cat.name !== name))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }


  const addNote = async (title, content, categoryName) => {
    try {
      const category = categories.find(cat => cat.name === categoryName)

      if (!category) {
        console.error('Category not found:', categoryName)
        return
      }

      await api.post('/notes', {
        title,
        content,
        categoryId: category._id
      })

      // Note create hone ke baad fresh fetch karo
      await fetchNotes()

    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(prev => prev.filter(n => n._id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const editNote = async (id, title, content, newCategoryName) => {
    try {
      const updateData = { title, content }
    
      if (newCategoryName) {
        const category = categories.find(cat => cat.name === newCategoryName)
        updateData.categoryId = category._id
      }
    
      await api.put(`/notes/${id}`, updateData)
      
      // Fresh fetch karo
      await fetchNotes()
    
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const moveNotes = async (noteIds, targetCategoryName) => {
    try {
      const targetCategory = categories.find(cat => cat.name === targetCategoryName)
      await api.put('/notes/move', {
        noteIds,
        targetCategoryId: targetCategory._id
      })
      setNotes(prev => prev.map(note =>
        noteIds.includes(note._id)
          ? { ...note, categoryId: { _id: targetCategory._id, name: targetCategory.name, color: targetCategory.color } }
          : note
      ))
    } catch (error) {
      console.error('Error moving notes:', error)
    }
  }

  return (
    <NotesContext.Provider value={{
      categories,
      notes,
      loading,
      addCategory,
      deleteCategory,
      addNote,
      editNote,
      deleteNote,
      moveNotes,
      fetchCategories,
      fetchNotes
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  return useContext(NotesContext)
}