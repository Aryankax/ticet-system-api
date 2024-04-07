const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    clientId : {
        type: Schema.Types.ObjectId,
    },
    colleagueId : {
        type: Schema.Types.ObjectId,
    },
    subject: {
        type: String,
        maxlength: 100,
        required: true,
        default: "",
    },
    openAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    status: {
        type: String,
        required: true,
        enum : ['open', 'pending', 'closed'],
        default: "open",
    },
    conversations: [
        {
            sender: {
                type: String,
                maxlength: 50,
                required: true,
                default: "",
            },
            message: {
                type: String,
                maxlength: 10000,
                required: true,
                default: "",
            },
            msgAt: {
                type: Date,
                required: true,
                default: Date.now(),
            },
        }
    ]
});

module.exports = mongoose.model('Ticket', TicketSchema);