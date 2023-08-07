const cron = require('node-cron');
const{ BookingService } = require('../../services');
const res = require('express/lib/response');

function scheduleCrons(){
    cron.schedule('*/30 * * * *',async () => {
        console.log('running a task every 5 sec',BookingService);
        const response = await BookingService.canceloldBookings();
        return response;
      });
}

module.exports = scheduleCrons;