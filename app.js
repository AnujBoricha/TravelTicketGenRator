const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/generate-ticket", async (req, res) => {
  try {
    const { experienceName, date, numberOfPersons, customerName } = req.body;

    const bookingId = generateBookingId();

    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext("2d");

    const template = await loadImage("./public/image.jpg");
    ctx.drawImage(template, 0, 0, 400, 200);

    ctx.font = "18px Arial";
    ctx.fillText(`Experience: ${experienceName}`, 20, 40);
    ctx.fillText(`Date: ${date}`, 20, 70);
    ctx.fillText(`Persons: ${numberOfPersons}`, 20, 100);
    ctx.fillText(`Customer: ${customerName}`, 20, 130);
    ctx.fillText(`Booking ID: ${bookingId}`, 20, 160);

    const imageName = `ticket_${bookingId}.png`;
    const out = fs.createWriteStream(imageName);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => {
      res.download(imageName, () => {
        fs.unlinkSync(imageName);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function generateBookingId() {
  return "ABC123";
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
