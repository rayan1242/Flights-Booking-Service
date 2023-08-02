const { StatusCodes } = require('http-status-codes')
const{  BookingService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common/index');


async function createbooking(req,res){
    try{
        const response = await BookingService.createbooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        SuccessResponse.message ='Successfully competed the request';
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);

    }catch(error){
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.StatusCodes)
                .json(ErrorResponse);
    }
}

async function makePayment(req,res){
    try{
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        SuccessResponse.message ='Successfully competed the request';
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);

    }catch(error){
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.StatusCodes)
                .json(ErrorResponse);
    }
}

module.exports = {
    createbooking,
    makePayment
}