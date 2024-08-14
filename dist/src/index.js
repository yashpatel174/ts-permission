import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// import userRoute from "./route/userRoute";
// import groupRoute from "./route/groupRoute";
import moduleRoute from "./route/moduleRoute";
// import dataRoute from "./route/dataRoute";
dotenv.config();
const app = express();
//* Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//* Connect to MongoDB
mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => console.log("Connected to MongoDB."));
//* Routes
app.use("/modules", moduleRoute);
//* Listening on port
const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
