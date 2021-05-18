/**
 * Express Router for payment information
 * Mounted on /report
 * @author zikang
 * @module Report routes
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
        console.log(doc.id, " => ", doc.data().id);

        payements.push(doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return payements;
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
 * Edit a user's payment information
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
// router.post("/update", express.json(), async (req, res) => {
//   try {
//     const { userID, request_from,amount,completed,eventid, payload} = req.body;
//     console.log(">>");
//     res.status(200).json({
//       success: true,
//       user: await updateUserProfile(userID,request_from,amount,completed,eventid,payload),
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;
