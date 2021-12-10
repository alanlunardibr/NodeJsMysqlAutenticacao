const { Sequelize, DataTypes } = require('sequelize');
const db = require('./db.js')

const Usuario = db.define('users', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING
    }
})

//Usuario.sync();

Usuario.sync( { alter:true } );

module.exports =  Usuario; 