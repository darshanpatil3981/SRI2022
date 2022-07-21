import User from "../models/user";
import queryString from "query-string";

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);



export const createConnectAccount = async (req, res) => {
    // console.log("REQ>Authorization header from sign in middleware",req.headers);
    //niche nu vapar (req.user nai)
    // console.log("REQ>auth from sign in middleware",req.auth);
    // console.log("You hit create connect account endpoint");

    // find user by id
    const user = await User.findById(req.auth._id).exec();
    console.log("User: " + user);

    //if user dont have stripe acoount id then create one
    if(!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: 'standard',
        });
        console.log("Account: " , account);
        user.stripe_account_id = account.id;
        user.save();    
    }

    // create login link based on stripe account id
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: 'account_onboarding',
    });

    // prefil any info such as email
    accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email || undefined,
        }
    );

    // console.log("Account link:", accountLink);
    let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
    console.log("Login Link" ,link);
    res.send(link);
    // update payment schedule

    
};


const updateDelayDays = async (accountId) => {
    const account = await stripe.accounts.update(accountId, {
        settings: {
            payouts: {
                schedule: {
                    delay_days: 7,
                }
            }
        }
    });
    return account;
};



export const getAccountStatus = async (req, res) => {
    // console.log("Get Account Status");
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);

    // console.log("User Account retrieve: " ,account);

    //update delay days for payment
    // const updatedAccount = await updateDelayDays(account.id); 

    const updatedUser = await User.findByIdAndUpdate(user._id,{
        // stripe_seller: updatedAccount,
        stripe_seller: account,

    },{new: true}
    ).select("-password").exec();

    // console.log("Updated user: " ,updatedUser);
    res.json(updatedUser);

}

export const getAccountBalance = async (req, res) => { 
    const user = await User.findById(req.auth._id).exec();

    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        });
        // console.log("Balance: " , balance);
        res.json(balance);


    } catch (err) {
        console.log(err);
    }

};

export const payoutSetting = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).exec();

        const loginLink = await stripe.accounts.createLoginLink(user.stripe_account_id, {
            redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL,
        });

        // console.log("Login link for payout setting: " ,loginLink);
        res.json(loginLink);
    } catch (err) {
        console.log("Stripe payout setting error: ",err);
    }
};