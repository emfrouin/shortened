const mongoose = require("mongoose");
const {
    Schema
} = mongoose;
const analyticsSchema = new Schema({
    realUrl: String,
    ips: String,
    referer: String,
    userAgent: String,
    clickDate: {
        type: Date,
        default: Date.now
    }
});
mongoose.model("Analytics", analyticsSchema);