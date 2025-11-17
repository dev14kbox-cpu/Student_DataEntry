// src/Screens/Dashboard/SyncScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";

import {
  getUnsyncedStudents,
  markStudentsSynced,
} from "../../database/DatabaseService";

import { syncStudentsToServerAPI } from "../../API/serverAPI";

const SyncScreen = ({ onBack }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPendingCount();
  }, []);

  const loadPendingCount = async () => {
    try {
      const pending = await getUnsyncedStudents();
      setPendingCount(pending.length);
    } catch (error) {
      console.log("Error loading pending count:", error);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncStatus(null);

    try {
      const pending = await getUnsyncedStudents();

      if (pending.length === 0) {
        setSyncStatus({ success: true, message: "No pending records to sync" });
        setSyncing(false);
        return;
      }

      console.log("🔄 Manual Syncing", pending.length, "records...");

      const success = await syncStudentsToServerAPI(pending);

      if (success) {
        const ids = pending.map((s) => s.id);
        await markStudentsSynced(ids);
        setSyncStatus({
          success: true,
          message: `Successfully synced ${ids.length} records`,
        });
        setPendingCount(0);
      } else {
        setSyncStatus({
          success: false,
          message: "Sync failed. Please check your connection and try again.",
        });
      }
    } catch (error) {
      console.log("Manual sync error:", error);
      setSyncStatus({
        success: false,
        message: "Sync failed. Please try again.",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} color="#67e8f9" />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Data Synchronization</Text>
        <Text style={styles.subtitle}>Sync your local data with the server</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>Pending Records</Text>
        <Text style={styles.statsValue}>{pendingCount}</Text>
        <Text style={styles.statsDescription}>
          Records waiting to be synced to the server
        </Text>
      </View>

      <View style={styles.syncCard}>
        <Text style={styles.syncTitle}>Manual Sync</Text>
        <Text style={styles.syncDescription}>
          Manually sync all pending records to the server. This will upload any unsynced student data.
        </Text>

        <TouchableOpacity
          style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
          onPress={handleManualSync}
          disabled={syncing}
        >
          <LinearGradient
            colors={syncing ? ["#6b7280", "#4b5563"] : ["#9333ea", "#2563eb"]}
            style={styles.syncGradient}
          >
            {syncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <RefreshCw size={18} color="#ffffff" />
                <Text style={styles.syncButtonText}>Sync Now</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {syncStatus && (
        <View style={styles.statusCard}>
          {syncStatus.success ? (
            <CheckCircle size={24} color="#10b981" />
          ) : (
            <XCircle size={24} color="#ef4444" />
          )}
          <Text
            style={[
              styles.statusText,
              syncStatus.success ? styles.statusTextSuccess : styles.statusTextError,
            ]}
          >
            {syncStatus.message}
          </Text>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Synchronization</Text>
        <Text style={styles.infoText}>
          • Data is automatically synced every 30 seconds when online
        </Text>
        <Text style={styles.infoText}>
          • Manual sync allows you to force synchronization immediately
        </Text>
        <Text style={styles.infoText}>
          • Only unsynced records are uploaded to avoid duplicates
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#67e8f9",
    marginLeft: 8,
    fontWeight: "600",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94a3b8",
  },
  statsCard: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statsLabel: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  statsDescription: {
    color: "#64748b",
  },
  syncCard: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  syncTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  syncDescription: {
    color: "#94a3b8",
    marginBottom: 20,
    lineHeight: 20,
  },
  syncButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncGradient: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  syncButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusTextSuccess: {
    color: "#10b981",
  },
  statusTextError: {
    color: "#ef4444",
  },
  infoCard: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  infoText: {
    color: "#94a3b8",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SyncScreen;
