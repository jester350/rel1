var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// const { Pool } = require('pg');

const{user, host, database, userdatabase, password, port} = require('../secrets/db_configuration');

// const pool = new Pool({ user, host, database, auth-system, password, port});

function propagateRequired(modelDescriptor) {
    let include = modelDescriptor.include;
  
    if (!include) return false;
    if (!Array.isArray(include)) include = [include];
  
    return include.reduce((isRequired, descriptor) => {
      const hasRequiredChild = propogateRequired(descriptor);
      if ((descriptor.where || hasRequiredChild) && descriptor.required === undefined) {
        descriptor.required = true;
      }
      return descriptor.required || isRequired;
    }, false);
  }

const sequelize = new Sequelize(userdatabase, user, password, {
    host: host,
    port: port,
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    define: {
        hooks: {
          beforeFind: propagateRequired
        }
      },
    operatorsAliases: false
  });

// setup User model and its fields.

const User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
},
email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
},
password: {
    type: Sequelize.STRING,
    allowNull: false
},
accessLvl: {
  type: Sequelize.INTEGER,
  allowNull: false
}
},
{
  hooks: {
    beforeCreate: (user) => {
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(user.password, salt);
    }
  }
});
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


var User2 = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        console.log("check password");
        return bcrypt.compareSync(password, this.password);
      }
    }    
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;