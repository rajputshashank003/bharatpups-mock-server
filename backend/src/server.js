import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { DogModel } from '../models/dog.modal.js';
import { ReviewModel } from '../models/reviews.modal.js';
import { dbConnect } from '../config/database.config.js';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));

dbConnect();

let catched_dogs = null;
let is_data_updated = true;

app.get('/api/dog',
    async (req, res) => {
        try {
            const { breed, search } = req.query;
            if (!catched_dogs || is_data_updated) {
                const dogsFromDb = await DogModel.find({});
                const breedsFromDb = await DogModel.distinct('breed');

                catched_dogs = { dogs: dogsFromDb, breeds: breedsFromDb };
                is_data_updated = false;
            }

            let { dogs, breeds } = catched_dogs;
            if (breed) {
                dogs = dogs.filter(d => d.breed === breed);
            }

            if (search) {
                const regex = new RegExp(search, "i");
                dogs = dogs.filter(d => regex.test(d.name) || regex.test(d.breed));
            }
            res.send({ dogs, breeds });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
);

app.get('/api/dog/updated', (req, res) => {
    is_data_updated = true;
    res.status(200).send('Updation done');
});

app.get("/api/dog/id/:id",
    async (req, res) => {
        try {
            const { id } = req.params;

            const dog = await DogModel.findById(id).lean();
            const reviews = await ReviewModel.find({ dog: id });

            if (!dog || !reviews) {
                return res.status(404).json({ message: "Data not found!" });
            }
            res.send({ dog, reviews });
        } catch (err) {
            res.status(404).send('Not found!' + err?.message);
        }
    }
);

app.get('*',
    async (req, res) => {
        try {
            if (!catched_dogs || is_data_updated) {
                const dogsFromDb = await DogModel.find({});
                const breedsFromDb = await DogModel.distinct('breed');
                catched_dogs = { dogs: dogsFromDb, breeds: breedsFromDb };
                is_data_updated = false;
            }

            const { breeds } = catched_dogs;
            res.send(breeds);
        } catch (err) {
            res.status(404).json({
                message: err.message
            });
        }
    }
);

const port = 8008

app.listen(port, () => {
    console.log("Server Connected... 8008!");
});
export default app;