// src/main.ts (or your app's primary entry file)
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from './firebase'; // Import the auth instance from your firebase.ts

// --- Authentication Logic ---

const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
export const handleSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    // You can update your UI here or store user info in a global state
  } catch (error: any) {
    console.error("Google Sign-in error:", error.code, error.message);
    // Handle specific errors like 'auth/popup-closed-by-user'
  }
};

// Function to handle Sign-Out
export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
    // Update your UI for a signed-out state
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

// Listen for authentication state changes
onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    // User is signed in
    console.log("Current user:", user.uid, user.displayName);
    // Update your UI to show user-specific content (e.g., hide login button, show user name)
    document.getElementById('auth-status')!.textContent = `Signed in as: ${user.displayName}`;
    document.getElementById('sign-in-btn')!.style.display = 'none';
    document.getElementById('sign-out-btn')!.style.display = 'block';
  } else {
    // User is signed out
    console.log("No user is signed in.");
    // Update your UI for a signed-out state
    document.getElementById('auth-status')!.textContent = 'Not signed in';
    document.getElementById('sign-in-btn')!.style.display = 'block';
    document.getElementById('sign-out-btn')!.style.display = 'none';
  }
});

// --- Example of how to connect to your HTML ---
document.addEventListener('DOMContentLoaded', () => {
  const signInButton = document.getElementById('sign-in-btn');
  if (signInButton) {
    signInButton.addEventListener('click', handleSignInWithGoogle);
  }

  const signOutButton = document.getElementById('sign-out-btn');
  if (signOutButton) {
    signOutButton.addEventListener('click', handleSignOut);
  }
});

// If you're using a framework like React/Vue, this file would
// typically mount your root component and provide auth context.
