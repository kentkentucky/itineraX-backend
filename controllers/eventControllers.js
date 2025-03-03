const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const addEvent = async (req, res) => {
  const { name, location, startDate, endDate, itineraryID } = req.body;
  try {
    const event = await db.Event.create({
      name: name,
      location: location,
      itineraryID: itineraryID,
      start: startDate,
      end: endDate,
    });
    if (event) {
      res.status(200).json("Successfully created event");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const deleteEvent = async (req, res) => {
  const { eventID } = req.query;
  try {
    const event = await db.Event.findOne({ where: { id: eventID } });
    if (!event) {
      return res.status(404).json("Event not found");
    }
    if (event.image) {
      const filePath = event.image.split("/").slice(4).join("/");
      await bucket.file(filePath).delete();
    }
    const response = await db.Event.destroy({ where: { id: eventID } });
    if (response) {
      res.status(200).json("Successfully deleted event");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editEvent = async (req, res) => {
  const { eventID, name, location, startDate, endDate } = req.body;
  console.log(eventID);
  try {
    const record = await db.Event.findOne({
      where: { id: eventID },
    });
    if (!record) {
      res.status(400).send("Not found!");
    } else {
      await record.update({
        name: name,
        location: location,
        start: startDate,
        end: endDate,
      });
      const response = await record.save();
      if (response) {
        res.status(200).send(`Successfully updated event`);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getEvent = async (req, res) => {
  const { eventID } = req.query;
  try {
    const event = await db.Event.findOne({ where: { id: eventID } });
    if (event) {
      res.json(event);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { addEvent, deleteEvent, editEvent, getEvent };
