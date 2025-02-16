import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from 'firebase/app';

// Initialize Firebase Auth
const auth = getAuth();

// Define types for function parameters
export const signUp = async (email: string, password: string): Promise<void> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User account created & signed in!");
  } catch (error: unknown) {  // Explicitly type error as `unknown` first
    if (error instanceof Error) {  // Check if it's an instance of Error
      console.error(error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    let errorMessage = "Login failed. Please try again.";
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
      }
    }
    throw new Error(errorMessage); // Propagate to UI
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error: unknown) {  // Explicitly type error as `unknown` first
    if (error instanceof Error) {  // Check if it's an instance of Error
      console.error("Logout error:", error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      let errorMessage = "Failed to send reset email. Try again.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later.";
          break;
      }
      throw new Error(errorMessage); // Propagate to UI
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};