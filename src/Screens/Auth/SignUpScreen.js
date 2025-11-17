// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';

// const SignUpScreen = ({ onLogin, onSwitchToLogin }) => {
//   const handleSignUp = () => {
//     onLogin();
//   };

//   const InputField = ({ icon: Icon, placeholder, secureTextEntry = false }) => {
//     return (
//       <View style={styles.inputContainer}>
//         <View style={styles.inputWrapper}>
//           <Icon size={20} color="#2563eb" />
//           <TextInput
//             style={styles.input}
//             placeholder={placeholder}
//             placeholderTextColor="#64748b"
//             secureTextEntry={secureTextEntry}
//           />
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Form */}
//       <View style={styles.form}>
//         <InputField
//           icon={User}
//           placeholder="Admin Name"
//         />
//         <InputField
//           icon={Mail}
//           placeholder="Email"
//         />
//         <InputField
//           icon={Lock}
//           placeholder="Password"
//           secureTextEntry={true}
//         />
//         <InputField
//           icon={Lock}
//           placeholder="Confirm Password"
//           secureTextEntry={true}
//         />

//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSignUp}
//         >
//           <Text style={styles.submitButtonText}>
//             Sign Up
//           </Text>
//           <ArrowRight size={20} color="#ffffff" />
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           Already have an account? 
//         </Text>
//         <TouchableOpacity onPress={onSwitchToLogin}>
//           <Text style={styles.footerLink}>
//             Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   form: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 24,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.1)',
//     gap: 16,
//   },
//   inputContainer: {
//     position: 'relative',
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.5)',
//     gap: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#0f172a',
//   },
//   submitButton: {
//     backgroundColor: '#2563eb',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     marginTop: 8,
//   },
//   submitButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#64748b',
//   },
//   footerLink: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2563eb',
//     marginLeft: 4,
//   },
// });

// export default SignUpScreen;



// .....................

// src/Screens/Auth/SignUpScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';

const SignUpScreen = ({ onSignup, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  const validateAndSubmit = () => {
    Keyboard.dismiss();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    const signupData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'Admin',
    };

    if (typeof onSignup === 'function') {
      onSignup(signupData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <User size={20} color="#2563eb" />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#64748b"
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <User size={20} color="#2563eb" />
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#64748b"
              value={lastName}
              onChangeText={setLastName}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#2563eb" />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#2563eb" />
            <TextInput
              ref={passRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#2563eb" />
            <TextInput
              ref={confirmRef}
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={validateAndSubmit}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
        >
          <Text style={styles.submitButtonText}>
            Sign Up
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text style={styles.footerLink}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    gap: 16,
  },
  inputContainer: { position: 'relative' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  submitButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#64748b' },
  footerLink: { fontSize: 14, fontWeight: '600', color: '#2563eb', marginLeft: 4 },
});

export default SignUpScreen;
