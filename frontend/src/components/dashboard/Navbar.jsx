import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

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
            className="navbar-search"
            placeholder="Search notes or categories..."
          />
          <button className="navbar-search-btn">🔍</button>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-avatar">A</div>
        <span className="navbar-username">Amna</span>
        <button className="navbar-logout" onClick={() => navigate('/login')}>
          ⇥ Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar