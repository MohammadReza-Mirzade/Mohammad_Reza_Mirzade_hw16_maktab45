const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    firstName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    nationalNumber:{
        required: true,
        type: String
    },
    beManager:{
        type: Boolean,
        required: true
    },
    gender:{
        type: Boolean,
        required: true
    },
    birthday:{
        required: true,
        type: Date
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true  
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
