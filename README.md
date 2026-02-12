# Nexus College Portal

A production-ready College Management Web Application built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Authentication**: Secure Email/Password login with Email Verification.
- **Role-Based Access**: 
  - **Students**: Upload and view certificates.
  - **Staff**: View student lists by batch and verify certificates.
- **UI/UX**: Modern dark theme with glassmorphism, 3D hover animations, and responsive design.
- **Security**: Protected routes and Firebase Security Rules.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Firebase Authentication, Firestore, Storage

## Setup Instructions

### 1. Firebase Configuration

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and select **Email/Password** provider.
3. Create a **Firestore Database**.
4. Create a **Storage Bucket**.
5. Copy your Firebase config keys.

### 2. Environment Variables

Create a `.env` file in the root directory and add your Firebase keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## Security Rules

### Firestore Rules (`firestore.rules`)

Copy these rules to your Firestore Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles
    match /users/{userId} {
      allow read: if request.auth != null; // Authenticated users can read profiles
      allow write: if request.auth != null && request.auth.uid == userId; // Users can only create/edit their own profile
    }

    // Files Metadata
    match /files/{fileId} {
      allow read: if request.auth != null;
      // Students can only create entries for themselves
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      // Users can delete their own files
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}
```

### Storage Rules (`storage.rules`)

Copy these rules to your Firebase Storage Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Students can read/write their own certificates
    match /students/{userId}/certificates/{fileName} {
      allow read: if request.auth != null; // Staff needs to read too
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment on Vercel

1. Push code to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel project settings.
4. Deploy.

## Notes

- **Initial Staff Account**: Since registration defaults to 'Student' or 'Staff' (user selected), in a real app you might want to restrict Staff registration or require an admin approval. For this demo, anyone can register as Staff.
- **Email Verification**: Ensure you verify your email after registration (check console/fake inbox if using emulators, or real inbox). The app blocks login until verified.
