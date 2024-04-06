const Ticket = require('../models/ticket/Ticket.schema');
require('dotenv').config();
const nodemailer = require('nodemailer');

const createTicket = async(req,res)=> {
    try{
        const { clientId, subject, status, conversation } = req.body;

        const newTicket = new Ticket({
            clientId,
            subject,
            status,
            openAt: Date.now(),
            conversations: [conversation]
          });

        await newTicket.save();

        res.status(201).json(newTicket);
    } catch(error){
        console.error(error);
        res.status(500).json({message: 'Failed to create ticket'})
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
        const { ticketId, sender, message } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(400).json({ message: 'Ticket not found' });
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

        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update ticket' });
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
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).send(ticket);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch ticket details' });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const { userID } = req.params; // Access userID from URL parameters

        // Filter tickets by userID
        const tickets = await Ticket.find({ clientId: userID });

        // Check if tickets are found
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'Tickets not found' });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all tickets by the specified user' });
    }
};

const closeTicket = async(req,res)=>{
    try{
        const {ticketId} = req.params;

        const ticket = await Ticket.findById(ticketId);

        if(!ticket){
            return res.status(400).json({message: 'Ticket not found'});
        }

        ticket.status = 'closed';

        await ticket.save();

        res.status(200).json({message: 'Ticket closed successfully', 
        ticketDetail: ticket,
    })
        
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Failed to close ticket'});
    }
}

module.exports = {createTicket, updateTicket, getTicketDetails, getAllTickets, closeTicket};