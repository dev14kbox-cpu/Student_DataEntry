// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { Mail, Lock, ArrowRight } from 'lucide-react-native';

// const LoginScreen = ({ onLogin, onSwitchToSignUp }) => {
//   const handleLogin = () => {
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
//           icon={Mail}
//           placeholder="Email"
//         />
//         <InputField
//           icon={Lock}
//           placeholder="Password"
//           secureTextEntry={true}
//         />

//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleLogin}
//         >
//           <Text style={styles.submitButtonText}>
//             Login
//           </Text>
//           <ArrowRight size={20} color="#ffffff" />
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           Don't have an account? 
//         </Text>
//         <TouchableOpacity onPress={onSwitchToSignUp}>
//           <Text style={styles.footerLink}>
//             Sign Up
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

// export default LoginScreen;





// ...................................


// src/Screens/Auth/LoginScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

const LoginScreen = ({ onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passRef = useRef(null);

  const handleLogin = () => {
    Keyboard.dismiss();
    if (typeof onLogin === 'function') {
      onLogin(email.trim(), password);
    }
  };

  return (
    <View style={styles.container}>
      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#2563eb" />
            <TextInput
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
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleLogin}
        >
          <Text style={styles.submitButtonText}>
            Login
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={onSwitchToSignUp}>
          <Text style={styles.footerLink}>
            Sign Up
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

export default LoginScreen;
