import { paymentServices } from "./payment.service";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { premiumServices } from "./premium.services";
// import { bookingValidationSchema } from "./booking.validation";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

const makePremUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    
    console.log("hiiiiiiiiiii",userId);

    // Make the user premium
    const result = await premiumServices.makePremium(userId);

    // Send the response back to the client
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User upgraded to premium successfully",
      data: result, // Pass the result as data
    });

    // Optionally, if you want to initiate a payment, you can call the payment function here.
    // await initiatePayment();
  }
);




const confirmation = catchAsync(
  async (req: Request, res: Response) => {
    const transactionId = req.query.transactionid as string;
    const bookingDetails = await paymentServices.confirmationService(transactionId);
    console.log(bookingDetails)
    return res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f8ff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              overflow: hidden;
            }
            .container {
              text-align: center;
              background-color: #ffffff;
              padding: 50px;
              border-radius: 10px;
              box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
              z-index: 10;
            }
            h1 {
              color: #ffc107; /* Premium gold color */
              font-size: 36px;
            }
            p {
              font-size: 18px;
              color: #333;
            }
            .button {
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #28a745;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #218838;
            }
            /* Balloons styling */
            .balloon {
              position: absolute;
              bottom: -100px;
              width: 60px;
              height: 80px;
              background-color: #ff69b4;
              border-radius: 50%;
              animation: float 10s infinite ease-in;
            }
            /* Different balloon colors */
            .balloon:nth-child(2) { background-color: #ff6347; }
            .balloon:nth-child(3) { background-color: #ffa500; }
            .balloon:nth-child(4) { background-color: #7cfc00; }
            .balloon:nth-child(5) { background-color: #1e90ff; }

            /* Keyframes for falling and floating balloons */
            @keyframes float {
              0% { transform: translateY(100vh); opacity: 1; }
              100% { transform: translateY(-100vh); opacity: 0; }
            }
            /* Different speeds for randomness */
            .balloon:nth-child(2) { animation-duration: 12s; }
            .balloon:nth-child(3) { animation-duration: 14s; }
            .balloon:nth-child(4) { animation-duration: 16s; }
            .balloon:nth-child(5) { animation-duration: 18s; }

          </style>
        </head>
        <body>
          <div class="container">
            <h1>Congratulations, Premium User!</h1>
            <p>Your payment was successfully processed. Enjoy your premium experience.</p>
            <a class="button" href="https://flourishing-stroopwafel-629c6d.netlify.app">Go to Homepage</a>
          </div>

          <!-- Balloons -->
          <div class="balloon" style="left: 10%;"></div>
          <div class="balloon" style="left: 30%;"></div>
          <div class="balloon" style="left: 50%;"></div>
          <div class="balloon" style="left: 70%;"></div>
          <div class="balloon" style="left: 90%;"></div>

        </body>
      </html>
    `);
  }
);



export const premiumController = {
  makePremUser,

  confirmation,
};

