import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OAuth from '../components/OAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const SignUp = () => {
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { value, id } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    try {
      await axios.post('/api/auth/signup', formData);
      toast.success('Signup successful!');
      setTimeout(() => {
        navigate('/signin');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Error during signup:', error.response ? error.response.data : error.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full mb-4"
            disabled={isFetching}
          >
            {isFetching ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Processing...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <OAuth />
        <p className="mt-4 text-center">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;