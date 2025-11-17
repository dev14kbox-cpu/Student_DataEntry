import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Animated background gradients */}
          <View style={styles.background}>
            <View style={[styles.gradientCircle, styles.gradient1]} />
            <View style={[styles.gradientCircle, styles.gradient2]} />
            <View style={[styles.gradientCircle, styles.gradient3]} />
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo area */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>AP</Text>
                </View>
              </View>
              <Text style={styles.title}>Admin Portal</Text>
              <Text style={styles.subtitle}>Manage your student database</Text>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  isLogin ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={isLogin ? styles.activeTabText : styles.inactiveTabText}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  !isLogin ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={!isLogin ? styles.activeTabText : styles.inactiveTabText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Render appropriate screen */}
            {isLogin ? (
              <LoginScreen
                onLogin={onLogin}
                onSwitchToSignUp={() => setIsLogin(false)}
              />
            ) : (
              <SignUpScreen
                onSignup={onSignup}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: width * 0.5,
    opacity: 0.1,
  },
  gradient1: {
    top: 0,
    left: width * 0.25,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#60a5fa',
  },
  gradient2: {
    bottom: 0,
    right: width * 0.25,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#818cf8',
  },
  gradient3: {
    top: height * 0.3,
    right: 0,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#93c5fd',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    padding: 16,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2563eb',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  inactiveTabText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AuthScreen;