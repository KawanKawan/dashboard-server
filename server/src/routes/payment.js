/**
 * Express Router for payment information
 * Mounted on /payment
 * @author zikang
 * @module Payment routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../firestore/fs");

async function getPayment(id) {
  var payements = [];
  await fs
    .collection("payment")
    .where("id", "==", id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        payements.push(doc.data());
      });
    })
    .catch((error) => {
      logger.log("Error getting documents: ", error);
    });

  return payements;
}

async function updatePayment(id, request_from, amount, completed, eventid) {
  await fs
    .collection("payment")
    .where("id", "==", id)
    .where("request_from", "==", request_from)
    .where("eventid", "==", eventid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const paymentRef = fs.collection("payment").doc(doc.id);

        // user not supposed update userid, eventid and payload
        paymentRef.update({
          request_from,
          amount,
          completed,
        });
      });
    })
    .catch((error) => {
      logger.log("Error getting documents: ", error);
    });

  return "User payment successfully updated!";
}

async function updateUserPaymentByPayload(
  request_from,
  amount,
  completed,
  payload
) {
  const paymentRef = fs.collection("payment").doc(payload);

  paymentRef.update({
    request_from,
    amount,
    completed,
  });
}

async function deletePayment(id, request_from, eventid) {
  await fs
    .collection("payment")
    .where("id", "==", id)
    .where("request_from", "==", request_from)
    .where("eventid", "==", eventid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const paymentRef = fs.collection("payment").doc(doc.id);
        paymentRef.delete();
      });
    })
    .catch((error) => {
      logger.log("Error getting documents: ", error);
    });

  return "User payment successfully deleted!";
}

/**
 * Get a user's all payment
 * @name GET /user/:userID
 * @returns Sucess indicator
 */
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    res
      .status(200)
      .json({ success: true, user: userID, payment: await getPayment(userID) });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * add a user's payment information
 * @name POST /payment/add
 * @param {String} userID
 * @param {String} request_from userID of the person who owe current money
 * @param {number} amount payment amount
 * @param {boolean} completed the status of payment
 * @param {String} eventid the event ID related to the payment
 * @param {String} payload unique token of the payment
 * @TODO payload and key can be same?
 * @returns {object} success indicator
 */
router.post("/add", express.json(), async (req, res) => {
  try {
    const { id, request_from, amount, completed, eventid, payload } = req.body;
    res.status(200).json({
      success: true,
      payment: await fs
        .collection("payment")
        .doc(payload)
        .set({ id, request_from, amount, completed, eventid, payload }),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update a user's payment information
 * @name POST /payment/update
 * @param {String} userID
 * @param {String} request_from userID of the person who owe current money
 * @param {number} amount payment amount
 * @param {boolean} completed the status of payment
 * @param {String} eventid the event ID related to the payment
 * @param {String} payload unique token of the payment
 * @TODO payload and key can be same?
 * @returns {object} success indicator
 */
router.post("/update", express.json(), async (req, res) => {
  try {
    const { id, request_from, amount, completed, eventid } = req.body;
    res.status(200).json({
      success: true,
      payment: await updatePayment(
        id,
        request_from,
        amount,
        completed,
        eventid
      ),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update a user's payment information by payload
 * @name POST /payment/update
 * @param {String} payload unique token of the payment
 * @returns {object} success indicator
 */
router.post("/update/:payload", express.json(), async (req, res) => {
  try {
    const { request_from, amount, completed } = req.body;
    const { payload } = req.params;
    res.status(200).json({
      success: true,
      payment: await updateUserPaymentByPayload(
        request_from,
        amount,
        completed,
        payload
      ),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete a user's payment information by userid, request_from and event_id
 * @name POST /payment/delete
 * @param {String} userID
 * @param {String} request_from userID of the person who owe current money
 * @param {String} eventid the event ID related to the payment
 * @returns {object} success indicator
 */
router.post("/delete", express.json(), async (req, res) => {
  try {
    const { id, request_from, eventid } = req.body;
    res.status(200).json({
      success: true,
      payment: await deletePayment(id, request_from, eventid),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete a user's payment information paylaod
 * @name GET /payment/delete/:payload
 * @param {String} payload unique token of the payment
 * @returns {object} success indicator
 */
router.get("/delete/:payload", async (req, res) => {
  try {
    const { payload } = req.params;
    res.status(200).json({
      success: true,
      payment: await fs.collection("payment").doc(payload).delete(),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
