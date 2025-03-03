require("dotenv").config();
const axios = require("axios");
const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const getFlightByNumber = async (flightNumber) => {
  try {
    const response = await axios.get(
      `https://api.magicapi.dev/api/v1/aedbx/aerodatabox/flights/Number/${flightNumber}?dateLocalRole=Both&withAircraftImage=false&withLocation=false`,
      {
        headers: {
          "x-magicapi-key": process.env.MARKET_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addFlight = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name, number, cost } = req.body;
  const file = req.file;
  try {
    const fileName = `${id}/Flights/${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    const flight = await db.Flight.create({
      name: name,
      number: number,
      cost: cost,
      image: publicUrl,
      userID: id,
    });
    if (flight) {
      res.status(200).json("Successfully created flight");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getFlight = async (req, res) => {
  const filePath = "App/Flight/flight.jpg";
  const { flightID } = req.query;
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const flight = await db.Flight.findOne({ where: { id: flightID } });
    if (flight && url) {
      const detail = await getFlightByNumber(flight.number);
      res.json({
        details: detail[0],
        flight,
        url,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const deleteFlight = async (req, res) => {
  const { flightID } = req.query;
  try {
    const flight = await db.Flight.findOne({ where: { id: flightID } });
    if (!flight) {
      return res.status(404).json("Flight not found");
    }
    if (flight.image) {
      const filePath = flight.image.split("/").slice(4).join("/");
      await bucket.file(filePath).delete();
    }
    const response = await db.Flight.destroy({ where: { id: flightID } });
    if (response) {
      res.status(200).json("Successfully deleted flight");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { addFlight, getFlight, deleteFlight };
