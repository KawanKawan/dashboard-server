/**
 * Module wrapper around firebase-admin to initialize it based on the platform we run it on.
 * @author JJ
 * @module Firebase Admin initialized app singleton
 */

const admin = require("firebase-admin");
const getCredentials = require("./getCredentials");

function initializeApp(options = {}) {
  try {
    return admin.initializeApp({
      ...options,
      credential: getCredentials(),
    });
  } catch (error) {
    console.error(error);

    // @todo Might potentially cut off un-finished stdout/stderr processes
    process.exit(1);
  }
}

module.exports = initializeApp();
module.exports.initializeApp = initializeApp;
