import { useState } from 'react'

function App() {
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')

  const addNote = () => {
    if (input.trim()) {
      setNotes([...notes, input])
      setInput('')
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>📝 Notes App</h1>
      
      <div>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a note..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={addNote} style={{ padding: '10px 20px' }}>
          Add Note ➕
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
        {notes.map((note, index) => (
          <li key={index} style={{ 
            background: '#f0f0f0', 
            padding: '10px', 
            margin: '10px auto', 
            width: '400px',
            borderRadius: '8px'
          }}>
            📌 {note}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App