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

const getHome = async (req, res) => {
  const filePath = "App/Home/world.jpg";
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const user = await db.User.findOne({
      where: { id: id },
      include: [
        {
          model: db.Itinerary,
          through: { where: { isArchived: false } },
        },
        {
          model: db.Flight,
        },
        {
          model: db.Accomodation,
        },
        {
          model: db.Rental,
        },
        {
          model: db.Insurance,
        },
      ],
    });
    const invite = await db.Invitation.findAll({
      where: { receiverID: id, status: "Pending" },
      include: [
        {
          model: db.Itinerary,
        },
        {
          model: db.User,
          as: "sender",
        },
      ],
    });
    let flightDetails = [];
    if (user.Flights.length > 0) {
      flightDetails = await Promise.all(
        user.Flights.map(async (flight) => {
          const flightNumber = flight.number;
          const detail = await getFlightByNumber(flightNumber);
          if (detail.length > 0) {
            return {
              flightID: flight.id,
              flightNumber: flightNumber,
              departure: detail[0].departure,
            };
          }
        })
      );
    }
    const itineraries = user.Itineraries.map((itinerary) => ({
      ...itinerary.toJSON(),
      isCreator: itinerary.creatorID === id,
    }));
    res.json({
      username: user.username,
      itineraries,
      flights: flightDetails,
      accomodations: user.Accomodations,
      rentals: user.Rentals,
      insurances: user.Insurances,
      url,
      invite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { getHome };
