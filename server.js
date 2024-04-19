const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));

app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${month}/${day}/${year}`;
//console.log(currentDate); // "17-6-2022"

mongoose
    .connect("mongodb+srv://password1234:password1234@cluster0.6oyjrry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch((error) => console.log("Couldn't connect to mongodb", error));

const trainSchema = new mongoose.Schema({
    user_name: String,
    user_email: String,
    train_name: String,
    company: String,
    build_date: String,
    upload_date: String,
    notes: String,
    service_locations: [String],
    img: String,
});

const Train = mongoose.model("Train", trainSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/trains", (req, res) => {
    getTrains(res);
});

const getTrains = async (res) => {
    const trains = await Train.find();
    res.send(trains);
};

app.get("/api/trains/:id", (req, res) => {
    getTrain(req.params.id, res);
});

const getTrain = async (id, res) => {
    const train = await Train.findOne({ _id: id });
    res.send(train);
};


app.post("/api/trains", upload.single("img"), (req, res) => {
    const result = validateTrain(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //***** update new train schema */
    const train = new Train({
        //_id: req.body._id,
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        train_name: req.body.train_name,
        company: req.body.company,
        build_date: req.body.build_date,
        upload_date: currentDate,
        notes: req.body.notes,
        service_locations: req.body.service_locations.split(","),
    });
    console.log(req.file.filename);
    if (req.file) {
        train.img = req.file.filename;
    }
    createTrain(train, res);
});

const createTrain = async (train, res) => {
    const result = await train.save();
    res.send(train);
};

app.put("/api/trains/:id", upload.single("img"), (req, res) => {
    const result = validateTrain(req.body);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateTrain(req, res);
});

const updateTrain = async (req, res) => {
    let fieldsToUpdate = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        train_name: req.body.train_name,
        company: req.body.company,
        build_date: req.body.build_date,
        upload_date: currentDate,
        notes: req.body.notes,
        service_locations: req.body.service_locations.split(","),
    };

    if (req.file) {
        fieldsToUpdate.img = req.file.filename;
    }

    const result = await Train.updateOne({ _id: req.params.id }, fieldsToUpdate);

    res.send(result);
};

app.delete("/api/trains/:id", (req, res) => {
    removeTrain(res, req.params.id);
});

const removeTrain = async (res, id) => {
    const train = await Train.findByIdAndDelete(id);
    res.send(train);
};

const validateTrain = (train) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        user_name: Joi.string().min(3).required(),
        user_email: Joi.string().min(3).required(),
        train_name: Joi.allow(),
        company: Joi.string().min(3).required(),
        build_date: Joi.allow(""),
        upload_date: Joi.allow(""),
        notes: Joi.string().min(3).required(),
        service_locations: Joi.allow(""),
    });
    console.log(schema.validate(train));
    return schema.validate(train);
}

app.listen(3000, () => {
    console.log("I'm listening");
});