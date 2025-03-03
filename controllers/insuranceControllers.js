const db = require("../db/models/index");
const { bucket } = require("../config/firebase");

const addInsurance = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { name, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const fileName = `${id}/Insurances/${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    const insurance = await db.Insurance.create({
      name: name,
      cost: cost,
      image: publicUrl,
      userID: id,
      start: startDate,
      end: endDate,
    });
    if (insurance) {
      res.status(200).json("Successfully created insurance");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const getInsurance = async (req, res) => {
  const filePath = "App/Insurance/document.jpg";
  const { insuranceID } = req.query;
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    const insurance = await db.Insurance.findOne({
      where: { id: insuranceID },
    });
    if (insurance && url) {
      res.json({ insurance, url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const deleteInsurance = async (req, res) => {
  const { insuranceID } = req.query;
  try {
    const insurance = await db.Insurance.findOne({
      where: { id: insuranceID },
    });
    if (!insurance) {
      return res.status(404).json("Rental not found");
    }
    if (insurance.image) {
      const filePath = insurance.image.split("/").slice(4).join("/");
      await bucket.file(filePath).delete();
    }
    const response = await db.Insurance.destroy({
      where: { id: insuranceID },
    });
    if (response) {
      res.status(200).json("Successfully deleted rental");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editInsurance = async (req, res) => {
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  const { insuranceID, name, startDate, endDate, cost } = req.body;
  const file = req.file;
  try {
    const record = await db.Insurance.findOne({
      where: { id: insuranceID },
    });
    if (!record) {
      res.status(400).send("Not found!");
    } else {
      if (file) {
        if (record.image) {
          const filePath = record.image.split("/").slice(4).join("/");
          await bucket.file(filePath).delete();
        }
        const fileName = `${id}/Insurances/${file.originalname}`;
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
          image: publicUrl,
          start: startDate,
          end: endDate,
          cost: cost,
        });
        const response = await record.save();
        if (response) {
          res.status(200).send(`Successfully updated insurance`);
        }
      } else {
        await record.update({
          name: name,
          start: startDate,
          end: endDate,
          cost: cost,
        });
        const response = await record.save();
        if (response) {
          res.status(200).send(`Successfully updated insurance`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { addInsurance, getInsurance, deleteInsurance, editInsurance };
