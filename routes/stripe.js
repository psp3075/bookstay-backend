import express from "express";
const router = express.Router();

import { requireSignIn } from "./../middleware/index";
import {
  createConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting,
  stripeSessionId,
  stripeSuccess,
} from "./../controllers/stripe";

router.post("/create-connect-account", requireSignIn, createConnectAccount);
router.post("/get-account-status", requireSignIn, getAccountStatus);
router.post("/get-account-balance", requireSignIn, getAccountBalance);
router.post("/payout-setting", requireSignIn, payoutSetting);
router.post("/stripe-session-id", requireSignIn, stripeSessionId);
router.post("/stripe-success", requireSignIn, stripeSuccess);
module.exports = router;
