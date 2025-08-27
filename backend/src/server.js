import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { breeds, dogs } from "./data.js";
import { DogModel } from '../models/dog.modal.js';
import { dbConnect } from '../config/database.config.js';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));

dbConnect();

app.use("/api/mockdata/dogs",
    (req, res) => {
        res.send({ dogs, breeds });
    }
);

app.get("*", async (req, res) => {
    try {
        const data = await DogModel.find({});
        res.send(data);
    } catch (err) {
        res.send('error in api');
    }
});

const port = 8080

app.listen(port, () => {
    console.log("Server Connected... 8080!");
});
export default app;