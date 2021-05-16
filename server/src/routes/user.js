/**
 * Express Router for user profile
 * Mounted on /report
 * @author zikang
 * @module Report routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../firestore/fs");

async function getUserProfile(id) {
  const docRef = fs.collection("users").doc(id);

  const doc = await docRef.get();

  // Check if this number has been reported before
  // If doc no exists means first time being reported, so create the doc plus a reported value of 1
  if (!doc.exists) logger.warn("No such document");
  else {
    logger.info("user data:" + doc.data().Name);
    return doc.data();
  }
}

/**
 * Get a user's profile
 * @name GET /user
 * @returns Sucess indicator
 */
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    res.status(200).json({ success: true, user: await getUserProfile(userID) });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
