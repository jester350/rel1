var models = require('../models/user');

class appUsers {
    constructor() {
        this._sequelize = global.sequelize;
    }
    
    getUsers(callback) {
        this._sequelize.models['users'].all({limit:10}).then(callback);
    }
}

module.exports = new appUsers();