import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const fileRef = useRef();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/update', formData); // Assuming you have an update endpoint
      console.log('Profile updated:', response.data);
      // Handle successful update (e.g., show a success message)
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
    }
  };

  const handleSignOut = () => {
    // Handle sign out (e.g., redirect to sign in page)
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/user/delete'); // Assuming you have a delete endpoint

      // Handle account deletion (e.g., redirect to sign up page)
    } catch (error) {
      console.error('Error deleting account:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full mb-4"
          >
            Update
          </button>
        </form>
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