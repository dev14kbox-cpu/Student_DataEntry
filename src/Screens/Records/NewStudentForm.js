// // src/Screens/Students/NewStudentForm.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { ArrowLeft, Save } from 'lucide-react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { addStudent } from '../../database/DatabaseService'; // DB functions. See DatabaseService. :contentReference[oaicite:4]{index=4}

// const NewStudentForm = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     mobile: '',
//     course: '',
//     admissionDate: '',
//     street: '',
//     city: '',
//     state: '',
//     postalCode: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validate = () => {
//     if (!formData.fullName.trim()) {
//       Alert.alert('Validation', 'Full name is required');
//       return false;
//     }
//     if (!formData.email.trim()) {
//       Alert.alert('Validation', 'Email is required');
//       return false;
//     }
//     if (!formData.mobile.trim()) {
//       Alert.alert('Validation', 'Mobile number is required');
//       return false;
//     }
//     if (!formData.course.trim()) {
//       Alert.alert('Validation', 'Course is required');
//       return false;
//     }
//     if (!formData.admissionDate.trim()) {
//       Alert.alert('Validation', 'Admission date is required');
//       return false;
//     }
//     // basic email regex
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email.trim())) {
//       Alert.alert('Validation', 'Please enter a valid email address');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     setIsSubmitting(true);
//     try {
//       // call DatabaseService.addStudent
//       const newRecord = await addStudent(formData);
//       // addStudent may return the inserted id — we don't strictly need it here
//       Alert.alert('Success', 'Student record saved', [{ text: 'OK', onPress: onBack }]);
//     } catch (err) {
//       console.error('Add student error:', err);
//       const msg = err?.message || 'Failed to add student. Try again.';
//       Alert.alert('Error', msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const FormInput = ({ label, name, type = 'text', required = false, style = {} }) => (
//     <View style={[styles.formInputContainer, style]}>
//       <Text style={styles.inputLabel}>
//         {label}
//         {required && <Text style={styles.requiredStar}> *</Text>}
//       </Text>
//       <TextInput
//         style={styles.textInput}
//         value={formData[name]}
//         onChangeText={(value) => setFormData((s) => ({ ...s, [name]: value }))}
//         placeholder={label}
//         placeholderTextColor="#9ca3af"
//         keyboardType={type === 'email' ? 'email-address' : 'default'}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <TouchableOpacity style={styles.backButton} onPress={onBack}>
//           <ArrowLeft size={20} color="#67e8f9" />
//           <Text style={styles.backButtonText}>Back to Dashboard</Text>
//         </TouchableOpacity>

//         <View style={styles.header}>
//           <Text style={styles.title}>New Student Entry</Text>
//           <Text style={styles.subtitle}>Fill in the student details below</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Personal Details</Text>
//           <FormInput label="Full Name" name="fullName" required />
//           <FormInput label="Email" name="email" type="email" required />
//           <FormInput label="Mobile Number" name="mobile" required />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Academic Details</Text>
//           <FormInput label="Course" name="course" required />
//           <FormInput label="Admission Date (YYYY-MM-DD)" name="admissionDate" required />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Address</Text>
//           <FormInput label="Street" name="street" />
//           <FormInput label="City" name="city" />
//           <FormInput label="State" name="state" />
//           <FormInput label="Postal Code" name="postalCode" />
//         </View>

//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSubmit}
//             disabled={isSubmitting}
//             activeOpacity={0.8}
//           >
//             <LinearGradient colors={['#9333ea', '#2563eb']} style={styles.saveGradient}>
//               {isSubmitting ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <>
//                   <Save size={18} color="#ffffff" />
//                   <Text style={styles.saveText}>Save Student</Text>
//                 </>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f172a' },
//   scrollContent: { padding: 16, paddingBottom: 40 },
//   backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
//   backButtonText: { color: '#67e8f9', marginLeft: 8, fontWeight: '600' },
//   header: { marginBottom: 20 },
//   title: { fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 6 },
//   subtitle: { color: '#94a3b8' },
//   section: { marginBottom: 20 },
//   sectionTitle: { color: '#cbd5e1', marginBottom: 12, fontWeight: '700' },
//   formInputContainer: { marginBottom: 12 },
//   inputLabel: { color: '#cbd5e1', marginBottom: 6 },
//   requiredStar: { color: '#ef4444' },
//   textInput: {
//     backgroundColor: 'rgba(255,255,255,0.04)',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#fff',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.05)',
//   },
//   actions: { marginTop: 8 },
//   saveButton: { borderRadius: 12, overflow: 'hidden' },
//   saveGradient: { flexDirection: 'row', padding: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
//   saveText: { color: '#fff', fontWeight: '700' },
// });

// export default NewStudentForm;



// src/Screens/Students/NewStudentForm.js
// src/Screens/Students/NewStudentForm.js

// src/Screens/Students/NewStudentForm.js

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { ArrowLeft, Save } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import { addStudent } from "../../database/DatabaseService";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const NewStudentForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    course: "",
    admissionDate: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------------------------------------------------------
     FIX 1: Robust Validation in handleSubmit to prevent NOT NULL SQL error
  ------------------------------------------------------------------------ */
  const handleSubmit = async () => {
    if (!formData.fullName.trim())
      return Alert.alert("Validation", "Full name is required");

    if (!formData.email.trim())
      return Alert.alert("Validation", "Email is required");

    // Email Pattern Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim()))
        return Alert.alert("Validation", "Please enter a valid email address");

    if (!formData.mobile.trim())
      return Alert.alert("Validation", "Mobile number required");

    if (!formData.course.trim())
      return Alert.alert("Validation", "Course required");

    if (!formData.admissionDate.trim())
      return Alert.alert("Validation", "Admission date required (YYYY-MM-DD)");

    setIsSubmitting(true);

    try {
      await addStudent(formData);
      Alert.alert("Success", "Student saved", [
        { text: "OK", onPress: onBack },
      ]);
      // Optional: Reset form data after successful save
      setFormData({
        fullName: "", email: "", mobile: "", course: "",
        admissionDate: "", street: "", city: "", state: "", postalCode: "",
      });
    } catch (err) {
      console.error("Add student error:", err);
      // Improved error message to help debug potential DB issues
      Alert.alert("Error", `Failed to add student. Ensure all fields are correct. DB Error: ${err?.message || 'Unknown'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------
     FIX 2: Use useCallback to memoize FormInput and prevent focus loss
  ------------------------------------------------------------------------ */
  const FormInput = useCallback(
    ({ label, name, keyboardType = "default" }) => (
      <View style={styles.formInputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          value={formData[name]}
          // Using functional update prevents unnecessary re-renders of the parent
          onChangeText={(v) => setFormData(s => ({ ...s, [name]: v }))}
          placeholder={label}
          placeholderTextColor="#9ca3af"
          keyboardType={keyboardType}
        />
      </View>
    ),
    [formData] // Dependency on formData ensures the component updates when state changes
  );

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="always"
      enableAutomaticScroll={false}
      enableResetScrollToCoords={false}
    >
      <Pressable style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} color="#67e8f9" />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>New Student Entry</Text>
        <Text style={styles.subtitle}>Fill in details below</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <FormInput label="Full Name" name="fullName" />
        <FormInput label="Email" name="email" keyboardType="email-address" />
        <FormInput label="Mobile Number" name="mobile" keyboardType="phone-pad" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Details</Text>
        <FormInput label="Course" name="course" />
        <FormInput label="Admission Date (YYYY-MM-DD)" name="admissionDate" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <FormInput label="Street" name="street" />
        <FormInput label="City" name="city" />
        <FormInput label="State" name="state" />
        <FormInput label="Postal Code" name="postalCode" />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient colors={["#9333ea", "#2563eb"]} style={styles.saveGradient}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={18} color="#ffffff" />
                <Text style={styles.saveText}>Save Student</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  scrollContent: { padding: 16, paddingBottom: 60 },

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

  header: { marginBottom: 20 },
  title: { fontSize: 28, color: "#fff", fontWeight: "700" },
  subtitle: { color: "#94a3b8" },

  section: { marginBottom: 24 },
  sectionTitle: {
    color: "#cbd5e1",
    marginBottom: 12,
    fontWeight: "700",
  },

  formInputContainer: { marginBottom: 14 },
  inputLabel: { color: "#cbd5e1", marginBottom: 6 },

  textInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    fontSize: 16,
  },

  actions: { marginTop: 20 },
  saveButton: { borderRadius: 12, overflow: "hidden" },

  saveGradient: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});

export default React.memo(NewStudentForm);