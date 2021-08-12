import expressJwt from "express-jwt";
import Hotel from "../models/hotel";

export const requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const hotelOwner = async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.hotelId).exec();
  let owner = hotel.postedBy._id == req.user._id;
  if (!owner) {
    return res.status(403).send("Unauthorized");
  }
  next();
};
