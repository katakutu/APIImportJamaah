const winston = require("winston");
const config = require('../config/config');
const dateformat = require('dateformat');


const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                var datenow = new Date();
                datenow = dateformat(datenow, "yyyy-mm-dd HH:MM:ss");
                return datenow;
            }
        })
    ]
});

module.exports = logger