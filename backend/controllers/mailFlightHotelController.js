import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import hotelModel from '../models/hotelModel.js';
import flightModel from '../models/flightModel.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();


// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // Use an App Password
    },
});

// Function to send emails
const sendEmails = async () => {
    try {
        const users = await User.find({});
        
        if (!users.length) {
            console.log('No users to send emails to.');
            return;
        }

        const flights = await flightModel.find({});
        
        const hotels = await hotelModel.find({});

        for (const user of users) {
            const userFlights = flights.filter(flight => flight.email === user.email);
            const userHotels = hotels.filter(hotel => hotel.email === user.email);

            let emailContent = `Hello ${user.name},\n\nHere are your booked deals:\n\n`;
            

            if (userFlights.length) {
                emailContent += `Flights:\n`;
                userFlights.forEach(flight => {
                    emailContent += ` - Booking ID: ${flight.bookingId}\n   Status: ${flight.status}\n   Total Amount: ${flight.totalAmount} ${flight.currency}\n   Created At: ${new Date(flight.createdAt).toLocaleString()}\n\n`;
                });
            } else {
                emailContent += `No flights booked.\n`;
            }

            if (userHotels.length) {
                emailContent += `\nHotels:\n`;
                userHotels.forEach(hotel => {
                    emailContent += ` - Organization: ${hotel.org}\n   Rooms: ${hotel.rooms}\n   Status: ${hotel.status}\n   Updated At: ${new Date(hotel.updatedAt).toLocaleString()}\n\n`;
                });
            } else {
                emailContent += `\nNo hotels booked.\n`;
            }

            emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Update on Your Booked Deals',
                text: emailContent,
            };

            await transporter.sendMail(mailOptions);
            
        }
    } catch (err) {
        console.error('Error sending emails:', err);
    }
};

// cron.schedule('*/1 * * * *', () => {
//     console.log('Cron job triggered...');
//     sendEmails().catch(err => console.error('Error in scheduled job:', err));
// });

cron.schedule('* * * * * *', () => {
    console.log('Running a task every second');
});


