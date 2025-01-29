import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.0CZd1ESLnyWIHdO38nyJDAHaGF?w=223&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;