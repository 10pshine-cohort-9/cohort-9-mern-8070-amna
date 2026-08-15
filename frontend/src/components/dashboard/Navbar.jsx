import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onSearch }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">🗒️</span>
        <span className="navbar-title">My Notes</span>
      </div>

      <div className="navbar-center">
        <div className="navbar-search-wrapper">
          <input
            type="text"
            aria-label="Search notes or categories"
            className="navbar-search"
            placeholder="Search notes or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            type="button"
            className="navbar-search-btn"
            aria-label="Search notes or categories"
            onClick={handleSearch}
          >
            🔍
          </button>

          {searchQuery && (
            <button aria-label="Clear search" className="search-clear" onClick={() => {
              setSearchQuery('')
              onSearch('')
            }}>✕</button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-avatar">A</div>
        <span className="navbar-username">Amna</span>
        <button className="navbar-logout" onClick={handleLogout}>
          ⇥ Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar