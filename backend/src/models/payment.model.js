import mongoose from "mongoose";

const paymentSchema=
new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    amount:Number,

    paymentId:String,

    method:String,

    status:{
        type:String,
        default:"Pending"
    }

},
{
timestamps:true
}
)

export const Payment=
mongoose.model(
"Payment",
paymentSchema
)