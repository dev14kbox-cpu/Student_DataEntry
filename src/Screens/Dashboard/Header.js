// src/components/Header.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import {
  LogOut,
  Signal,
  User,
  ChevronDown,
} from "lucide-react-native";

import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { getUnsyncedStudents } from "../../database/DatabaseService";
import { BASE_URL } from "../../API/serverAPI";

const Header = ({ onLogout, onNavigateToProfile }) => {
  const [adminName, setAdminName] = useState("Admin");
  const [pendingSync, setPendingSync] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* -----------------------------------------------------
     Load Logged-in Admin Name
  ----------------------------------------------------- */
  useEffect(() => {
    loadAdminName();
    loadPendingSyncCount();
  }, []);

  const loadAdminName = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const user = JSON.parse(stored);
        setAdminName(`${user.firstName} ${user.lastName}`);
      }
    } catch (err) {
      console.log("Failed to load admin name", err);
    }
  };

  /* -----------------------------------------------------
     Get REAL pending sync count (from SQLite)
  ----------------------------------------------------- */
  const loadPendingSyncCount = async () => {
    try {
      const students = await getUnsyncedStudents();
      setPendingSync(students.length);
    } catch (error) {
      console.log("Error loading pending sync count:", error);
    }
  };

  /* -----------------------------------------------------
     Check Online Status using NetInfo
  ----------------------------------------------------- */
  const checkOnlineStatus = () => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });
  };

  useEffect(() => {
    const ping = setInterval(() => {
      checkOnlineStatus();
      loadPendingSyncCount();
    }, 6000);
    return () => clearInterval(ping);
  }, []);

  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);
  const closeProfileMenu = () => setIsProfileOpen(false);

  const handleProfileClick = () => {
    closeProfileMenu();
    onNavigateToProfile?.();
  };

  const handleLogoutClick = () => {
    closeProfileMenu();
    onLogout?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        
        {/* LEFT SIDE LOGO + ADMIN NAME */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={["#2563eb", "#4f46e5"]}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>
              {adminName?.substring(0, 1)}
            </Text>
          </LinearGradient>

         
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightSection}>

          {/* ONLINE STATUS */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                isOnline ? styles.statusOnline : styles.statusOffline,
              ]}
            />
            <Text style={styles.statusText}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>

          {/* PENDING SYNC */}
          <View style={styles.syncContainer}>
            <Signal size={16} color="#2563eb" />
            <Text style={styles.syncText}>
              Sync: <Text style={styles.syncCount}>{pendingSync}</Text>
            </Text>
          </View>

          {/* PROFILE BUTTON */}
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={toggleProfileMenu}
            >
              <LinearGradient
                colors={["#2563eb", "#4f46e5"]}
                style={styles.profileButtonGradient}
              >
                <User size={16} color="#ffffff" />
                <ChevronDown
                  size={16}
                  color="#ffffff"
                  style={[
                    styles.chevron,
                    isProfileOpen && styles.chevronRotated,
                  ]}
                />
              </LinearGradient>
            </TouchableOpacity>

            {/* DROPDOWN */}
            <Modal
              visible={isProfileOpen}
              transparent={true}
              animationType="fade"
              onRequestClose={closeProfileMenu}
            >
              <TouchableWithoutFeedback onPress={closeProfileMenu}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.dropdownMenu}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleProfileClick}
                      >
                        <User size={16} color="#2563eb" />
                        <Text style={styles.menuItemText}>Profile</Text>
                      </TouchableOpacity>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleLogoutClick}
                      >
                        <LogOut size={16} color="#dc2626" />
                        <Text style={[styles.menuItemText, styles.logoutText]}>
                          Logout
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

        </View>
      </View>
    </View>
  );
};

/* -----------------------------------------------------
   Styles
------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(59,130,246,0.3)",
    paddingTop: 40,
    
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  /* LOGO LEFT SIDE */
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoGradient: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },

  /* RIGHT SIDE */
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  /* ONLINE STATUS */
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(37,99,235,0.05)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.2)",
    gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusOnline: { backgroundColor: "#10b981" },
  statusOffline: { backgroundColor: "#ef4444" },
  statusText: { fontSize: 12, color: "#374151" },

  /* SYNC COUNT */
  syncContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(37,99,235,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.2)",
    gap: 6,
  },
  syncText: { fontSize: 12, color: "#374151" },
  syncCount: { fontWeight: "bold", color: "#2563eb" },

  /* PROFILE MENU */
  profileContainer: { position: "relative" },
  profileButton: { borderRadius: 8, overflow: "hidden" },
  profileButtonGradient: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
  },

  chevron: {},
  chevronRotated: { transform: [{ rotate: "180deg" }] },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 16,
  },

  dropdownMenu: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    elevation: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  menuItemText: { fontSize: 14, fontWeight: "500", color: "#374151" },
  logoutText: { color: "#dc2626" },

  menuDivider: {
    height: 1,
    backgroundColor: "rgba(59,130,246,0.3)",
    marginHorizontal: 12,
  },
});

/* Tablet UI adjustments */
const { width } = Dimensions.get("window");
if (width > 768) {
  styles.title.fontSize = 20;
  styles.headerContent.paddingHorizontal = 32;
}

export default Header;
