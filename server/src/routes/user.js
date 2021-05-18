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

  if (!doc.exists) logger.warn("No such document");
  else {
    logger.info("user data:" + doc.data().name);
    return doc.data();
  }
}

async function updateUserProfile(id, name, phone, payment) {
  const docRef = fs.collection("users").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    logger.warn("No such document");
    return "No such document";
  } else {
    docRef
      .update({
        name,
        phone,
        payment,
      })
      .then(() => {
        logger.info("Document successfully updated!");
      });
    return "User profile successfully updated!";
  }
}

/**
 * Get a user's profile
 * @name GET /user/:userID
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

/**
 * Edit a user's profile
 * @name POST /user/update
 * @param {String} userID
 * @param {String} name user's name
 * @param {number} phone user's phone number
 * @param {String} payment_method user's preferred payment method
 * @returns {object} success indicator
 */
router.post("/update", express.json(), async (req, res) => {
  try {
    const { userID, name, phone, payment } = req.body;
    res.status(200).json({
      success: true,
      user: await updateUserProfile(userID, name, phone, payment),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
