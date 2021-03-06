const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../model/User');
const Contact = require('../model/Contact');


// @route   GET api/contacts
// @desc    Get all the user's contacts
// @access  Private
router.get('/', auth, async (req, res) => {

    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({
            date: -1
        });

        res.json(contacts);


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});


// @route   POST api/contacts
// @desc    Add a new contact
// @access  Private
router.post('/',
    [auth, [
        check('name', 'Name is required').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        //destructure krrhe hain 
        const { name, email, phone, type } = req.body;

        try {

            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            });

            const contact = await newContact.save();
            res.json(contact);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }


    });

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id', (req, res) => res.send("Update a contact"))

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', (req, res) => res.send("Delete a contact"))



module.exports = router;