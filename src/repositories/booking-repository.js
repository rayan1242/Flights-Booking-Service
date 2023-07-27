const { StatusCodes }= require('http-status-codes');
const {Booking}= require('../models')
const CrudRepository = require('./crud-repository')

class BookingRepository extends CrudRepository {
    constructor(){
        super(Booking);
    }
    async createBooking(data,transaction){
       
        const response = await this.model.create(data,{transaction:transaction});
        return response;
}
}

module.exports = BookingRepository
