import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const Profile = () => {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data);
        setUpdatedData({ username: response.data.username, email: response.data.email });
      } catch (err) {
        setMessage("You are not authenticated. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    fetchProfile();
  }, [navigate]);


  const handleEditChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/update", updatedData);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
    }
  };


  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await api.delete("/auth/delete");
        setMessage("Account deleted successfully");
        navigate("/");
      } catch (err) {
        setMessage(err.response?.data?.message || "Error deleting account");
      }
    }
  };


  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p>{message}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Profile</h2>

        {message && <div className="text-red-500 text-center mb-4">{message}</div>}

        {/* EDIT MODE */}
        {editMode ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
              <input
                type="text"
                name="username"
                value={updatedData.username}
                onChange={handleEditChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={updatedData.email}
                onChange={handleEditChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          
          // NOT EDIT MODE
          <div>
            <div className="mb-4">
              <div className="text-lg font-semibold text-gray-800">Username:</div>
              <div className="text-gray-600">{user.username}</div>
            </div>
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-800">Email:</div>
              <div className="text-gray-600">{user.email}</div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
