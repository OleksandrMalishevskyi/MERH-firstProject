const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Niekorektnij email').isEmail(),
        check('password', 'Min lenght password is 6 simbols').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Niekorektnie dannije pri registraciji'
                })
            }

            const { email, password } = reg.body

            const candidate = await User.findOne({ email })
            if (candidate) {
                res.status(400).json({ message: 'This user is' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })

            await user.save()

            res.status(201).json({ message: 'User create' })

        } catch (e) {
            res.status(500).json({ message: 'Poshlo nie tak? To poprobuj ponownie' })
        }
    })

// /api/auth/login
router.post('/login',
    [
        check('email', 'Wwedicie korektnij email').normalizeEmail(),isEmail(),
        check('password', 'Wwedicie parol').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Niekorektnie dannije pri wchodie w sistemu'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'User is not found'})

            }
            const isMathch = await bcrypt.compare(password, user.password)

            if (!isMathch) {
                return res.status(400).json({ message: 'wrong password, try again'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            )

            res.json({ token, userId: user.id})





        } catch (e) {
            res.status(500).json({ message: 'Poshlo nie tak? To poprobuj ponownie' })
        }
    })
module.exports = router