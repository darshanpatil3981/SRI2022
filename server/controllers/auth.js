// import { response } from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken';
import { response } from "express";


export const register = async (req, res) =>{

    const {name, email, password} = req.body;
    // validations
    if(!name) return res.status(400).send("Name is required");
    if(!password || password.length < 6) return res.status(400).send("Password is required and must be at least 6 characters long");
    
    let userExist = await User.findOne({email: email}).exec();
    if(userExist) return res.status(400).send("Email already exists");

    const user = new User(req.body);
    try {
        await user.save();
        console.log('User created', user);
        return res.json({ok: true});
    } catch (error) {
        console.log("Create user failed",error);
        return res.status(400).send("Error creating user");
    }

};


export const login = async (req, res) => {
    console.log(req.body);

    const {email, password} = req.body;
    try {
        //check if user already exists
        let user = await User.findOne({ email }).exec();
        // console.log("User exists", user);
        if(!user) return res.status(400).send("User not found");
        
        // check if password matches
        user.comparePassword(password,(err,match) => {
            console.log("Compare password in login error",err);
            if(!match || err) return res.status(400).send("Password does not match");
            
            // Generate a token and send response to client
            let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: '60m'
            }); 
            console.log("Token generated successfully");

            res.json({ token, user:{
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    stripe_account_id: user.stripe_account_id,
                    stripe_seller: user.stripe_seller,
                    stripeSession: user.stripeSession,
                }
            });
        });

        
    } catch (err) {
        console.log("Login failed",err);
        res.status(400).send("SignIn failed");
    }

};

// darshanpatil3981/SRI2022