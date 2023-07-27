const axios = require('axios');
const{ BookingRepository }= require('../repositories');
const db= require('../models');
const{ ServerConfig }= require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { error } = require('../utils/common/success-response');
const e = require('express');

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
    

module.exports= {
    createbooking
}