var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    router = express.Router(),
    app = express(),
    accessToken = process.env.ACCESS_TOKEN || "",
    apiKey = process.env.API_KEY || "",
    Entry = require('./db'),
    port = process.env.PORT || 9000;


    // CONFIG
     app.use(bodyParser.urlencoded({
       extended: true
     }));
     app.use(bodyParser.json());
     app.use(express.static('src'));

     app.all("/*", function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
        next();
    });
     app.use('/', router);
     // ROUTES
     router.post('/api/search', function(req, res) {
        var entry = new Entry(req.body);
        entry.save(function(err) {
            if (err) {
                return res.json(500, err);
            } else {
                res.json(entry);
            }
        });
    });

     router.post('/api/song',function(req,res){
        var query = req.body.rootUrl + accessToken + req.body.searchBy + req.body.lyrics + req.body.limit;
        request(query, function(err,response,body){
            res.send(body);
        });
     });

     router.post('/api/videos',function(req,res){
        var query = req.body.rootUrl + req.body.artist + req.body.title + req.body.keyPrefix + apiKey;
        request(query,function(err,response,body){
            res.send(body);
        });
     });
     // START SERVER
     app.listen(port, function(){
       console.log('Listening on port ' + port);
     });
