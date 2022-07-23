require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const request = require("request");

const app = express();
const https = require("https");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const apiKey = process.env.API_KEY;
    const list_id = process.env.LIST_ID;

    var data_main = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data_main);
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + list_id;
    const options = {
        method: "POST",
        auth: "AgriX:" + apiKey
    };
    const request_server = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });

    });

    request_server.write(jsonData);
    request_server.end();


});

app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running.");
});