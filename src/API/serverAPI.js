// src/api/serverAPI.js

import axios from "axios";

// YOUR SERVER
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

export const syncUserToServerAPI = async (userData) => {
  try {
    console.log("📤 Syncing user to server:", userData);

    const response = await axios.put(
      `${BASE_URL}/api/update-profile`,
      {
        ...userData,
        id: 0, // Explicitly set id to 0 for new users during signup
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (err) {
    console.log("❌ Sync User API Error:", err.response?.data || err.message);
    throw err;
  }
};
// .......................................................

// export const updateUserProfileAPI = async (userId, profileData) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/api/update-profile`, profileData);
//     return response.data;
//   } catch (err) {
//     console.log("❌ Update Profile API Error:", err.message);
//     throw err;
//   }
// };
// .......................................................

// export const updateUserProfileAPI = async (profileData) => {
//   try {
//     console.log("📤 Sending profile update:", profileData);

//     const response = await axios.put(
//       `${BASE_URL}/api/update-profile`,
//       profileData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (err) {
//     console.log("❌ Update Profile API Error:", err.response?.data || err.message);
//     throw err;
//   }
// };
//........................................................



export const updateUserProfileAPI = async (profileData) => {
  try {
    console.log("📤 Sending profile update:", profileData);

    // 🔍 Always send email to server first to fetch correct server id
    const fetch = await axios.post(`${BASE_URL}/api/get-user-by-email`, {
      email: profileData.email,
    });

    const serverId = fetch.data?.id || 0;

    const response = await axios.put(
      `${BASE_URL}/api/update-profile`,
      {
        ...profileData,
        id: serverId,   // 🔥 FIX ID MISMATCH
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (err) {
    console.log("❌ Update Profile API Error:", err.response?.data || err.message);
    // Re-throw the error so it can be caught in the component
    throw err;
  }
};
