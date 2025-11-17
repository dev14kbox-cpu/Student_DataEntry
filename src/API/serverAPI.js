// src/api/serverAPI.js

import axios from "axios";

// YOUR XAMPP SERVER
const BASE_URL = "http://192.168.1.5:5000"; // Node.js backend

export const syncStudentsToServerAPI = async (students) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/sync-students`, {
      students: students,
    });

    return response.data.message === "Sync completed";
  } catch (err) {
    console.log("❌ Sync API Error:", err.message);
    return false;
  }
};

// export const updateUserProfileAPI = async (userId, profileData) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/api/update-profile`, profileData);
//     return response.data;
//   } catch (err) {
//     console.log("❌ Update Profile API Error:", err.message);
//     throw err;
//   }
// };


export const updateUserProfileAPI = async (profileData) => {
  try {
    console.log("📤 Sending profile update:", profileData);

    const response = await axios.put(
      `${BASE_URL}/api/update-profile`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log("❌ Update Profile API Error:", err.response?.data || err.message);
    throw err;
  }
};

