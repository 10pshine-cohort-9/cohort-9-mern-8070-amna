const User = require("../models/User")
const Category = require("../models/Category")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pino = require("pino")

const logger = pino({level: "info"})

// @route POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const  user = await User.create({
            name, 
            email,
            password: hashedPassword
        })

        await Category.create({
            name: 'General',
            description: 'All your general notes',
            isDefault: true,
            color: '#187171',
            userId: user._id
        })

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        logger.info(`New user registered: ${email}`)

        res.status(201).json({
            token, 
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        logger.error(`Signup error: ${error.message}`)
        res.status(500).json({ message: 'Server error' })
    }
}

// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) { 
            return res.json(401).json({message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json(401).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        logger.info(`User logged in: ${email}`)

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        logger.error(`Login error: ${error.message}`)
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { signup, login }