const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY, FACTOR, ROLE } = process.env;

async function registerUser(userData) {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
    });

    if (existingUser) {
        throw new Error('User with this email or username already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, +FACTOR);

    // Create the new user using create() method; default role is 'user'
    const newUser = await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: ROLE
    });

    // Build a minimal payload for the JWT—only include the fields you need.
    const payload = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
    };

    // Generate a JWT token using the minimal payload
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1y" });

    return token;
}

async function loginUser(identifier, password) {
    // Find user by either email or username
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Create a clean user object without sensitive fields
    const { password: _, ...cleanUser } = user.toObject();

    // Generate a JWT token using the minimal payload
    const payload = {
        id: cleanUser._id,
        username: cleanUser.username,
        email: cleanUser.email,
        role: cleanUser.role
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1y" });

    return token;
}


async function verifyUser(username) {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }
    // Destructure to remove sensitive fields
    const { password, ...cleanUser } = user._doc;
    return cleanUser;
}

module.exports = { registerUser, loginUser, verifyUser };
