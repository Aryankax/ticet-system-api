const Ticket = require('../models/ticket/Ticket.schema');
const colleague = require('../models/ticket/colleagueSchema');
require('dotenv').config();

const nodemailer = require('nodemailer');

const createTicket = async(req,res)=> {
    try{
        const { clientId, subject, status, conversation, colleagueId} = req.body;

        const newTicket = new Ticket({
            clientId,
            colleagueId,
            subject,
            status,
            openAt: Date.now(),
            conversations: [conversation]
          });

        await newTicket.save();

        res.status(200).json({ticketData: newTicket, code: '200'});
    } catch(error){
        console.error(error);
        res.status(200).json({message: 'Failed to create ticket', code: '500'});
    }
}

const transporter = nodemailer.createTransport({
    // Configure your email service provider here
    service: 'outlook',
    auth: {
        user: process.env.Email,
        pass: process.env.Password,
    }
});

const updateTicket = async (req, res) => {
    try {
        const { ticketId, sender, message, } = req.body;

        // const representative = await colleague.findById()

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(200).json({ message: 'Ticket not found', code: '400'});
        }

        // Update ticket
        if (sender === 'customer') {
            ticket.conversations.push({ sender, message });

            // Send email notification to representative
            await sendEmailNotification('representative@example.com', 'Customer has updated the ticket');
        } else if (sender === 'representative') {
            ticket.conversations.push({ sender, message });
            ticket.status = 'pending';

            // Send email notification to customer
            await sendEmailNotification('kackeraryan@gmail.com', 'Representative has updated the ticket');
        }

        await ticket.save();

        res.status(200).json({ticketData: ticket, code: '200'});
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Failed to update ticket', code: '500'});
    }
};

// Function to send email notification
const sendEmailNotification = async (recipient, message) => {
    try {
        // Send email using Nodemailer
        await transporter.sendMail({
            from: process.env.Email,
            to: recipient,
            subject: 'Ticket Update Notification',
            text: message
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const getTicketDetails = async (req, res) => {
    try {
        const {ticketID}  = req.params;

        // console.log(req.params.ticketID)

        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            return res.status(200).json({ message: 'Ticket not found', code: '404'});
        }

        res.status(200).send({ticketData: ticket, code: '200'});

    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Failed to fetch ticket details', code: '500'});
    }
};

const getAllTickets = async (req, res) => {
    try {
        const { userID } = req.params; // Access userID from URL parameters

        // Filter tickets by userID
        const tickets = await Ticket.find({ clientId: userID });

        // Check if tickets are found
        if (!tickets || tickets.length === 0) {
            return res.status(200).json({ message: 'Tickets not found', code: '404'});
        }

        res.status(200).json({ticketData: tickets, code: '200'});
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Failed to fetch all tickets by the specified user', code: '500'});
    }
};

const closeTicket = async(req,res)=>{
    try{
        const {ticketId} = req.params;

        const ticket = await Ticket.findById(ticketId);

        if(!ticket){
            return res.status(200).json({message: 'Ticket not found', code: '400'});
        }

        ticket.status = 'closed';

        await ticket.save();

        res.status(200).json({message: 'Ticket closed successfully', 
        ticketDetail: ticket, code: '200'
    })
        
    } catch(error){
        console.log(error);
        res.status(200).json({message: 'Failed to close ticket', code: '500'});
    }
}

module.exports = {createTicket, updateTicket, getTicketDetails, getAllTickets, closeTicket};