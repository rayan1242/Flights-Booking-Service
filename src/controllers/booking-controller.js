const { StatusCodes } = require('http-status-codes')
const{  BookingService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common/index');

inMemdb = {};

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
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey){
            return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message:'idempotencykey missing in the heder'});
      
        }
        if(inMemdb[idempotencyKey]){
            return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message:'Cannot retry on successful payment'});
      
        }
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        SuccessResponse.message ='Successfully competed the request';
        inMemdb[idempotencyKey] = idempotencyKey;
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