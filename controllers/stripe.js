import User from "../models/user";
import Stripe from "stripe";
import queryString from "query-string";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
    });
    // console.log("account=========", account);
    user.stripe_account_id = account.id;
    user.save();
  }

  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });

  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });

  let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  console.log("Login link==========", link);
  res.send(link);
};

export const getAccountStatus = async (req, res) => {
  // console.log("getAccountStatus");
  const user = await User.findById(req.user._id).exec();
  const account = await stripe.accounts.retrieve(user.stripe_account_id);
  // console.log("user account retrive", account);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: account,
    },
    { new: true }
  )
    .select("-password")
    .exec();
  // console.log(updatedUser);
  res.json(updatedUser);
};

export const getAccountBalance = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    // console.log("balance", balance);
    res.json(balance);
  } catch (err) {
    console.log("ERROR", err);
  }
};

export const payoutSetting = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  try {
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      {
        redirect_url: process.env.STRIPE_PAYOUT_REDIRECT_URL,
      }
    );
    // console.log("payout link===", loginLink);
    res.json(loginLink);
  } catch (err) {
    console.log("payout", err);
  }
};
