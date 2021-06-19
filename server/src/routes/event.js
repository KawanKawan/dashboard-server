/**
 * Express Router for event
 * Mounted on /event
 * @author zikang
 * @module Event routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../firestore/fs");

async function getEvent(id) {
  var event = [];
  await fs
    .collection("event")
    .where("id", "==", id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        event.push(doc.data());
      });
    })
    .catch((error) => {
      logger.log("Error getting documents: ", error);
    });

  return event;
}

async function deleteEvent(id) {
  //delete event of this id
  await fs.collection("event").doc(id).delete();

  //delete all related payment information
  await fs
    .collection("payment")
    .where("eventid", "==", id)
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

  return "User event successfully deleted!";
}

/**
 * Get a event info
 * @name GET /event/:eventID
 * @returns Sucess indicator
 */
router.get("/:eventID", async (req, res) => {
  try {
    const { eventID } = req.params;

    res
      .status(200)
      .json({ success: true, user: eventID, event: await getEvent(eventID) });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * add a event
 * @name POST /event/add
 * @param {String} userID
 * @param {Data} startdate start date of the event
 * @param {String} title event title
 * @returns {object} success indicator
 */
router.post("/add", express.json(), async (req, res) => {
  try {
    const { eventid, startdate, title, userid } = req.body;
    const date = new Date(startdate);
    res.status(200).json({
      success: true,
      event: await fs
        .collection("event")
        .doc(eventid)
        .set({ eventid, date, title, userid }),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update a user's event
 * @name POST /event/update
 * @param {String} userID
 * @param {Data} startdate start date of the event
 * @param {String} title event title
 * @returns {object} success indicator
 */
router.post("/update", express.json(), async (req, res) => {
  try {
    const { eventid, startdate, title } = req.body;
    const date = new Date(startdate);
    res.status(200).json({
      success: true,
      payment: await fs.collection("event").doc(eventid).update({
        date,
        title,
      }),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete a user's event
 * @name GET /event/delete/:eventid
 * @param {String} eventid eventid
 * @returns {object} success indicator
 */
router.get("/delete/:eventid", async (req, res) => {
  try {
    const { eventid } = req.params;
    res.status(200).json({
      success: true,
      payment: await deleteEvent(eventid),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
