 const express = require('express');

 const router = express.Router();

 const bookingRoutes = require('./booking-routes')

 const { InfoController } = require('../../controllers');
 
 router.get('/info',InfoController.info);

 router.use('/bookings',bookingRoutes);

 module.exports = router;



