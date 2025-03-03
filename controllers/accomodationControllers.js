const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const addAccomodation = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name, location, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const fileName = `${id}/Accomodations/${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    const accomodation = await db.Accomodation.create({
      name: name,
      location: location,
      cost: cost,
      image: publicUrl,
      userID: id,
      start: startDate,
      end: endDate,
    });
    if (accomodation) {
      res.status(200).json("Successfully created accomodation");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getAccomodation = async (req, res) => {
  const filePath = "App/Accomodation/accomodation.jpg";
  const { accomodationID } = req.query;
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const accomodation = await db.Accomodation.findOne({
      where: { id: accomodationID },
    });
    if (accomodation && url) {
      res.json({ accomodation, url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const deleteAccomodation = async (req, res) => {
  const { accomodationID } = req.query;
  try {
    const accomodation = await db.Accomodation.findOne({
      where: { id: accomodationID },
    });
    if (!accomodation) {
      return res.status(404).json("Accomodation not found");
    }
    if (accomodation.image) {
      const filePath = accomodation.image.split("/").slice(4).join("/");
      await bucket.file(filePath).delete();
    }
    const response = await db.Accomodation.destroy({
      where: { id: accomodationID },
    });
    if (response) {
      res.status(200).json("Successfully deleted accomodation");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editAccomodation = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { accomodationID, name, location, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const record = await db.Accomodation.findOne({
      where: { id: accomodationID },
    });
    if (!record) {
      res.status(400).send("Not found!");
    } else {
      if (file) {
        if (record.image) {
          const filePath = record.image.split("/").slice(4).join("/");
          await bucket.file(filePath).delete();
        }
        const fileName = `${id}/Accomodations/${file.originalname}`;
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
          res.status(200).send(`Successfully updated accomodation`);
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
          res.status(200).send(`Successfully updated accomodation`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  addAccomodation,
  getAccomodation,
  deleteAccomodation,
  editAccomodation,
};
