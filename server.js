require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Station = require("./models/Station");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.post("/api/stations", async (req, res) => {
  try {
    const newStation = new Station(req.body);
    await newStation.save();
    res.status(201).json({ success: true, data: newStation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json({ success: true, count: stations.length, data: stations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/stations/:id", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station)
      return res.status(404).json({ success: false, error: "Не знайдено" });
    res.json({ success: true, data: station });
  } catch (err) {
    res.status(400).json({ success: false, error: "Некоректний ID" });
  }
});

app.put("/api/stations/:id", async (req, res) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedStation)
      return res.status(404).json({ success: false, error: "Не знайдено" });
    res.json({ success: true, data: updatedStation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete("/api/stations/:id", async (req, res) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation)
      return res.status(404).json({ success: false, error: "Не знайдено" });
    res.json({ success: true, message: "Успішно видалено" });
  } catch (err) {
    res.status(400).json({ success: false, error: "Некоректний ID" });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Успішно підключено до MongoDB Atlas!");
    app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
  })
  .catch((err) => console.error("Помилка підключення:", err));
