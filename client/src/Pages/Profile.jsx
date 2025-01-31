import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice'; // Import the new actions

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
      console.log('Profile updated:', response.data);
      dispatch(updateUserSuccess(response.data.user)); // Update the Redux state with the new user data
      setSuccess(true); // Set success message
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input type="file" ref={fileRef} hidden accept='image/*' />
        <img src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
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
            className={`w-full bg-blue-600 text-white py-2 rounded-full mb-4 ${isFetching ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isFetching}
          >
            {isFetching ? 'Updating...' : 'Update'}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">Error updating profile. Please try again.</p>}
        {success && <p className="mt-4 text-center text-green-500">Profile updated successfully!</p>}
        <button
          onClick={handleCreateListing}
          className="w-full bg-green-600 text-white py-2 rounded-full mb-4"
        >
          Create Listing
        </button>
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
    </div>
  );
};

export default Profile;