import cors from "cors";
import express, { Application, Request, Response } from "express";
import bodyParser from 'body-parser';
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/route/intex";
import notFound from "./app/middleware/notFound";

const app: Application = express();
app.set("view engine","ejs")
// Parsers

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Apollo Gears API Service newwwwwwwwwwww',
  });
});


// Application routes
app.use("/api", router);



// app.get("/", getAController);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
