import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc"; // Import Google icon from react-icons

const firebaseConfig = {
    apiKey: "AIzaSyDOnNRmIe93HOyC_eFiw-EtM1BBNGqf6t4",
    authDomain: "mern-estate-28498.firebaseapp.com",
    projectId: "mern-estate-28498",
    storageBucket: "mern-estate-28498.firebasestorage.app",
    messagingSenderId: "513092563768",
    appId: "1:513092563768:web:34c76750608beb109347cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true

    const handleGoogleSignIn = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const { displayName, email, photoURL } = user;

            // Make an API call to your backend
            const response = await axios.post('/api/auth/google', {
                name: displayName,
                email,
                photo: photoURL
            });

            // Dispatch the signinSuccess action with the user data
            dispatch(signinSuccess(response.data.user));
            // console.log('User signed in:', user);

            // Navigate to the home page
            navigate('/');
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="mt-2 flex items-center justify-center w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full shadow-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
        >
            <FcGoogle className="text-2xl mr-2" /> {/* Google Logo */}
            Continue with Google
        </button>
    );
};

export default OAuth;