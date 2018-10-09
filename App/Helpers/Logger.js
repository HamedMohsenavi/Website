// Node Native
const util = require('util');

// Node Modules
const winston = require('winston');

const Logger = winston.createLogger(
{
    format: winston.format.combine(winston.format.printf((info) => info.message.replace(/\n|\r/g, '').replace(/\s+/g, ' ').trim())),
    transports: [ new winston.transports.Console({ json: false }), new winston.transports.File({ filename: './Resource/Storage/Logs/App.log' }) ]
});

module.exports.Analyze = (Tag, Message) =>
{
    Message = Message || { };

    if (process.env.DEBUG.toLowerCase() === 'true')
        console.log(`${Tag} - ${util.inspect(Message, false, null)}`);

    Message.CreatedTime = Math.floor(Date.now() / 1000);

    Logger.log('Error', `${Tag} - ${util.inspect(Message, false, null)}`);
};
