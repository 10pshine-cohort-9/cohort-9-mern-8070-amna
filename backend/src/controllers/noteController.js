const Note = require('../models/Notes')
const Category = require('../models/Category')
const pino = require('pino')

const logger = pino({ level: 'info' })

// @desc Get all notes for a user
// @route GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .populate('categoryId', 'name color')
    logger.info(`Notes fetched for user: ${req.user.id}`)
    res.status(200).json(notes)
  } catch (error) {
    logger.error(`Get notes error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Get notes by category
// @route GET /api/notes/category/:categoryId
const getNotesByCategory = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      categoryId: req.params.categoryId
    }).populate('categoryId', 'name color')
    logger.info(`Notes fetched for category: ${req.params.categoryId}`)
    res.status(200).json(notes)
  } catch (error) {
    logger.error(`Get notes by category error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Create a note
// @route POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body

    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
      categoryId
    })

    logger.info(`Note created: ${title} for user: ${req.user.id}`)
    res.status(201).json(note)
  } catch (error) {
    logger.error(`Create note error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Update a note
// @route PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { title, content, categoryId } = req.body

    note.title = title || note.title
    note.content = content || note.content
    note.categoryId = categoryId || note.categoryId

    await note.save()

    logger.info(`Note updated: ${note._id}`)
    res.status(200).json(note)
  } catch (error) {
    logger.error(`Update note error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Delete a note
// @route DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await Note.findByIdAndDelete(req.params.id)

    logger.info(`Note deleted: ${req.params.id}`)
    res.status(200).json({ message: 'Note deleted successfully' })
  } catch (error) {
    logger.error(`Delete note error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Move notes to another category
// @route PUT /api/notes/move
const moveNotes = async (req, res) => {
  try {
    const { noteIds, targetCategoryId } = req.body

    const targetCategory = await Category.findById(targetCategoryId)
    if (!targetCategory) {
      return res.status(404).json({ message: 'Target category not found' })
    }

    await Note.updateMany(
      { _id: { $in: noteIds }, userId: req.user.id },
      { categoryId: targetCategoryId }
    )

    logger.info(`Notes moved to category: ${targetCategoryId}`)
    res.status(200).json({ message: 'Notes moved successfully' })
  } catch (error) {
    logger.error(`Move notes error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Search notes
// @route GET /api/notes/search?q=query
const searchNotes = async (req, res) => {
  try {
    const { q } = req.query

    const notes = await Note.find({
      userId: req.user.id,
      title: { $regex: q, $options: 'i' }
    }).populate('categoryId', 'name color')

    logger.info(`Search results for: ${q}`)
    res.status(200).json(notes)
  } catch (error) {
    logger.error(`Search notes error: ${error.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getNotes,
  getNotesByCategory,
  createNote,
  updateNote,
  deleteNote,
  moveNotes,
  searchNotes
}