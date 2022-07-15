import { response } from "express";
import User from "../models/user";


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
        const user = await User.findOne({email: email}).exec();
        // console.log("User exists", user);
        if(!user) return res.status(400).send("User not found");
        
        // check if password matches
        user.comparePassword(password,(error,match) => {
            console.log("Compare password in login error",error);
            if(!match || error) return res.status(400).send("Password does not match");
            console.log("Generate a token and send response to client");
        });


        
    } catch (error) {
        console.log("Login failed",error);
        res.status(400).send("SignIn failed");
    }

};

// darshanpatil3981/SRI2022