var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var request = require("request");
var app = express();

function callURL(url, callback) {

    opt = {
        method: url["method"],
        uri: url["url"],
    }

    if (url["method"] === "POST") {
        opt.json = true; // basically sets up stringify and other headers
        opt.body = url["post"];
    }

    // console.log("opt", opt)

    request(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("req body ", body)  // not needed debug statement
            try {
                rtn_body = body;
                callback(null, body);
            } catch(e) {
                callback(null, {"error": "unable to parse body", "opt": opt, "e": e, "body": body});
            }  
        } else if (error) {
            console.log("error with request", error, "for", opt);
            msg = {"error": error, "url": url}
            callback(null, msg);
        } else {
            callback(null, {"error": "bad status code", "code": response.statusCode, "opt": opt});
        }
    })
}

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json({limit: '100mb', extended: true})); // for parsing application/json

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post("/x", function (req, res){
    var start = new Date();
    // console.log(req.body);
    // console.log(JSON.stringify(req.body));
    // console.log(req.body.urls);
    urls = req.body.urls
    var data = []
    async.mapLimit(urls, 10, callURL, function(err, body) {
        // console.log("got to after...")
        if (err) data.push(err);
        data.push(body)
        var end = new Date();
        data.push({"timings": {"total (ms)": end.getTime() - start.getTime()}})
        // console.log(data);
        res.send(data);
    });
});

app.listen(3000, function () {
    _json_log = {"level": "INFO", "msg": "Requester app listening on port 3000!"}
    console.log(JSON.stringify(_json_log));
});