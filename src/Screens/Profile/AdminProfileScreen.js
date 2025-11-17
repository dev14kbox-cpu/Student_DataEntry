// src/Screens/Profile/AdminProfileScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { ArrowLeft, Mail, Phone, MapPin, Shield, Edit2 } from "lucide-react-native";

import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUser } from "../../database/DatabaseService";
import { updateUserProfileAPI } from "../../API/serverAPI";

const { width } = Dimensions.get("window"); 

const AdminProfileScreen = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState(null);

  const isTablet = width > 768;

  /* -----------------------------------------
      Load Profile from AsyncStorage
  ------------------------------------------ */
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Ensure fields exist
        const safeUser = {
          ...user,
          phone: user.phone || "",
          address: user.address || "",
          department: user.department || "Administration",
        };

        console.log("Local SQLite User Data:", safeUser);
        setAdminData(safeUser);
        setFormData(safeUser);
      }
    } catch (error) {
      console.log("ERROR Loading Admin Data:", error);
    }
  };

  /* -----------------------------------------
      Handle Input Change
  ------------------------------------------ */
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------------------
        SAVE CHANGES (FINAL ERROR CHECK)
  ------------------------------------------ */
  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        Alert.alert("Validation", "First name, last name and email are required");
        return;
      }

      // Check for email format validity
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        Alert.alert("Validation", "Please enter a valid email address");
        return;
      }

      // 1. Update local SQLite database
      await updateUser(formData.id, formData);

      // Update UI immediately after local update
      setAdminData(formData);
      setIsEditing(false);

      // 2. Update local AsyncStorage session
      await AsyncStorage.setItem("userData", JSON.stringify(formData));

      // 3. Update server database
      // NOTE: This relies on your Node.js backend being available at http://192.168.1.5:5000
      await updateUserProfileAPI(formData);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error); // Log the full error object
      
      let errorMessage = "Failed to update profile. Please try again.";

      // 1. Check for SQL UNIQUE constraint error (local DB)
      if (error.message && error.message.includes("UNIQUE constraint failed")) {
        errorMessage = "Error: This email is already in use by another account.";
        // Reset UI if local failed
        setAdminData(adminData);
        setFormData(adminData);
      }

      // 2. Check for API/Network errors (Axios errors)
      else if (error.message && (error.message.includes("Network Error") || error.message.includes("Request failed"))) {
          errorMessage = "Server/Network error. Profile updated locally, but server sync failed. Please check your connection.";
      }

      Alert.alert("Update Failed", errorMessage);
    }
  };

  if (!adminData) {
    return (
      <View style={styles.loadingWrapper}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  /* -----------------------------------------
        Info Row Component
  ------------------------------------------ */
  const InfoRow = ({ icon: Icon, label, value }) => (
    <View style={styles.infoRow}>
      <Icon size={20} color="#2563eb" style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "—"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#e0f2fe", "#ffffff"]}
        style={styles.gradientBackground}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ArrowLeft size={20} color="#2563eb" />
              <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Admin Profile</Text>
            <Text style={styles.subtitle}>
              View your profile information
            </Text>
          </View>

          <View
            style={[styles.content, isTablet && { flexDirection: "row", gap: 20 }]}
          >
            {/* LEFT CARD */}
            <View
              style={[
                styles.profileCardContainer,
                isTablet && { width: "35%" },
              ]}
            >
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <LinearGradient
                    colors={["#2563eb", "#4f46e5"]}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {adminData.firstName?.[0]}
                      {adminData.lastName?.[0]}
                    </Text>
                  </LinearGradient>

                  <Text style={styles.profileName}>
                    {adminData.firstName} {adminData.lastName}
                  </Text>

                  <Text style={styles.profileRole}>{adminData.role}</Text>

                  <View style={styles.departmentBadge}>
                    <Shield size={16} color="#2563eb" />
                    <Text style={styles.departmentText}>
                      {adminData.department}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT CARD */}
            <View style={[styles.detailsCard, isTablet && { flex: 1 }]}>
              <View style={styles.detailsHeader}>
                <Text style={styles.detailsTitle}>Personal Information</Text>
                <TouchableOpacity
                  style={[styles.editButton, isEditing ? styles.editButtonCancel : styles.editButtonDefault]}
                  onPress={() => {
                    if (isEditing) {
                      setFormData(adminData); // Reset changes
                      setIsEditing(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  <Edit2 size={16} color={isEditing ? "#374151" : "#fff"} />
                  <Text style={[styles.editButtonText, isEditing ? styles.editButtonTextCancel : styles.editButtonTextDefault]}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isEditing ? (
                /* EDIT MODE */
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={styles.editForm}
                >
                  <View style={styles.nameRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>First Name</Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange("firstName", value)}
                        placeholder="Enter first name"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Last Name</Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange("lastName", value)}
                        placeholder="Enter last name"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange("email", value)}
                      placeholder="Enter email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange("phone", value)}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Address</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={formData.address}
                      onChangeText={(value) => handleInputChange("address", value)}
                      placeholder="Enter address"
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Department</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.department}
                      onChangeText={(value) => handleInputChange("department", value)}
                      placeholder="Enter department"
                    />
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <LinearGradient
                        colors={["#2563eb", "#4f46e5"]}
                        style={styles.saveButtonGradient}
                      >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setFormData(adminData);
                        setIsEditing(false);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              ) : (
                /* VIEW MODE */
                <View style={styles.viewMode}>
                  <View style={styles.infoSection}>
                    <View style={styles.infoRowSplit}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>
                          {adminData.firstName} {adminData.lastName}
                        </Text>
                      </View>

                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Role</Text>
                        <Text style={styles.infoValue}>{adminData.role}</Text>
                      </View>
                    </View>

                    <View style={styles.infoRowSplit}>
                      <InfoRow icon={Mail} label="Email" value={adminData.email} />
                      <InfoRow icon={Phone} label="Phone" value={adminData.phone} />
                    </View>

                    <View style={styles.infoFullRow}>
                      <InfoRow icon={MapPin} label="Address" value={adminData.address} />
                    </View>

                    <View style={styles.infoRowSplit}>
                      <InfoRow icon={Shield} label="Department" value={adminData.department} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

/* ---------------------------------------------------
   STYLES
---------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  loadingWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  backButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  backButtonText: { color: "#2563eb", fontSize: 16, fontWeight: "600" },

  title: { fontSize: 28, fontWeight: "bold", color: "#0f172a", marginTop: 16 },
  subtitle: { fontSize: 16, color: "#64748b" },

  content: { paddingHorizontal: 16, gap: 24 },

  profileCardContainer: { width: "100%" },

  profileCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.5)",
  },

  profileHeader: { alignItems: "center" },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  profileName: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  profileRole: { color: "#2563eb", marginBottom: 10 },

  departmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(37,99,235,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  departmentText: { fontSize: 12, fontWeight: "500", color: "#374151" },

  detailsCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.4)",
  },

  detailsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailsTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },

  editButton: { 
    borderRadius: 8, 
    overflow: "hidden", 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    gap: 8,
  },
  editButtonDefault: { backgroundColor: "#2563eb" },
  editButtonCancel: { backgroundColor: "#e5e7eb" },
  editButtonText: { fontSize: 14, fontWeight: "600" },
  editButtonTextDefault: { color: "#fff" },
  editButtonTextCancel: { color: "#374151" },

  editForm: { gap: 20 },
  nameRow: { 
    flexDirection: width > 480 ? "row" : "column", 
    gap: 16 
  },

  inputContainer: { flex: 1 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },

  textInput: {
    borderWidth: 1,
    padding: 12,
    borderColor: "rgba(59,130,246,0.6)",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  textArea: { height: 80, textAlignVertical: "top" },

  buttonRow: { flexDirection: "row", gap: 12 },

  saveButton: { flex: 1 },
  saveButtonGradient: {
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#374151" },

  infoSection: { gap: 16 },
  infoRowSplit: { flexDirection: "row", gap: 16 },
  infoFullRow: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#dbeafe",
  },

  infoRow: { flexDirection: "row", gap: 10, flex: 1 },
  infoIcon: { marginTop: 2 },
  infoLabel: { color: "#64748b", fontSize: 13 },
  infoValue: { fontSize: 16, fontWeight: "500", color: "#0f172a" },

  infoItem: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#dbeafe",
  },

  infoContent: { flex: 1 },

  viewMode: { gap: 16 },
});

export default AdminProfileScreen;