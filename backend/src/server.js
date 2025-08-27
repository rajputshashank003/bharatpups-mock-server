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

app.get('/api/dog',
    async (req, res) => {
        try {
            const { breed, search } = req.query;
            let filter = {};

            if (breed) {
                filter.breed = breed;
            }

            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { breed: { $regex: search, $options: 'i' } }
                ];
            }

            const dogs = await DogModel.find(filter);
            const breeds = await DogModel.distinct('breed');

            res.send({ dogs, breeds });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
);

app.get('*',
    async (req, res) => {
    try {
        const breeds = await DogModel.distinct('breed');
        res.send(breeds);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

const port = 8080

app.listen(port, () => {
    console.log("Server Connected... 8080!");
});
export default app;