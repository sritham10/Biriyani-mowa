import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    name: String,
    price: String
})

const menuItemsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        unique: true
    },
    itemDesc: {
        type: String,
        default: 'Item Description'
    }, 
    itemPrice: {
        type: Number,
        default: 'XXX'
    }, 
    menuImg: {
        type: String
    },
    sizes: {
        type: [sizeSchema]
    },
    category: {
        type: String,
        default: ''
    },
    priority: {
        isPriority: {
            type: Boolean,
            default: false
        },
        priorityLabel: {
            type: String,
            default: ''
        }
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.models?.MenuItem || mongoose.model('MenuItem', menuItemsSchema);

export default MenuItem;