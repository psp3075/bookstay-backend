import Hotel from "../models/hotel";
import Order from "../models/order";

import fs from "fs";

export const create = async (req, res) => {
  console.log("req.fields", req.fields);
  console.log("req.files", req.files);
  try {
    let fields = req.fields;
    let files = req.files;

    let hotel = new Hotel(fields);
    hotel.postedBy = req.user._id;
    if (files.image) {
      hotel.image.data = fs.readFileSync(files.image.path);
      hotel.image.contentType = files.image.type;
    }
    await hotel.save((err, result) => {
      if (err) {
        console.log("saving hotel failed", err);
        res.status(400).send("Error saving hotel");
      }
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

export const hotels = async (req, res) => {
  let allHotels = await Hotel.find({})
    .limit(15)
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();
  //console.log(allHotels)
  res.json(allHotels);
};

export const image = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId).exec();
  if (hotel && hotel.image && hotel.image.data !== null) {
    res.set("Content-Type", hotel.image.contentType);
    return res.send(hotel.image.data);
  }
};

export const sellerHotels = async (req, res) => {
  let all = await Hotel.find({ postedBy: req.user._id })
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();
  res.send(all);
};

export const deleteHotel = async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.hotelId).exec();
  res.json({ ok: true });
};

export const showMore = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId)
    .populate("postedBy", "_id name")
    .select("-image.data")
    .exec();
  res.json(hotel);
};

export const updateHotel = async (req, res) => {
  let fields = req.fields;
  let files = req.files;
  let data = { ...fields };
  console.log(fields, files);

  if (files.image) {
    let image = {};
    image.data = fs.readFileSync(files.image.path);
    image.contentType = files.image.type;

    data.image = image;
  }
  try {
    let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
      new: true,
    }).select("-image.data");
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const userHotelBookings = async (req, res) => {
  const allHotels = await Order.find({ orderedBy: req.user._id })
    .select("session")
    .populate("hotel", "-image.data")
    .populate("orderedBy", "_id name")
    .exec();
  res.json(allHotels);
};
