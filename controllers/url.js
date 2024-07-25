const shortid = require("shortid");
const URL = require ("../models/url");

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });

    const shortID = shortid.generate();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visithistory: [],
        createdBy: req.user._id,
    });

    return res.render("home", { id: shortID });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visithistory.length,
        analytics: result.visithistory,
    });
}

module.exports = { handlegenerateNewShortURL, handleGetAnalytics };
