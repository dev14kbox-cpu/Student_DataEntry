# Student Data Entry App - Documentation

## Project Overview

This is a comprehensive React Native mobile application designed for managing student records in an educational institution. The app provides offline-first functionality with automatic synchronization to a central server, ensuring data availability even without internet connectivity.

### Key Features
- **Offline-First Architecture**: Works without internet using local SQLite database
- **Automatic Synchronization**: Syncs data to MySQL server every 30 seconds when online
- **User Authentication**: Admin login/signup system
- **Student Management**: CRUD operations for student records
- **Real-time Dashboard**: Live statistics and sync status
- **Profile Management**: Admin profile editing with server sync
- **Search & Filter**: Advanced search functionality for student records

## Technology Stack

### Frontend (React Native)
- **React Native**: Core framework for cross-platform mobile development
- **react-native-sqlite-2**: Local SQLite database for offline storage
- **@react-native-community/netinfo**: Network connectivity monitoring
- **@react-native-async-storage/async-storage**: Persistent key-value storage
- **react-native-linear-gradient**: UI gradients for modern design
- **lucide-react-native**: Icon library for consistent UI elements
- **axios**: HTTP client for API communication
- **react-native-keyboard-aware-scroll-view**: Keyboard handling for forms

### Backend (Node.js/Express)
- **Express.js**: Web framework for REST API
- **mysql2**: MySQL database driver
- **cors**: Cross-origin resource sharing middleware

### Database
- **SQLite (Mobile)**: Local database for offline functionality
- **MySQL (Server)**: Central database for data synchronization

## Project Structure

```
StudentDataEntry/
├── src/
│   ├── API/
│   │   └── serverAPI.js          # API functions for server communication
│   ├── database/
│   │   └── DatabaseService.js    # SQLite database operations
│   ├── Screens/
│   │   ├── Auth/
│   │   │   ├── AuthScreen.js     # Authentication container
│   │   │   ├── LoginScreen.js    # Login form
│   │   │   └── SignUpScreen.js   # Registration form
│   │   ├── Dashboard/
│   │   │   ├── DashboardScreen.js    # Main dashboard router
│   │   │   ├── DashboardHome.js      # Home screen with stats
│   │   │   ├── Header.js             # App header with profile menu
│   │   │   └── SyncScreen.js         # Manual sync interface
│   │   ├── Records/
│   │   │   ├── NewStudentForm.js     # Add new student
│   │   │   ├── EditStudentForm.js    # Edit existing student
│   │   │   └── ViewRecordsScreen.js  # List/search students
│   │   └── Profile/
│   │       └── AdminProfileScreen.js # Admin profile management
│   └── App.jsx                      # Main app component
├── Backend/
│   ├── server.js                    # Express server entry point
│   ├── apiRoutes.js                 # User profile API routes
│   ├── routes/
│   │   └── sync.js                  # Student sync API routes
│   ├── db.js                        # MySQL database connection
│   ├── db.sql                       # Database schema
│   └── package.json                 # Backend dependencies
└── document.md                      # This documentation
```

## Data Workflow

### 1. Authentication Flow
```
User Input → Local SQLite Check → AsyncStorage Session → Dashboard Access
```

### 2. Student Data Flow
```
Add/Edit → Local SQLite → Mark as Unsynced → Auto-sync (30s) → MySQL Server
```

### 3. Synchronization Process
```
Mobile App → Check Network → Get Unsynced Records → API Call → Server Processing → Mark Synced
```

### 4. Profile Management
```
Edit Profile → Local SQLite Update → AsyncStorage Update → Server Sync → Confirmation
```

## Core Functions and Their Responsibilities

### App.jsx (Main Application)
- **initializeApp()**: Sets up database, seeds admin user, loads saved sessions
- **handleLogin()**: Authenticates user against SQLite, saves session
- **handleSignup()**: Creates new user locally and syncs to server
- **performLogout()**: Clears session data and resets app state
- **Auto-sync Effect**: Runs every 30 seconds to sync unsynced data

### DatabaseService.js (SQLite Operations)
- **initDatabase()**: Creates users and students tables
- **seedDefaultAdmin()**: Inserts default admin user if none exists
- **authenticateUser()**: Validates login credentials
- **createUser()**: Adds new user to local database
- **updateUser()**: Modifies user profile information
- **getAllStudents()**: Retrieves all student records
- **addStudent()**: Inserts new student (marked as unsynced)
- **updateStudent()**: Modifies student data (marks as unsynced)
- **deleteStudent()**: Removes student record
- **getUnsyncedStudents()**: Gets records pending server sync
- **markStudentsSynced()**: Updates sync status after successful upload

### serverAPI.js (Server Communication)
- **syncStudentsToServerAPI()**: Uploads student data to MySQL server
- **syncUserToServerAPI()**: Syncs user registration to server
- **updateUserProfileAPI()**: Updates user profile on server

### Screen Components

#### Authentication Screens
- **AuthScreen**: Container managing login/signup state
- **LoginScreen**: Email/password authentication form
- **SignUpScreen**: User registration with validation

#### Dashboard Components
- **DashboardScreen**: Main router for different app sections
- **DashboardHome**: Statistics display and navigation cards
- **Header**: App header with online status, sync count, and profile menu
- **SyncScreen**: Manual synchronization interface

#### Student Management
- **NewStudentForm**: Form for adding new students with validation
- **EditStudentForm**: Edit existing student records
- **ViewRecordsScreen**: List view with search and edit functionality

#### Profile Management
- **AdminProfileScreen**: Admin profile editing interface

### Backend API Routes

#### apiRoutes.js
- **POST /api/get-user-by-email**: Retrieves user ID by email
- **PUT /api/update-profile**: Updates or creates user profile

#### routes/sync.js
- **POST /api/sync-students**: Receives and stores student data
- **GET /api/sync-students**: Returns all students (for sync verification)


## Pagination Feature

### Overview
The Student Data Entry app now includes pagination functionality to improve performance when handling large datasets. This prevents memory issues and provides a better user experience by loading data in manageable chunks.

### Implementation Details

#### Frontend (React Native)
- **Page Size**: 50 records per page
- **Debounced Search**: 500ms delay to prevent excessive API calls during typing
- **Pagination Controls**: Previous/Next buttons with page information display
- **State Management**: Tracks current page, total pages, and total records

#### Backend (Node.js)
- **Database Queries**: Uses `LIMIT` and `OFFSET` for efficient pagination
- **API Endpoints**: Support pagination parameters (`page`, `limit`)
- **Response Format**: Includes pagination metadata (current page, total pages, total records)

#### Database Layer
- **Modified Functions**:
  - `getAllStudents(page, limit, searchTerm)`: Fetches paginated student records
  - `getStudentsCount(searchTerm)`: Returns total record count for pagination calculations

#### Sync Operations
- **Chunk Size**: 50 records per batch during server synchronization
- **Purpose**: Prevents timeouts when syncing large datasets
- **Progress Logging**: Shows sync progress for each chunk

### Files Modified
- `src/Screens/Records/ViewRecordsScreen.js`: Added pagination UI and logic
- `src/database/DatabaseService.js`: Updated database functions for pagination
- `Backend/routes/sync.js`: Modified sync endpoint to support pagination
- `src/API/serverAPI.js`: Enhanced sync function with chunking

### Benefits
- **Performance**: Faster loading times with smaller data chunks
- **Scalability**: Handles large datasets efficiently
- **User Experience**: Responsive search and clear navigation
- **Reliability**: Prevents sync timeouts for large operations


## Database Schema

### SQLite (Mobile)
```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  department TEXT,
  role TEXT DEFAULT 'Admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  course TEXT NOT NULL,
  admissionDate TEXT NOT NULL,
  street TEXT,
  city TEXT,
  state TEXT,
  postalCode TEXT,
  status TEXT DEFAULT 'Pending',
  isSynced INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### MySQL (Server)
```sql
-- Students table (server)
CREATE TABLE students (
  id INT PRIMARY KEY,
  fullName VARCHAR(255),
  email VARCHAR(255),
  mobile VARCHAR(50),
  course VARCHAR(255),
  admissionDate VARCHAR(50),
  street VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  postalCode VARCHAR(50),
  createdAt DATETIME
);
```

## Key Workflows

### 1. Student Creation
1. User fills NewStudentForm
2. Validation checks required fields and email format
3. addStudent() saves to SQLite with isSynced = 0
4. Auto-sync runs every 30 seconds
5. syncStudentsToServerAPI() uploads to MySQL
6. markStudentsSynced() updates local status

### 2. User Authentication
1. LoginScreen collects credentials
2. authenticateUser() checks against SQLite
3. On success, saves session to AsyncStorage
4. App switches to authenticated state
5. Dashboard loads with user-specific data

### 3. Data Synchronization
1. Background timer checks network connectivity
2. If online, retrieves unsynced records
3. Batches data and sends to server
4. Server processes with INSERT ... ON DUPLICATE KEY UPDATE
5. Local records marked as synced
6. UI updates sync counters

### 4. Profile Updates
1. AdminProfileScreen allows editing
2. updateUser() modifies local SQLite
3. AsyncStorage updated for session persistence
4. updateUserProfileAPI() syncs to server
5. Server updates or creates user record

## Error Handling

### Network Errors
- Automatic retry logic for failed syncs
- Offline mode continues local operations
- User notifications for connection issues

### Database Errors
- SQLite transaction rollbacks on failures
- Validation prevents corrupt data entry
- Graceful degradation when database unavailable

### Validation
- Client-side validation for required fields
- Email format checking
- Duplicate prevention for unique constraints

## Performance Optimizations

- **React.memo()**: Prevents unnecessary re-renders
- **useCallback()**: Stable function references for child components
- **Batch Operations**: Sync multiple records simultaneously
- **Lazy Loading**: Components load data as needed
- **Background Sync**: Non-blocking synchronization process

## Security Considerations

- Password storage in SQLite (local only)
- Server-side validation for all API endpoints
- CORS configuration for cross-origin requests
- Input sanitization to prevent SQL injection
- Session management with AsyncStorage

## Development and Deployment

### Running the App
1. Start MySQL server (XAMPP/standalone)
2. Run `npm install` in Backend directory
3. Start backend: `node server.js`
4. Start React Native app: `npx react-native run-android`

### Database Setup
1. Create MySQL database using db.sql
2. Configure connection in Backend/db.js
3. App automatically creates SQLite tables on first run

This documentation provides a comprehensive overview of the Student Data Entry application's architecture, functionality, and data flow. The app demonstrates modern mobile development practices with offline-first design and robust synchronization capabilities.







# How Sync Works When Server is Down
## Offline-First Architecture: The app stores all data locally in SQLite first, then attempts to sync to the server when online. This ensures the app continues to function normally even when the server is unavailable.

# Key Points:

Local Storage: Data is saved to local SQLite immediately with isSynced = 0
Graceful Failures: Sync attempts fail silently without affecting app functionality
Automatic Retry: Every 30 seconds, the app checks connection and retries failed syncs
Manual Sync: Users can manually trigger sync attempts from the Sync screen
Status Tracking: Each record has an isSynced flag to track sync status
Process Flow:

User creates/edits data → Saved to local SQLite with isSynced = 0
App checks network every 30 seconds
If online, attempts to sync unsynced records
If server down, sync fails but local data remains intact
Next interval repeats the process
This architecture ensures the app works reliably regardless of server status, with data safely stored locally until the server becomes available again.