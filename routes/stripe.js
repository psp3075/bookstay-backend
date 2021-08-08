import express from "express";
const router = express.Router();

import { requireSignIn } from "./../middleware/index";
import { createConnectAccount } from "./../controllers/stripe";

router.post("/create-connect-account", requireSignIn, createConnectAccount);

module.exports = router;
