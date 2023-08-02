const axios = require('axios');
const{ BookingRepository }= require('../repositories');
const db= require('../models');
const{ ServerConfig }= require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { error } = require('../utils/common/success-response');
const e = require('express');
const { ENUMS }= require('../utils/common');
const { BOOKED,CANCELLED }= ENUMS.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createbooking(data){

        const transaction = await db.sequelize.transaction();

        try {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data
            if(data.noOfSeats > flightData.totalSeates){
                throw new AppError("Not enough seats available",StatusCodes.BAD_REQUEST)
            }
            const totalBillinAmount = data.noOfSeats * flightData.price;
            const bookingPaylod = {...data,totalCost:totalBillinAmount};
            const booking = await bookingRepository.create(bookingPaylod,transaction);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}api/v1/flights/${data.flightId}/seats`,{
                seats: data.noOfSeats
            })
            await transaction.commit();
            return booking;
        } catch(error){
            if(error.name = 'AxiosError'){
                throw new AppError("Server problem",StatusCodes.INTERNAL_SERVER_ERROR)
                

            }
            await transaction.rollback();
            throw error;
        }
    
}
    
async function makePayment(data){

    const transaction = await db.sequelize.transaction();

    try{
        const bookingDetails = await bookingRepository.get(data.bookingId);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("The booking has expired",StatusCodes.BAD_REQUEST)
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        console.log(currentTime - bookingTime);
        if(currentTime - bookingTime > 300000){
            const response = await cancelBooking(parseInt(data.bookingId));
            throw new AppError("The booking has expired",StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.totalCost !== parseInt(data.totalCost)){
            throw new AppError("The amount of payment doesn't match",StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.userId !== parseInt(data.userId)){
            throw new AppError("The userId doesn't match",StatusCodes.BAD_REQUEST)

        }

        const response = await bookingRepository.update(parseInt(data.bookingId),{status:BOOKED},transaction);
        await transaction.commit();

    }catch(error){
        await transaction.rollback();
        throw error;
    }

}

async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try{
        const bookingDetails = await bookingRepository.get(bookingId,transaction);
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats: bookingDetails.noOfSeats,
            dec:0
        })
        await bookingRepository.update(parseInt(bookingId),{status:CANCELLED},transaction);
        await transaction.commit();
    }
    catch(error){
        await transaction.rollback();
        throw error;
    }
}

module.exports= {
    createbooking,
    makePayment
}