import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Dashbaord from "./pages/Dashbaord"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/dashboard" element={<Dashbaord />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App