const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/user");
const Place = require("./models/places");
const Booking = require("./models/Booking");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { AuthError } = require("./errors"); // Add this custom error handler
const { log } = require("console");

const bcryptSalt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET; // Using environment variable for secret
console.log(secret);


app.set("trust proxy", 1);

app.use(express.json());
app.use(CookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "https://book-it-tau.vercel.app",
  })
);

// Rate limiter middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log("Mongoose Error", err));

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, secret, {}, async (err, userData) => {
      if (err) reject(new AuthError("Invalid or expired token"));
      resolve(userData);
    });
  });
}

// Routes

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (e) {
      next(e);
    }
  }
);

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return next(new AuthError("User not found"));
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return next(new AuthError("Invalid password"));
    }

    jwt.sign(
      {
        email: userDoc.email,
        id: userDoc._id,
      },
      secret,
      {},
      (err, token) => {
        if (err) {
          return next(err);
        }

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .json(userDoc);
      }
    );
  } catch (err) {
    next(err);
  }
});

app.get("/profile", async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const userData = await getUserDataFromReq(req);
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    } catch (err) {
      next(err);
    }
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res
    .cookie(
      "token",
      {},
      { httpOnly: true, secure: process.env.NODE_ENV === "production" }
    )
    .json(true);
});

app.post("/upload-by-link", async (req, res, next) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ message: "No link provided" });
  }

  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    next(error);
  }
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  async (req, res, next) => {
    const uploadedFiles = [];
    try {
      for (let i = 0; i < req.files.length; i++) {
        const { path: tempPath, originalname } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newFilename = `photo-${Date.now()}-${i}.${ext}`;
        const outputPath = `uploads/${newFilename}`;

        await sharp(tempPath)
          .resize(800, 800, { fit: "inside" })
          .toFormat("jpeg", { quality: 80 })
          .toFile(outputPath);

        fs.unlinkSync(tempPath);

        uploadedFiles.push(newFilename);
      }
      res.json(uploadedFiles);
    } catch (err) {
      next(err);
    }
  }
);

app.post("/places", async (req, res, next) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.status(201).json(place);
  } catch (err) {
    next(err);
  }
});

app.get("/user-places", async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Token is missing. Please log in." });
  }

  try {
    const userData = await getUserDataFromReq(req);
    const userPlaces = await Place.find({ owner: userData.id });
    res.json(userPlaces);
  } catch (err) {
    next(err);
  }
});

app.get("/places/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    next(err);
  }
});

app.put("/places", async (req, res, next) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    } else {
      res.status(403).json({ error: "You do not own this place" });
    }
  } catch (err) {
    next(err);
  }
});

app.get("/places", async (req, res, next) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    next(err);
  }
});

app.post("/bookings", async (req, res, next) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuest, name, phone, price } =
      req.body;
    const booking = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuest,
      name,
      phone,
      price,
      user: userData.id,
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

app.get("/bookings", async (req, res, next) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate(
      "place"
    );
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  res
    .status(500)
    .json({ error: "Something went wrong, please try again later" });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
