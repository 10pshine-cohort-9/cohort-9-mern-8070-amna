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
        password: '1123456'
    }

    const handleLogin = () => {
        if (email === '' || password === '') {
            setError("Please fill in all fields.")
        } else if (email === mockUser.email && password === mockUser.password) {
            navigate("/dashboard")
        } else {
            setError("Invalid credentials. Try again or sign up.")
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                {error && <p className="error-msg">{error}</p>}
                <button onClick={handleLogin}>Login</button>
                <p>Don't have an account?  <Link to="/signup">Sign Up</Link></p><br />
                </div>
        </div>
    )
}

export default Login
