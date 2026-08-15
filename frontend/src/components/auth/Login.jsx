import { useNavigate, Link} from "react-router-dom"
import { useState} from "react"
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const mockUser = {
        email: "test@test.com",
        password: '123456'
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (email === '' || password === '') {
            setError('Please fill in all fields.')
            return
        }
        const defaultUser = { email: 'test@test.com', password: '123456' }
        const savedUser = JSON.parse(localStorage.getItem('mockUser'))
        if (
            (email === defaultUser.email && password === defaultUser.password) ||
            (savedUser && email === savedUser.email && password === savedUser.password)
        ) {
            localStorage.setItem('isLoggedIn', 'true')
            navigate('/dashboard')
        } else {
            setError('Invalid credentials. Try again or sign up.')
        }
    }    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit">Login</button>
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </form>
            </div>
        </div>
)
}

export default Login
