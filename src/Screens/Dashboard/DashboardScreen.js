// src/Screens/Dashboard/DashboardScreen.js

import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import NetInfo from "@react-native-community/netinfo";

import Header from "./Header";
import DashboardHome from "./DashboardHome";
import NewStudentForm from "../Records/NewStudentForm";
import ViewRecordsScreen from "../Records/ViewRecordsScreen";
import EditStudentForm from "../Records/EditStudentForm";
import AdminProfileScreen from "../Profile/AdminProfileScreen";
import SyncScreen from "./SyncScreen";

// Database Sync Helpers
import {
  getUnsyncedStudents,
  markStudentsSynced,
} from "../../database/DatabaseService";

import { syncStudentsToServerAPI } from "../../API/serverAPI"; // You will create this file

const DashboardScreen = ({
  currentScreen,
  onNavigate,
  onLogout,
  selectedStudent,
  onSelectStudent,
}) => {

  /* -------------------------------------------------------------
    🔄 AUTO SYNC SYSTEM (Every 30 seconds)
  ------------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const net = await NetInfo.fetch();
        if (!net.isConnected) return;

        const pending = await getUnsyncedStudents();
        if (pending.length === 0) return;

        console.log("🔄 Syncing", pending.length, "records...");

        const success = await syncStudentsToServerAPI(pending);

        if (success) {
          const ids = pending.map((s) => s.id);
          await markStudentsSynced(ids);
          console.log("✅ Auto Sync Success:", ids.length, "students synced");
        }
      } catch (err) {
        console.log("❌ Auto Sync Error:", err.message);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------------
    SCREEN ROUTING
  ------------------------------------------------------------- */

  if (currentScreen === "profile") {
    return (
      <View style={styles.screenWrapper}>
        <Header onLogout={onLogout} onNavigateToProfile={() => {}} />
        <AdminProfileScreen onBack={() => onNavigate("dashboard")} />
      </View>
    );
  }

  if (currentScreen === "new-student") {
    return (
      <View style={styles.screenWrapper}>
        <Header onLogout={onLogout} onNavigateToProfile={() => onNavigate("profile")} />
        <NewStudentForm onBack={() => onNavigate("dashboard")} />
      </View>
    );
  }

  if (currentScreen === "records") {
    return (
      <View style={styles.screenWrapper}>
        <Header onLogout={onLogout} onNavigateToProfile={() => onNavigate("profile")} />
        <ViewRecordsScreen
          onBack={() => onNavigate("dashboard")}
          onSelectStudent={(student) => {
            onSelectStudent(student);
            onNavigate("edit-student");
          }}
        />
      </View>
    );
  }

  if (currentScreen === "edit-student") {
    return (
      <View style={styles.screenWrapper}>
        <Header onLogout={onLogout} onNavigateToProfile={() => onNavigate("profile")} />
        <EditStudentForm
          student={selectedStudent}
          onBack={() => onNavigate("records")}
        />
      </View>
    );
  }

  if (currentScreen === "sync") {
    return (
      <View style={styles.screenWrapper}>
        <Header onLogout={onLogout} onNavigateToProfile={() => onNavigate("profile")} />
        <SyncScreen onBack={() => onNavigate("dashboard")} />
      </View>
    );
  }

  /* DEFAULT: HOME DASHBOARD */
  return (
    <View style={{ flex: 1 }}>
      <Header
        onLogout={onLogout}
        onNavigateToProfile={() => onNavigate("profile")}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <DashboardHome onNavigate={onNavigate} />
      </ScrollView>
    </View>
  );
};

/* -------------------------------------------------------------
   PERFORMANCE OPTIMIZATION — FIXES keyboard losing focus
------------------------------------------------------------- */
export default React.memo(DashboardScreen);

/* -------------------------------------------------------------
   STYLES
------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
});
