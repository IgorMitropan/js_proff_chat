'use strict';
let mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
});

schema.statics.isTextValid = function(message) {
   return message.trim();
};

schema.statics.saveMessage = function(username, text, date, callback) {
    let Message = this;

    try {
        if ( Message.isTextValid(text) ) {
            let newMessage = new Message({username: username, message: text, created: date});

            newMessage.save(function(err) {
                if (err) {
                    return callback(err);
                }

                callback(null, newMessage);
            });
        } else {
            callback(new Error('Empty message'));
        }
    } catch(e) {
        callback(new Error('Message is not a string'));
    }
};

exports.Message = mongoose.model('Message', schema);