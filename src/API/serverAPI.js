// src/api/serverAPI.js

import axios from "axios";

// YOUR SERVER
const BASE_URL = "http://192.168.1.5:5000"; // Node.js backend

// SYNC STUDENTS TO SERVER (with chunking for large datasets)
export const syncStudentsToServerAPI = async (students, chunkSize = 50) => {
  try {
    console.log('🔄 Syncing', students.length, 'students to server in chunks of', chunkSize);

    const chunks = [];
    for (let i = 0; i < students.length; i += chunkSize) {
      chunks.push(students.slice(i, i + chunkSize));
    }

    let totalSynced = 0;
    let totalChunks = chunks.length;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🔄 Syncing chunk ${i + 1}/${totalChunks} (${chunk.length} students)...`);

      const response = await axios.post(`${BASE_URL}/api/sync-students`, {
        students: chunk,
      });

      totalSynced += response.data.synced || 0;
      console.log(`✅ Chunk ${i + 1} synced: ${response.data.synced}/${chunk.length}`);
    }

    console.log(`✅ Total sync completed: ${totalSynced}/${students.length} students`);
    return true;
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
