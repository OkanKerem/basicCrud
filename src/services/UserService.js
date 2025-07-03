const User = require('../models/User');

class UserService {
    // Business logic methods
    static validateUserData(userData) {
        return User.validate(userData);
    }

    static createUserInstance(data) {
        return new User(data);
    }

    static formatUserResponse(user) {
        return user.toJSON();
    }
}

module.exports = UserService; 