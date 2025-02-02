import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice'; // Import the new actions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isFetching = useSelector((state) => state.user.isFetching);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileRef = useRef();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    avatar: currentUser?.avatar || ''
  });

  const [success, setSuccess] = useState(false); // State variable for success message
  const [listings, setListings] = useState([]); // State variable for user listings
  const [showListingsError, setShowListingsError] = useState(false); // State variable for listing errors

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setSuccess(false); // Reset success message
    try {
      const response = await axios.put(`/api/user/update/${currentUser._id}`, formData, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      // console.log('Profile updated:', response.data);
      dispatch(updateUserSuccess(response.data.user)); // Update the Redux state with the new user data
      setSuccess(true); // Set success message
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      dispatch(updateUserFailure());
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      await axios.post('/api/auth/signout', {}, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      dispatch(signOutUserSuccess());
      // Handle sign out (e.g., redirect to sign in page)
    } catch (error) {
      console.error('Error signing out:', error.response ? error.response.data : error.message);
      dispatch(signOutUserFailure());
    }
  };

  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart());
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      dispatch(deleteUserSuccess());
      // Handle account deletion (e.g., redirect to sign up page)
    } catch (error) {
      console.error('Error deleting account:', error.response ? error.response.data : error.message);
      dispatch(deleteUserFailure());
    }
  };

  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const response = await axios.get(`/api/user/listings/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      // console.log('User listings:', response.data);
      setListings(response.data.listings); // Set the listings state
    } catch (error) {
      setShowListingsError(true);
      console.error('Error fetching user listings:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await axios.delete(`/api/listing/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setListings(listings.filter(listing => listing._id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error.response ? error.response.data : error.message);
    }
  };

  const defaultImageUrl = 'https://th.bing.com/th/id/OIP.xmdlzEVAMA3gR1-bUXLcHwHaFm?w=1453&h=1100&rs=1&pid=ImgDetMain';


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input type="file" ref={fileRef} hidden accept='image/*' />
        <img crossOrigin="anonymous" src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
        <form onSubmit={handleUpdate}>
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
            />
          </div>
          <button
            type="submit"
            className={`w-full mb-4 shadow-lg text-white py-2 rounded-full font-medium transition-all duration-200 ease-in-out transform ${isFetching
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
              "Update"
            )}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">Error updating profile. Please try again.</p>}
        {success && <p className="mt-4 text-center text-green-500 mb-3">Profile updated successfully!</p>}
        <button
          onClick={handleCreateListing}
          className="w-full bg-green-600 text-white py-2 rounded-full mb-4"
        >
          Create Listing
        </button>
        <button
          onClick={handleShowListing}
          className="w-full bg-yellow-600 text-white py-2 rounded-full mb-4"
        >
          Show Listings
        </button>
        {showListingsError && <p className="mt-4 text-center text-red-500">No listings available. Fill some...</p>}
        <div className="mt-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border mt-2 rounded-lg p-4 flex flex-row md:flex-row justify-between items-center gap-4 shadow-sm"
            >
              {/* Listing Image */}
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <Link to={`/listing/${listing._id}`} className="flex-shrink-0 self-start">
                  <img
                    crossOrigin="anonymous"
                    src={listing.imageUrls?.[0] || defaultImageUrl}
                    alt={`${listing.name} cover`}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                </Link>

                {/* Listing Details */}
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-slate-700 font-semibold hover:underline truncate flex-1"
                >
                  <p className="text-lg whitespace-normal">{listing.name}</p>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-600 font-medium uppercase hover:text-red-800"
                >
                  Delete
                </button>
                <Link to={`/edit-listing/${listing._id}`}>
                  <button className="text-green-600 font-medium uppercase hover:text-green-800">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <span
            onClick={handleDeleteAccount}
            className="text-red-500 cursor-pointer hover:underline"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign Out
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;