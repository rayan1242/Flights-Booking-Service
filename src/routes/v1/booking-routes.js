const express = require('express');

const { BookingController } = require('../../controllers');

const router = express.Router();

router.post(
    '/',
    BookingController.createbooking
);

module.exports = router