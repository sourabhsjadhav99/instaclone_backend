let dotenv=require('dotenv').config()
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const port = process.env.PORT;
const fs = require("fs");
require("./connection/config");
const Model = require('./connection/product');
app.use(cors());
app.use(express.json());
app.use("/", express.static("uploads"));

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
      callback(null, `imgae-${Date.now()}.${file.originalname}`)
    }
  })
  
  
  // img filter
  const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
      callback(null, true)
    } else {
      callback(new Error("only images is allowd"))
    }
  }
  
  const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
  });

app.post("/posts", upload.single("photo"), (req, res) => {
    const { filename } = req.file;
    const saveImage =  Model({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: new Date().toLocaleDateString(),
        likes: parseInt(Math.random() * 100),
        photo: filename
    });
    saveImage
      .save()
      res.send("data uploaded succefully")
  });


app.get("/posts", async (req, res) => {
    try {
        const users = await Model.find();
        res.status(200).json({
            status: "Sucess",
            data: users,
        });
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message,
        });
    }
});


app.listen(port, () => {
    console.log(`server listning at ${port}` );
});