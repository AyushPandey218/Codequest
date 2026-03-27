/**
 * Maps Firebase Auth error codes to professional, user-friendly messages.
 * @param {string} code - The Firebase error code (e.g., 'auth/invalid-credential')
 * @returns {string} - A professional error message
 */
export const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address provided is improperly formatted.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';
    case 'auth/user-not-found':
      return 'We could not find an account with this email address.';
    case 'auth/wrong-password':
      return 'The password you entered is incorrect. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/operation-not-allowed':
      return 'This authentication method is currently disabled.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please use a stronger combination of characters.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access has been temporarily restricted for security.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in window was closed before completion.';
    case 'auth/internal-error':
      return 'An unexpected internal error occurred. Please try again later.';
    default:
      return 'An unexpected error occurred during authentication. Please try again.';
  }
};
