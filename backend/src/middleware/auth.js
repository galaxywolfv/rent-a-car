const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY } = process.env;

// Encrypt Token
const encryptToken = (token) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt Token
const decryptToken = (encryptedToken) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
};

// Verify Token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            resolve(decoded);
        } catch (err) {
            reject("Invalid Token");
        }
    });
};

// Authentication Middleware (Validates User)
const auth = async (req, res, next) => {
    const token = req.headers["bearer"];
    if (!token) {
        return res.status(401).send("A token is required for authentication");
    }
    try {
        const user = await getUserFromToken(token);
        req.user = user;
    } catch (err) {
        return res.status(401).send("Error: Authorization failed.");
    }
    return next();
};

// Check Admin Permission
const checkAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send("Access denied. Admins only.");
    }
    return next();
};

// Check Garage Maintainer Permission (Can Manage Only Their Own Garage)
const checkMaintainer = async (req, res, next) => {
    if (!req.user || (req.user.role !== 'maintainer' && req.user.role !== 'admin')) {
        return res.status(403).send("Access denied. Garage maintainers or admins only.");
    }

    // Ensure maintainers can only modify their assigned garage
    if (req.user.role === 'maintainer' && req.body.garageId && req.body.garageId !== req.user.garageId) {
        return res.status(403).send("Access denied. You can only manage your assigned garage.");
    }

    return next();
};

// Extract User from Token
const getUserFromToken = async (token) => {
    try {
        if (token.startsWith('ey')) {
            return await verifyToken(token);
        }
        const decryptedToken = decryptToken(token);
        return await verifyToken(decryptedToken);
    } catch (err) {
        return null;
    }
};

module.exports = {
    encryptToken,
    auth,
    checkAdmin,
    checkMaintainer,
};
