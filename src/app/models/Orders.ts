import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        ref: 'User'
    },
    phone: String,
    streetAddress: String,
    postal: String,
    city: String,
    country: String,
    cartProducts: Object,
    orderStatus: {
        type: String,
        default: 'INITIATED',
        enum: {
            values: ['INITIATED', 'PLACED', 'CANCELED', 'ON THE WAY', 'DELIVERED'],
            message: `{VALUE} is not supported`
        },
    },
    paymentMode: {
        type: String,
        default: 'COD',
        enum: {
            values: ['COD', 'ONLINE'],
            message: `{VALUE} is not supported`
        },
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    cartValue: Number,
    finalCartValue: Number,
    discountValue: {
        type: Number,
        default: 0
    },
    couponApplied: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Order = mongoose.models?.Order || mongoose.model('Order', orderSchema);

export default Order;