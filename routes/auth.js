const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const auth = require('../middleware/auth');



// @route   GET api/auth 
// @desc    Get the logged in user
// @access  Private
router.get('/', auth,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');                          //select se password return nhi hoga
            res.json(user);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });




// @route   POST api/auth - jb user login hoga to authentication krega yh
// @desc    Authorize user and get the token
// @access  Public
router.post('/',
    [
        check('email', 'Please provide valid email').isEmail(),
        check('password', 'Please enter a password').exists()
    ],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        };

        const { email, password } = req.body;

        try {

            //check kr rhe hain database mein hai ya nhi 
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "Register a user with this email" })
            }

            //hash password ko decode kreinge take authentication hojae hmare pass jo password enter hoa hai usse 
            const isMatch = await bcrypt.compare(password, user.password);                                            // jo password req.body se aya hai usko compare kr rhe hain database wale user.password se 

            //agr match nhi hoa to show krdega incorrect password
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect Password" })
            }

            //agr match hogae user aur password dono ,  to hm token send krrhe hain.
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })

        }
        catch (err) {

            console.error(err.message);
            res.status(500).send('Server Error');

        }

    });

module.exports = router;