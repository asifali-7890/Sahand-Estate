import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signinStart, signinSuccess, signinFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FaSpinner } from "react-icons/fa"; // Import loading spinner icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { value, id } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signinStart());
    try {
      const response = await axios.post('/api/auth/signin', formData);
      dispatch(signinSuccess(response.data.user));
      toast.success('Sign in successful!');
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      toast.error('Sign in failed. Please try again.');
      dispatch(signinFailure(error.message));
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full shadow-lg text-white py-2 rounded-full font-medium transition-all duration-200 ease-in-out transform ${isFetching
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:scale-105 hover:bg-blue-600 active:scale-95"
            }`}
          disabled={isFetching}
        >
          {isFetching ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" /> Processing...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
        {error && <p className="mt-4 text-center text-red-500">Sign in failed. Please try again.</p>}
        <OAuth />
        <p className="mt-4 text-center">Dont have an account? <Link to='/signup' className="text-blue-500 hover:underline">Sign Up</Link></p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignIn;