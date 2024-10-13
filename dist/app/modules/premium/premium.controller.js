"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.premiumController = void 0;
const payment_service_1 = require("./payment.service");
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const premium_services_1 = require("./premium.services");
// import { bookingValidationSchema } from "./booking.validation";
const http_status_codes_1 = require("http-status-codes");
const makePremUser = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    console.log("hiiiiiiiiiii", userId);
    // Make the user premium
    const result = yield premium_services_1.premiumServices.makePremium(userId);
    // Send the response back to the client
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User upgraded to premium successfully",
        data: result, // Pass the result as data
    });
    // Optionally, if you want to initiate a payment, you can call the payment function here.
    // await initiatePayment();
}));
const confirmation = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionid;
    const bookingDetails = yield payment_service_1.paymentServices.confirmationService(transactionId);
    console.log(bookingDetails);
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
}));
exports.premiumController = {
    makePremUser,
    confirmation,
};
