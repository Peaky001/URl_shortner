const {v4: uuidv4} = require("uuid");
const { error } = require("console");
const User = require("../models/user");
const {setUser} = require("../service/auth");

async function handleUserSignup(req, res) {
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
    
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({
                error: "Invalid Username or Password"
            });
        }
        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId, { httpOnly: true, secure: true }); // Ensure the cookie name matches

        // Redirect to /url after successful login
        return res.redirect('/url');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


module.exports = {
    handleUserSignup,handleUserLogin
};