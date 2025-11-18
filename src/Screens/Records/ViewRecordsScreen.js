// src/Screens/Students/ViewRecordsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Search, Edit, ArrowLeft, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getAllStudents, getStudentsCount } from '../../database/DatabaseService';

const { width } = Dimensions.get('window');

const ViewRecordsScreen = ({ onSelectStudent, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const pageSize = 50; // Records per page

  const fetchStudents = async (page = currentPage, search = searchTerm) => {
    setLoading(true);
    try {
      // Fetch paginated data and total count
      const [rows, count] = await Promise.all([
        getAllStudents(page, pageSize, search),
        getStudentsCount(search)
      ]);

      setStudents(rows || []);
      setTotalRecords(count);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (err) {
      console.error('Fetch students error:', err);
      Alert.alert('Error', 'Failed to load students from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchStudents(1, searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents(currentPage, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchStudents(newPage, searchTerm);
    }
  };

  const renderStudentItem = ({ item, index }) => {
    return (
      <View style={styles.studentCard}>
        <TouchableOpacity style={styles.studentCardContent} onPress={() => onSelectStudent(item)}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.fullName || item.name}</Text>
            <View style={styles.studentDetails}>
              <Text style={styles.studentDetail}>📧 {item.email}</Text>
              <Text style={styles.studentDetail}>📱 {item.mobile}</Text>
            </View>
          </View>
          <View style={styles.studentActions}>
            <View style={[
              styles.statusBadge,
              (item.isSynced === 1) ? styles.statusSynced : styles.statusPending,
            ]}>
              <Text style={[
                styles.statusText,
                (item.isSynced === 1) ? styles.statusTextSynced : styles.statusTextPending,
              ]}>
                {item.isSynced === 1 ? 'Synced' : 'Pending'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                onSelectStudent(item);
              }}
            >
              <Edit size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Student Records</Text>
            <Text style={styles.subtitle}>Search and manage student records</Text>
          </View>

          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <LinearGradient colors={['#2563eb', '#4f46e5']} style={styles.backButtonGradient}>
                <ArrowLeft size={18} color="#ffffff" />
                <Text style={styles.backButtonText}>{width > 480 ? 'Back to Dashboard' : 'Back'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#2563eb" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email or mobile..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <RotateCw size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recordsContainer}>
        {loading ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: '#94a3b8', marginTop: 8 }}>Loading students...</Text>
          </View>
        ) : (
          <>
            {students.length > 0 ? (
              <>
                <FlatList
                  data={students}
                  renderItem={renderStudentItem}
                  keyExtractor={(item) => String(item.id)}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity
                      style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                      onPress={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} color={currentPage === 1 ? "#64748b" : "#2563eb"} />
                    </TouchableOpacity>

                    <View style={styles.pageInfo}>
                      <Text style={styles.pageText}>
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Text style={styles.recordsText}>
                        {totalRecords} total records
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                      onPress={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} color={currentPage === totalPages ? "#64748b" : "#2563eb"} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No students found.</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { marginBottom: 12 },
  headerContent: { flexDirection: width > 480 ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  titleSection: { flex: 1 },
  title: { fontSize: width > 480 ? 28 : 20, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#94a3b8' },
  backButton: { borderRadius: 8, overflow: 'hidden' },
  backButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backButtonText: { color: '#fff', fontWeight: '600' },
  searchContainer: { marginVertical: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', padding: 10, borderRadius: 12 },
  searchInput: { flex: 1, color: '#fff' },
  refreshButton: { paddingHorizontal: 8 },
  recordsContainer: { flex: 1, marginTop: 8 },
  listContent: { paddingBottom: 40 },
  studentCard: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  studentCardContent: { flexDirection: width > 480 ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between', padding: width > 480 ? 18 : 12, backgroundColor: 'rgba(255,255,255,0.02)' },
  studentInfo: { flex: 1 },
  studentName: { color: '#fff', fontSize: width > 480 ? 18 : 16, fontWeight: '700' },
  studentDetails: { marginTop: 6 },
  studentDetail: { color: '#94a3b8' },
  studentActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  statusSynced: { backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' },
  statusPending: { backgroundColor: 'rgba(234,88,12,0.06)', borderColor: 'rgba(234,88,12,0.25)' },
  statusText: { fontWeight: '700' },
  statusTextSynced: { color: '#10b981' },
  statusTextPending: { color: '#f97316' },
  editButton: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(37,99,235,0.06)' },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyStateText: { color: '#94a3b8' },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  pageButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  pageButtonDisabled: {
    backgroundColor: 'rgba(100,116,139,0.1)',
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordsText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
});

export default ViewRecordsScreen;
