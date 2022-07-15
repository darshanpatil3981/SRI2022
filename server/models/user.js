import mongoose from 'mongoose';
// const {Schema} = mongoose.Schema;
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: "Name is required"
    },
    email: {
        type: String,
        trim: true,
        required: "Email is required",
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {}

}, {
    timestamps: true
}
);


userSchema.pre("save", function (next) {
    let user = this;
    if (user.isModified("password")) {
        return bcrypt.hash(user.password, 12, function (err, hash){
            if (err) {
                console.log("Bcrypt hash error: ",err);
                return next(err);
            }
            user.password = hash;
            return next();
        });
    } else {
        return next();
    }
});


userSchema.methods.comparePassword = function (password,next) {
    bcrypt.compare(password,this.password,function (err, match) {
        if (err) {
            console.log("comapare password mismatch: ",err);
            return next(err, false);
        }
        console.log("Match password: ",match);
        return next(null,match);
    }
)};


export default mongoose.model("User", userSchema);
