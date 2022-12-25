const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const port = 8000;
const fs = require("fs");
require("./connection/config");
const Model = require('./connection/product');
app.use(cors());
app.use(express.json());


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callBack) {
            callBack(null, "uploads");
        },
        filename: function (req, file, callBack) {
            callBack(null, file.fieldname + "-" + Date.now() + ".jpg");
        },
    }),
}).single("postImage");


app.post("/posts", upload, (req, res) => {
    const saveImage =  Model({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: new Date().toLocaleDateString(),
        likes: parseInt(Math.random() * 100),
        postImage: {
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/png",
        }
    });
    saveImage
      .save()
      .then((res) => {
        console.log("image is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
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
    console.log("server running successfully");
});