const mongoose = require("mongoose");
const {
    Schema
} = mongoose;
const urlShortenSchema = new Schema({
    originalUrl: String,
    shortUrl: String,
    shortCode: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
mongoose.model("ShortUrl", urlShortenSchema);