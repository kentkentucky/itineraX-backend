const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const getTypes = async (req, res) => {
  try {
    const types = await db.Type.findAll();
    if (types) {
      res.json(types);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const addTicket = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name, eventID, type, cost } = req.body;
  const file = req.file;
  try {
    const fileName = `${id}/${eventID}/${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    const result = await db.sequelize.transaction(async (t) => {
      const ticket = await db.Ticket.create(
        {
          name: name,
          typeID: type,
          cost: cost,
          image: publicUrl,
        },
        { transaction: t }
      );
      await db.UserEventTicket.create(
        {
          userID: id,
          eventID: eventID,
          ticketID: ticket.id,
        },
        { transaction: t }
      );
      return ticket;
    });
    if (result) {
      res.status(200).json("Successfully added ticket");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { getTypes, addTicket };
