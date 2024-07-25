const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const { handlegenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");

router.get('/', async (req, res) => {
    if (!req.user) return res.redirect("/login");
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", { urls: allurls });
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

router.get("/url", (req, res) => {
    return res.render("home");
});

// New route to handle the redirection
router.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const urlEntry = await URL.findOne({ shortId });
    if (urlEntry) {
        // Increment visit history
        urlEntry.visithistory.push({ timestamp: new Date() });
        await urlEntry.save();
        return res.redirect(urlEntry.redirectURL);
    } else {
        return res.status(404).json({ error: "URL not found" });
    }
});

module.exports = router;
