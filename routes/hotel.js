import express from "express";
import formidable from "express-formidable";

const router = express.Router();
import { requireSignIn } from "../middleware";

import { create, hotels, image, sellerHotels } from "./../controllers/hotel";
router.post("/create-hotel", requireSignIn, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignIn, sellerHotels);

module.exports = router;
