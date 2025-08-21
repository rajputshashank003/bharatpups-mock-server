import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { breeds, dogs } from "./data.js";

const app = express();

app.use(express.json());
app.use(cors({credentials: true , origin: '*'}));

app.use("/api/mockdata/dogs", 
    (req, res) => {
        res.send({dogs, breeds});
    }
);
app.get("*", (req, res) => {
   res.send('hello, this is mock server')
});

const port = 8080

app.listen(port , () => {
    console.log("Server Connected... 8080!");
});
export default app;