const express = require('express');
const router = express.Router();
const createTicket = require('../controllers/TicketController'); 

router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'API is working fine!' });
});

// Creating a new ticket 
router.post('/ticket', createTicket.createTicket);

// Updating the already existing ticket (This will be used by the customer care representative to give all of his replies and their first reply to the customer compliant would change the status of the ticket from "open" to "pending")
router.put('/ticket/updateTicket', createTicket.updateTicket);

// Get ticket details according to the ticket id 
router.get('/ticket/:ticketID', createTicket.getTicketDetails);

// Get all tickets according to the userID 
router.get('/ticket/getAllTickets/:userID', createTicket.getAllTickets);

// Close ticket 
router.put('/ticket/close/:ticketId', createTicket.closeTicket);

module.exports = router;
