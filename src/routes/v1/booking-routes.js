const express = require('express');

const { BookingController } = require('../../controllers');

const router = express.Router();

router.post(
    '/',
    BookingController.createbooking
);

router.post(
    '/payments',
    BookingController.makePayment
)

module.exports = router