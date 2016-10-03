var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var request = require("request");
var app = express();

function callURL(url, callback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("req body ", body) // Show the HTML for the Google homepage.
            callback(null, JSON.parse(body));
        } else {
            callback(error || response.statusCode);
        }
    })
}


app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post("/x", function (req, res){
    // console.log(req.body);
    console.log(req.body.urls);
    var data = []
    async.mapLimit(req.body.urls, 10, callURL, function(err, body) {
        if(err) {
            console.log("err", err);
            throw err;
        } else {
            console.log("body", body);
            data.push(body)
            res.send(data);
        }
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});