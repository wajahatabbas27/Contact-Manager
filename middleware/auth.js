const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    //getting token from the header
    const token = req.header('x-auth-token');

    //if token doesnot exist
    if (!token) {
        return res.status(401).json({ msg: "Authorization denied, token missing" });
    }

    //verify token
    try {

        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();                                       //next leke ajaega user queue chala dega

    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
}  //save