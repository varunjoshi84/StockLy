const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const jwt = require('jsonwebtoken');

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

const RegisterController = async function(req, res) {
    const { name, email, password } = req.body;
    try {
        const isAlreadyuser = await User.findOne({ email });
        if (isAlreadyuser) {
            return res.status(409).json({
                message: "User Already Registered"
            });
        }
        const user = await User.create({
            name, email, password
        });
        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, getCookieOptions());

        return res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error in RegisterController:", err);
        return res.status(500).json({
            message: "Error in signup"
        });
    }
};

const LoginController = async function(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Wrong credentials"
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong credentials"
            });
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie('token', token, getCookieOptions());

        return res.status(200).json({
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error in LoginController:", err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const LogoutController = async function(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (err) {
        console.error("Error in LogoutController:", err);
        return res.status(500).json({
            message: "Error during logout"
        });
    }
};

const MeController = async function(req, res) {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) {
            return res.status(401).json({ authenticated: false, message: "Not authenticated" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ authenticated: false, message: "User not found" });
        }
        return res.status(200).json({
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(401).json({ authenticated: false, message: "Invalid or expired session" });
    }
};

module.exports = { RegisterController, LoginController, LogoutController, MeController };