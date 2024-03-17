import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: (pass: string) => {
            if(!pass?.length || pass?.length < 5) {
                new Error('Password must be atleast 5 characters');
                return false;
            }
        }
    },
    name: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    streetAddress: {
        type: String,
        default: ''
    }, 
    city: {
        type: String,
        default: ''
    }, 
    postal: {
        type: String,
        default: ''
    }, 
    country: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.models?.User || mongoose.model('User', userSchema);

export default User;