// src/Screens/Dashboard/DashboardHome.js

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

import { Plus, Search, RefreshCw as Sync } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";

// Import SQLite functions
import { getAllStudents } from "../../database/DatabaseService";

const { width } = Dimensions.get("window");

const DashboardHome = ({ onNavigate }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState({
    total: 0,
    syncedToday: 0,
    pending: 0,
  });

  // ------------------------------
  // Fetch Real-time Stats from SQLite
  // ------------------------------
  const loadStats = async () => {
    try {
      const students = await getAllStudents();

      const total = students.length;

      const today = new Date().toISOString().split("T")[0];

      const syncedToday = students.filter(
        (s) => s.isSynced === 1 && s.admissionDate === today
      ).length;

      const pending = students.filter(
        (s) => s.isSynced !== 1
      ).length;

      setStats({ total, syncedToday, pending });
    } catch (error) {
      console.log("Stats Loading Error:", error);
    }
  };

  // ------------------------------
  // Component Mount Animation + Stats
  // ------------------------------
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    loadStats();
  }, []);

  const navCards = [
    {
      title: "Create New Student",
      description: "Add a new student record",
      icon: Plus,
      screen: "new-student",
      gradient: ["#9333ea", "#2563eb"],
    },
    {
      title: "View/Search Records",
      description: "Browse all student records",
      icon: Search,
      screen: "records",
      gradient: ["#0891b2", "#2563eb"],
    },
    {
      title: "Manual Sync",
      description: "Sync data with database",
      icon: Sync,
      screen: "sync",
      gradient: ["#db2777", "#9333ea"],
    },
  ];

  const statCards = [
    {
      label: "Total Students",
      value: stats.total.toString(),
      colors: ["#2563eb", "#0891b2"],
    },
    {
      label: "Synced Today",
      value: stats.syncedToday.toString(),
      colors: ["#9333ea", "#db2777"],
    },
    {
      label: "Pending to Sync",
      value: stats.pending.toString(),
      colors: ["#ea580c", "#dc2626"],
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Dashboard Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#22d3ee", "#a855f7", "#ec4899"]}
          style={styles.titleGradient}
        >
          <Text style={styles.title}>Welcome Back</Text>
        </LinearGradient>

        <Text style={styles.subtitle}>
          Manage your student database with powerful tools
        </Text>
      </View>

      {/* Navigation Cards */}
      <View style={styles.navGrid}>
        {navCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.navCard}
              onPress={() => onNavigate(card.screen)}
              activeOpacity={0.85}
            >
              <View style={styles.cardContainer}>
                <LinearGradient
                  colors={card.gradient}
                  style={styles.cardGradientBorder}
                >
                  <View style={styles.cardInner}>
                    <LinearGradient
                      colors={card.gradient}
                      style={styles.iconContainer}
                    >
                      <Icon size={32} color="#fff" />
                    </LinearGradient>

                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>
                      {card.description}
                    </Text>

                    <View style={styles.accessIndicator}>
                      <Text style={styles.accessText}>Access →</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* REAL-TIME STATS */}
      <View style={styles.statsGrid}>
        {statCards.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <LinearGradient colors={stat.colors} style={styles.statGradient}>
              <Text style={styles.statValue}>{stat.value}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default DashboardHome;

// ------------------------------
// Styles
// ------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 48,
    alignItems: "center",
  },
  titleGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
  },
  navGrid: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 24,
    marginBottom: 48,
  },
  navCard: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  cardContainer: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  cardGradientBorder: {
    padding: 2,
    borderRadius: 24,
  },
  cardInner: {
    backgroundColor: "rgba(30, 41, 59, 0.85)",
    padding: 32,
    borderRadius: 22,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  accessIndicator: {
    marginTop: 16,
  },
  accessText: {
    fontSize: 16,
    color: "#22d3ee",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statLabel: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  statGradient: {
    padding: 6,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
