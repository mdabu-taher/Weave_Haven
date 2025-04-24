// backend/src/utils/email.js

/**
 * Temporary stub for password‑reset emails.
 * Logs the reset link instead of sending a real email.
 *
 * @param {string} to    – recipient email address
 * @param {string} token – reset token to embed in the URL
 */
export async function sendResetEmail(to, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log(`Password reset link for ${to}: ${resetUrl}`);
  }
  