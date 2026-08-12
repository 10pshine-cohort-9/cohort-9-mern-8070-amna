import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import './Signup.css'

function Signup() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
        const [error, setError] = useState('')

    const handleSignup = () => {
        if (name === '' || email === '' || password == ''){
            setError("Please fill in all fields.")
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Create Account</h2>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error-msg">{error}</p>}
                <button onClick={handleSignup}>Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}
export default Signup