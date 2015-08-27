var express = require('express');
var app = express();
var PokitDok = require('pokitdok-nodejs');
var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

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

var server = app.listen(3001, function() {
  
});

