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

  var birthDate = query.birthDate || null;
  var firstName = query.firstName || null;
  var lastName = query.lastName || null;
  var id = query.id || null;
  var providerFirstName = query.providerFirstName || null;
  var providerLastName = query.providerLastName || null;
  var providerNPI = query.providerNPI || null;
  var serviceTypes = ['health_benefit_plan_coverage'];
  var tradingPartnerId = query.tradingPartnerId || null;

  pokitdok.enrollment({
    member: {
      birth_date: birthDate,
      first_name: firstName,
      last_name: lastName,
      id: id
    },
    provider: {
      first_name: providerFirstName,
      last_name: providerLastName,
      npi: providerNPI
    },
    service_types: serviceTypes,
    trading_partner_id: tradingPartnerId
  }, function(error, response) {
    if (error) {
      console.log(error.message); 
      return res.send("<h1>" + error.message + "</h1>"); 
    }
    res.send(response);
  });
});

app.get('/partners', function(req, res) {
  pokitdok.tradingPartners(function(error, response) {
    if (error) {
      console.log(error, response); 
      return res.send(error + ", " + response.code); 
    }

    res.send(response);
  });
});

var server = app.listen(process.env.PORT, function() {
  
});

