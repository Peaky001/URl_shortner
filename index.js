const express = require("express");
const urlRoute = require("./routes/url");
const path = require("path");
const cookieparser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { connect } = require("mongoose");
const { timeStamp } = require("console");
const URL = require("./models/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const {restrictToLoggedinUserOnly, checkAuth} = require("./middleware/auth");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.set("view engine","ejs");  
app.set("views", path.resolve("./views"));  

const PORT = 8001;

connectToMongoDB("mongodb+srv://shrey:2002@atlascluster.nwlhxan.mongodb.net/urlshortner").then(() => console.log("connect to mongoDB"));
app.use('/url',restrictToLoggedinUserOnly,urlRoute); 
app.use('/',checkAuth,staticRouter);
app.use('/user',userRoute);


app.get('/shortId',async (req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push:{
        visithistory:{
            timestamp:Date.now(),
        },
    },
}
);
res.redirect(entry.redirectURL);
});
app.listen(PORT,() => console.log(`srever started at ${PORT}`));