import express from "express";
import formidable from "express-formidable";

const router = express.Router();
import { requireSignIn, hotelOwner } from "../middleware";

import {
  create,
  hotels,
  image,
  sellerHotels,
  deleteHotel,
  showMore,
  updateHotel,
} from "./../controllers/hotel";
router.post("/create-hotel", requireSignIn, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignIn, sellerHotels);
router.delete("/delete-hotel/:hotelId", requireSignIn, hotelOwner, deleteHotel);
router.get("/hotel/:hotelId", showMore);
router.put(
  "/update-hotel/:hotelId",
  requireSignIn,
  hotelOwner,
  formidable(),
  updateHotel
);

module.exports = router;
