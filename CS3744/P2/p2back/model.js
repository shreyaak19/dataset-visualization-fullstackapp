/*
 * Project 2
 * model back-end JavaScript code
 *
 * This class structures the format of the datasets located in the MongoDB
 * 
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 */

// Import mongoose library
const mongoose = require('mongoose');

// Create schemas to do connection
const CS3744Schema = new mongoose.Schema({
    fileName: String,
    fileContent: {
        type: Object,
        properties: {
            title: String,
            data: {
                type: Array,
                items: {
                    type: Object
                }
            }
        }
    },
}, {versionKey: false}); // removing the key which is automatically added for new datasets


// Export schema
module.exports = mongoose.model('CS3744Schema', CS3744Schema, 'Datasets');
