var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var request = require("request");
var app = express();

function callURL(url, callback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("req body ", body)  // not needed debug statement
            callback(null, JSON.parse(body));
        } else if (error) {
            console.log(error);
            msg = {"error": error, "url": url}
            callback(null, msg);
        } else {
            callback(null, response.statusCode);
        }
    })
}


app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post("/x", function (req, res){
    var start = new Date();
    // console.log(req.body);
    console.log(req.body.urls);
    var data = []
    async.mapLimit(req.body.urls, 10, callURL, function(err, body) {
        if (err) data.push(err);
        data.push(body)
        var end = new Date();
        data.push({"timings": {"total (ms)": end.getTime() - start.getTime()}})
        res.send(data);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});