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
        default: 'https://th.bing.com/th/id/OIP.IWkmX6Kw9yHaF9x-_I04iQHaLH?rs=1&pid=ImgDetMain',
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;