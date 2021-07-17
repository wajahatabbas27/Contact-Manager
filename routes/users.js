const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//model 
const User = require('../model/User');


// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/',
    [
        check('name', 'Please enter a name').not().isEmpty(),
        check('email', 'Please enter valid email').isEmail(),
        check('password', 'Please enter password with atleast 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {

        //errors check krrhe hain
        const errors = validationResult(req);

        //agr error hain validation mein to yh bhejega 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        };

        //res.send('passed without errors');

        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ msg: "a user with this email already exists" })
            };

            //new user hoga to model se create krrhe hain hm user ko
            user = new User({
                name,
                email,
                password
            });

            //encrypt krrhe hain hm password ko
            const salt = await bcrypt.genSalt(10);

            //password ko encrypt krke override krrhe hain hm 
            user.password = await bcrypt.hash(password, salt);

            //user ko mongodb mein save krrhe hain actual mein '
            await user.save();

            //res.send('User created in MongoDB');

            //jwt bhejeinge jb user save hojaega hmare pass 
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 3600000
            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })


        }
        catch (err) {
            console.err(err.message);
            res.status(500).send('server Error');
        }

    });

module.exports = router;