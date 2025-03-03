const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const addRental = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name, location, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const fileName = `${id}/Rentals/${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    const rental = await db.Rental.create({
      name: name,
      location: location,
      cost: cost,
      image: publicUrl,
      userID: id,
      start: startDate,
      end: endDate,
    });
    if (rental) {
      res.status(200).json("Successfully created rental");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getRental = async (req, res) => {
  const filePath = "App/Rental/rental.jpg";
  const { rentalID } = req.query;
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const rental = await db.Rental.findOne({
      where: { id: rentalID },
    });
    if (rental && url) {
      res.json({ rental, url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const deleteRental = async (req, res) => {
  const { rentalID } = req.query;
  try {
    const rental = await db.Rental.findOne({
      where: { id: rentalID },
    });
    if (!rental) {
      return res.status(404).json("Rental not found");
    }
    if (rental.image) {
      const filePath = rental.image.split("/").slice(4).join("/");
      await bucket.file(filePath).delete();
    }
    const response = await db.Rental.destroy({
      where: { id: rentalID },
    });
    if (response) {
      res.status(200).json("Successfully deleted rental");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editRental = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { rentalID, name, location, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const record = await db.Rental.findOne({
      where: { id: rentalID },
    });
    if (!record) {
      res.status(400).send("Not found!");
    } else {
      if (file) {
        if (record.image) {
          const filePath = record.image.split("/").slice(4).join("/");
          await bucket.file(filePath).delete();
        }
        const fileName = `${id}/Rentals/${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        await record.update({
          name: name,
          location: location,
          image: publicUrl,
          start: startDate,
          end: endDate,
          cost: cost,
        });
        const response = await record.save();
        if (response) {
          res.status(200).send(`Successfully updated rental`);
        }
      } else {
        await record.update({
          name: name,
          location: location,
          start: startDate,
          end: endDate,
          cost: cost,
        });
        const response = await record.save();
        if (response) {
          res.status(200).send(`Successfully updated rental`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { addRental, getRental, deleteRental, editRental };
