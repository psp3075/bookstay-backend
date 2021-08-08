import express from "express";
import fs from "fs";
import cors from "cors";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB error :", err));

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

fs.readdirSync("./routes").map((fileinRoutes) =>
  app.use("/api", require(`./routes/${fileinRoutes}`))
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("running on " + port));
