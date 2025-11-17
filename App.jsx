// App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AuthScreen from './src/Screens/Auth/AuthScreen';
import DashboardScreen from './src/Screens/Dashboard/DashboardScreen';
import {
  initDatabase,
  authenticateUser,
  createUser,
  seedDefaultAdmin,
} from './src/database/DatabaseService';

import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // Auth + navigation state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Loading & DB state
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Logged-in user info
  const [userData, setUserData] = useState(null);

  /************************************************************************
   * App initialization: setup DB and seed default admin if needed
   ************************************************************************/
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing database...');

      // Initialize DB (react-native-sqlite-2)
      await initDatabase();

      // Seed admin if none exists
      await seedDefaultAdmin();

      setDbInitialized(true);
      console.log('Database initialized successfully');

      // Load saved auth/session from AsyncStorage
      const [token, user] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (token && user) {
        console.log('User found in storage, auto-login');
        setIsAuthenticated(true);
        setUserData(JSON.parse(user));
      } else {
        console.log('No user found in storage');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert(
        'Database Error',
        'Failed to initialize database. Some features may not work properly.',
        [{ text: 'Continue' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  /************************************************************************
   * Authentication: Login, Signup
   *
   * Note: we keep these functions stable where helpful, but the critical
   * re-rendering sources were the navigation/callback props. The
   * main fixes are useCallback wrappers below.
   ************************************************************************/
  const handleLogin = useCallback(
    async (email, password) => {
      if (!dbInitialized) {
        Alert.alert('Error', 'Database not initialized. Please restart the app.');
        return;
      }

      if (!email || !password) {
        Alert.alert('Validation Error', 'Please enter both email and password');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Attempting login for:', email);

        const user = await authenticateUser(email, password);
        console.log('Login successful for user:', user.id);

        // Persist auth/session
        await Promise.all([
          AsyncStorage.setItem('userToken', `auth-token-${user.id}`),
          AsyncStorage.setItem('userData', JSON.stringify(user)),
        ]);

        setUserData(user);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');

        Alert.alert('Success', `Welcome back, ${user.firstName}!`);
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.message && error.message.includes('Invalid credentials')
          ? 'Invalid email or password'
          : 'Login failed. Please try again.';
        Alert.alert('Login Failed', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [dbInitialized]
  );

  const handleSignup = useCallback(
    async (signupData) => {
      if (!dbInitialized) {
        Alert.alert('Error', 'Database not initialized. Please restart the app.');
        return;
      }

      // Basic validation
      if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      if (signupData.password.length < 6) {
        Alert.alert('Validation Error', 'Password must be at least 6 characters long');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Attempting signup for:', signupData.email);

        const newUser = await createUser(signupData);
        console.log('Signup successful for user:', newUser.id);

        // Persist auth/session
        await Promise.all([
          AsyncStorage.setItem('userToken', `auth-token-${newUser.id}`),
          AsyncStorage.setItem('userData', JSON.stringify(newUser)),
        ]);

        setUserData(newUser);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');

        Alert.alert('Success', `Account created successfully! Welcome, ${newUser.firstName}!`);
      } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error.message && error.message.includes('UNIQUE constraint')
          ? 'Email already exists. Please use a different email.'
          : 'Signup failed. Please try again.';
        Alert.alert('Signup Failed', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [dbInitialized]
  );

  /************************************************************************
   * Logout flow
   *
   * performLogout is an async action that actually clears storage and
   * resets state. We wrap performLogout in useCallback for stability and
   * create a stable handleLogout that triggers the confirmation Alert.
   ************************************************************************/
  const performLogout = useCallback(async () => {
    try {
      console.log('Performing logout...');

      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('userData'),
      ]);

      setIsAuthenticated(false);
      setCurrentScreen('dashboard');
      setSelectedStudent(null);
      setUserData(null);

      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'Failed to logout properly');
    }
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: performLogout },
      ]
    );
  }, [performLogout]);

  /************************************************************************
   * Navigation and selection handlers — these caused re-renders previously
   * so we wrap them with useCallback to keep references stable across
   * parent renders. This prevents children from re-mounting unnecessarily.
   ************************************************************************/
  const handleNavigate = useCallback((screen) => {
    console.log('Navigating to:', screen);
    setCurrentScreen(screen);
  }, []);

  const handleSelectStudent = useCallback((student) => {
    console.log('Student selected:', student?.id ?? student);
    setSelectedStudent(student);
  }, []);

  const handleUpdateProfile = useCallback((updatedData) => {
    setUserData(updatedData);
    AsyncStorage.setItem('userData', JSON.stringify(updatedData));
  }, []);

  /************************************************************************
   * UI: Loading state
   ************************************************************************/
  if (isLoading) {
    return <LoadingScreen />;
  }

  /************************************************************************
   * Main render
   ************************************************************************/
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isAuthenticated ? "light-content" : "dark-content"}
        backgroundColor={isAuthenticated ? "#0f172a" : "#ffffff"}
      />

      {!isAuthenticated ? (
        <AuthScreen
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      ) : (
        <DashboardScreen
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          selectedStudent={selectedStudent}
          onSelectStudent={handleSelectStudent}
          userData={userData}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </View>
  );
};

/************************************************************************
 * LoadingScreen component (kept simple and similar to your original)
 ************************************************************************/
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingContent}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>AP</Text>
      </View>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.loadingText}>Initializing Admin Portal...</Text>
      <Text style={styles.loadingSubtext}>Setting up database...</Text>
    </View>
  </View>
);

/************************************************************************
 * Styles (kept same structure you had)
 ************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default App;
