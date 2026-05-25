import mongoose from "mongoose";

const orderSchema=
new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    orderItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            quantity:Number,

            price:Number
        }
    ],

    shippingAddress:{
        address:String,
        city:String,
        state:String,
        pincode:String,
        country:String
    },

    paymentMethod:{
        type:String
    },

    totalPrice:Number,

    orderStatus:{
        type:String,
        enum:[
            "Pending",
            "Processing",
            "Shipped",
            "Delivered"
        ],

        default:"Pending"
    }

},
{
timestamps:true
}
)

export const Order=
mongoose.model("Order",orderSchema)