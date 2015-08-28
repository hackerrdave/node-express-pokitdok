var express = require('express');
var app = express();
var url = require('url');
var PokitDok = require('pokitdok-nodejs');
var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);
var pry = require('pryjs');

var basicAuth = require('basic-auth-connect');
var username = process.env.USERNAME || "";
var password = process.env.PASSWORD || "";
app.use(basicAuth(username, password));

app.get('/providers', function(req, res) {
  
  pokitdok.providers({
    zipcode: 10009,
    radius: '10mi',
    limit: 5
  }, function(error, response) {
    if (error) { return res.send(JSON.stringify(error)); }
    res.send(response);
  });

});

app.get('/enrollment', function(req, res) {
  var query = url.parse(req.url, true).query;
  res.send(query);
});

app.get('/partners', function(req, res) {
  pokitdok.tradingPartners(function(error, response) {
    if (error) { return res.send(error + ", " + response.code); }

    res.send(response);
  });
});

var server = app.listen(process.env.PORT, function() {
  
});

