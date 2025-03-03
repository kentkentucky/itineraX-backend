require("dotenv").config();
const db = require("../db/models/index");
const { bucket } = require("../config/firebase");
const { Sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT,
  }
);

const createItinerary = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name } = req.body;
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const itinerary = await db.Itinerary.create(
        {
          name: name,
          creatorID: id,
        },
        { transaction: t }
      );
      await db.UserItinerary.create(
        {
          userID: id,
          itineraryID: itinerary.id,
          isArchived: false,
        },
        { transaction: t }
      );
      return itinerary;
    });
    if (result) {
      res.status(200).json(result.id);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getItinerary = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const userID = auth0ID.split("|")[1];
  const filePath = "App/Itinerary/map.jpg";
  const { itineraryID } = req.query;
  const query = `
      SELECT  
    Itinerary.id AS ItineraryID, 
    Itinerary.name AS ItineraryName, 
    Events.id AS EventID, 
    Events.name AS EventName, 
    Events.start AS EventStart,
    Events.end AS EventEnd,
    Events.location AS EventLocation,
    COALESCE(Tickets.image, NULL) AS TicketImage,
    COALESCE(Tickets.cost, NULL) AS TicketCost,
    COALESCE(Tickets.typeID, NULL) AS TicketType,
    COALESCE(UserEventTicket.id, NULL) AS UserEventTicketID,
    COALESCE(UserEventTicket.userID, NULL) AS UserEventTicketUserID
FROM Itineraries AS Itinerary
LEFT JOIN Events ON Itinerary.id = Events.itineraryID
LEFT JOIN UserEventTickets AS UserEventTicket 
    ON Events.id = UserEventTicket.eventID 
    AND (UserEventTicket.userID = :userID OR UserEventTicket.userID IS NULL) 
LEFT JOIN Tickets ON UserEventTicket.ticketID = Tickets.id
WHERE Itinerary.id = :itineraryID
ORDER BY Events.start;
    `;
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const itineraryRaw = await sequelize.query(query, {
      replacements: { userID, itineraryID },
      type: QueryTypes.SELECT,
      raw: true,
    });
    const types = await db.Type.findAll();
    if (url && itineraryRaw) {
      const itinerary = {
        name: itineraryRaw[0].ItineraryName,
        url,
        events: itineraryRaw.map((row) => ({
          id: row.EventID,
          name: row.EventName,
          start: row.EventStart,
          end: row.EventEnd,
          location: row.EventLocation,
          ticketImage: row.TicketImage,
          ticketCost: row.TicketCost,
          ticketType: row.TicketType,
          userEventTicketID: row.UserEventTicketID,
          userEventTicketUserID: row.UserEventTicketUserID,
        })),
        types,
      };
      res.json(itinerary);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const inviteUser = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { receiverID, itineraryID } = req.body;
  try {
    const user = await db.User.findOne({ where: { id: receiverID } });
    if (!user) {
      res.status(400).json("User does not exist");
    } else {
      const invite = await db.Invitation.create({
        senderID: id,
        receiverID: receiverID,
        itineraryID: itineraryID,
        status: "Pending",
      });
      if (invite) {
        res.status(200).json("Successfully sent invitation");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editInvitation = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { inviteID, status } = req.body;
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const record = await db.Invitation.findOne(
        { where: { id: inviteID } },
        { transaction: t }
      );
      if (!record) {
        res.status(400).json("Invitation does not exist");
      } else {
        await record.update({
          status: status,
        });
        const update = await record.save({ transaction: t });
        if (update.status == "Accepted") {
          await db.UserItinerary.create(
            {
              userID: id,
              itineraryID: update.itineraryID,
            },
            { transaction: t }
          );
        }
      }
      return record;
    });
    if (result) {
      res.status(200).json("Successfully updated status");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const archiveItinerary = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { itineraryID } = req.body;
  try {
    const record = await db.UserItinerary.findOne({
      where: { userID: id, itineraryID: itineraryID },
    });
    if (!record) {
      res.status(400).json("User does not have itinerary");
    } else {
      await record.update({
        isArchived: true,
      });
      const response = await record.save();
      if (response) {
        res.status(200).json("Successfully archived itinerary");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getArchives = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  try {
    const archives = await db.UserItinerary.findAll({
      where: { userID: id, isArchived: true },
      include: [
        {
          model: db.Itinerary,
        },
      ],
    });
    if (archives) {
      res.json(archives);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  createItinerary,
  getItinerary,
  inviteUser,
  editInvitation,
  archiveItinerary,
  getArchives,
};
