const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;

const userRouter = require("./routes/userRoutes");
const homeRouter = require("./routes/homeRoutes");
const itineraryRouter = require("./routes/itineraryRoutes");
const flightRouter = require("./routes/flightRoutes");
const accomodationRouter = require("./routes/accomodationRoutes");
const rentalRouter = require("./routes/rentalRoutes");
const insuranceRouter = require("./routes/insuranceRoutes");
const eventRouter = require("./routes/eventRoutes");
const ticketRouter = require("./routes/ticketRoutes");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/home", homeRouter);
app.use("/itinerary", itineraryRouter);
app.use("/flight", flightRouter);
app.use("/accomodation", accomodationRouter);
app.use("/rental", rentalRouter);
app.use("/insurance", insuranceRouter);
app.use("/event", eventRouter);
app.use("/ticket", ticketRouter);

app.listen(port, () => {
  console.log(`ItineraX app listening on port ${port}`);
});
