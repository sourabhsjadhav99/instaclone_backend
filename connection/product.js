const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, require:true },
    likes: { type: Number },
    date: { type: Date }
});

module.exports = mongoose.model("users", productSchema);