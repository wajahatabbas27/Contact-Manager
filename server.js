const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect to MongoDB Atlas bs call kreinge function ko
connectDB();

//Defining Routes here
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

//yh api bnai hai ke jb request krein to yh show ho hmare pass  
app.get('/', (req, res) => res.json({ msg: "Welcome to contact manager app" }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));