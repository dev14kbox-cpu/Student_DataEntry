// src/Screens/Students/EditStudentForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { updateStudent, deleteStudent } from '../../database/DatabaseService'; // DB functions. :contentReference[oaicite:7]{index=7}

const EditStudentForm = ({ student, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: student.fullName || student.name || '',
    email: student.email || '',
    mobile: student.mobile || '',
    course: student.course || '',
    admissionDate: student.admissionDate || '',
    street: student.street || '',
    city: student.city || '',
    state: student.state || '',
    postalCode: student.postalCode || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const validate = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation', 'Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Validation', 'Email is required');
      return false;
    }
    // email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await updateStudent(student.id, formData);
      Alert.alert('Success', 'Student record updated', [{ text: 'OK', onPress: onBack }]);
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', err?.message || 'Failed to update record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this student record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteStudent(student.id);
              Alert.alert('Deleted', 'Student record deleted', [{ text: 'OK', onPress: onBack }]);
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', err?.message || 'Failed to delete record');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const FormInput = ({ label, name, type = 'text', style = {} }) => (
    <View style={[styles.formInputContainer, style]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={formData[name]}
        onChangeText={(v) => setFormData((s) => ({ ...s, [name]: v }))}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#9ca3af"
        keyboardType={type === 'email' ? 'email-address' : 'default'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color="#67e8f9" />
          <Text style={styles.backButtonText}>Back to Records</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Edit Record: {formData.fullName}</Text>
          <Text style={styles.subtitle}>Update student information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <FormInput label="Full Name" name="fullName" />
          <FormInput label="Email" name="email" type="email" />
          <FormInput label="Mobile Number" name="mobile" />
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

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={isSaving}>
            <LinearGradient colors={['#9333ea', '#2563eb']} style={styles.saveGradient}>
              {isSaving ? <ActivityIndicator color="#fff" /> : <>
                <Save size={18} color="#fff" />
                <Text style={styles.saveText}>Update</Text>
              </>}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
            {isDeleting ? <ActivityIndicator color="#ef4444" /> : (
              <>
                <Trash2 size={18} color="#ef4444" />
                <Text style={styles.deleteText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  backButtonText: { color: '#67e8f9', marginLeft: 8, fontWeight: '600' },
  header: { marginBottom: 12 },
  title: { fontSize: 22, color: '#fff', fontWeight: '700' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { color: '#cbd5e1', marginBottom: 8, fontWeight: '700' },
  formInputContainer: { marginBottom: 10 },
  inputLabel: { color: '#cbd5e1', marginBottom: 6 },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  saveButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  saveGradient: { padding: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  saveText: { color: '#fff', fontWeight: '700' },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  deleteText: { color: '#ef4444', fontWeight: '700' },
});

export default EditStudentForm;
