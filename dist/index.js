import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./route/userRoute.js";
import groupRoute from "./route/groupRoute.js";
import moduleRoute from "./route/moduleRoute.js";
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
app.use("/groups", groupRoute);
app.use("/users", userRoute);
//* Listening on port
const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
