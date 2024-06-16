const User = require('../models/user');
const Counter = require('../models/counter');
const jwt = require('jsonwebtoken');
const Settings = require('../models/settings');

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
};

const generateAuthToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, "jwttoken", { expiresIn: '1h' });
        return token;
    } catch (error) {
        throw new Error('Failed to generate authentication token');
    }
};
  
exports.login = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const user = await User.findOne({ phoneNumber: phoneNumber });
        if (!user) {
            return res.handleNotFound();
        }
        const token = generateAuthToken(user.userId);
        res.handleSuccess({
            token: token,
            role: user.role,
            phoneNumber: user.phoneNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user.userId
        }, 'User Authorized');
    } catch (error) {
        res.handleError(error);
    }
};

exports.registerUser = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        const totalPositions = settings ? settings.totalPositions : 100; // Default to 100 if not set
        const registeredUsersCount = await User.countDocuments();
        const remainingPositions = totalPositions - registeredUsersCount;

        if (remainingPositions <= 0) {
            return res.handleError('Registration full, no remaining positions available');
        }

        const { firstName, lastName, phoneNumber, role } = req.body;
        const userId = await getNextSequenceValue('userId');
        const newUser = new User({ userId, firstName, lastName, phoneNumber, role });
        await newUser.save();
        res.handleSuccess(newUser, 'User registered successfully');
    } catch (error) {
        res.handleError(error);
    }
};

exports.updatePosition = async (req, res) => {
    // Update user position
    try {
        const { phoneNumber } = req.params;
        const { newPosition } = req.body;
        // Update the user's position in the database
        const result = await User.updateOne({ phoneNumber }, { userId: newPosition });
        res.handleSuccess(result, 'User position updated successfully');
    } catch (error) {
        res.handleError(error);
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort({ lastName: 1, firstName: 1 });
        res.handleSuccess(users, 'Users retrieved successfully');
    } catch (error) {
        res.handleError(error);
    }
};

exports.countRemainingPositions = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        const totalPositions = settings ? settings.totalPositions : 100; 
        const registeredUsersCount = await User.find({ role: 'user' }).countDocuments();
        const remainingPositions = totalPositions - registeredUsersCount;
        res.handleSuccess({ remainingPositions, totalPositions }, 'Remaining positions calculated successfully');
    } catch (error) {
        res.handleError(error);
    }
};