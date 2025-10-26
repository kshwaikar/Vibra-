import React, { useState } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const defaultProfile = {
    name: "Sakshi",
    age: 21,
    gender: "Female",
    bio: "Lover of calm mornings, lo-fi music & mindful vibes 🌸",
    photo: "https://i.pravatar.cc/150?img=47",
  };

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("vibra_profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSave = () => {
    localStorage.setItem("vibra_profile", JSON.stringify(editedProfile));
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditedProfile({ ...editedProfile, photo: url });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center text-white font-sans p-4">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6">👤 My Profile</h1>

        {/* Profile Image */}
        <div className="relative flex justify-center mb-4">
          <img
            src={isEditing ? editedProfile.photo : profile.photo}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-400 object-cover shadow-md"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-32 bg-indigo-600 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-700">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Editable Fields */}
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-gray-300">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleChange}
                className="w-full bg-white/20 p-2 rounded-lg text-white outline-none"
              />
            ) : (
              <p className="text-lg font-semibold">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300">Age</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={editedProfile.age}
                onChange={handleChange}
                className="w-full bg-white/20 p-2 rounded-lg text-white outline-none"
              />
            ) : (
              <p className="text-lg">{profile.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={editedProfile.gender}
                onChange={handleChange}
                className="w-full bg-white/20 p-2 rounded-lg text-white outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-lg">{profile.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleChange}
                className="w-full bg-white/20 p-2 rounded-lg text-white outline-none"
              />
            ) : (
              <p className="text-lg">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600 transition-all"
              >
                💾 Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 px-6 py-2 rounded-full hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-600 transition-all"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



