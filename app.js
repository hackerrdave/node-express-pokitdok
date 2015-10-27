var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var url = require('url');

var basicAuth = require('basic-auth-connect');
var username = process.env.USERNAME || "";
var password = process.env.PASSWORD || "";
app.locals.pretty = true;
app.use(basicAuth(username, password));
app.set('views', './views');
app.set('view engine', 'jade');
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use("/styles", express.static(__dirname + "/styles"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

function flattenParams(params) {
  for(var key in params) {
    if(!params[key]) {
        delete params[key];
    } else if (typeof params[key] === "object") {
      var innerParams = params[key];
      for (var innerKey in innerParams) {
        if (!innerParams[innerKey]) {
          delete innerParams[innerKey];
        }
      }
    }
  }
  return params;
}

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  var data = req.body;

  process.env.POKITDOK_CLIENT_ID = data.pokitdok_client_id;
  process.env.POKITDOK_CLIENT_SECRET = data.pokitdok_client_secret;

  res.render('index-success');
});

app.get('/plans', function(req, res) {
  res.render('plans');
});

app.post('/plans', function(req, res) {
  var data = req.body;
  var PokitDok = require('pokitdok-nodejs');
  var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

  var planParams = {
    trading_partner_id:   data.trading_partner_id,
    county:               data.county,
    state:                data.state,
    plan_id:              data.plan_id,
    plan_type:            data.plan_type,
    plan_name:            data.plan_name,
    metallic_level:       data.metallic_level
  };

  var params = flattenParams(planParams);

  pokitdok.plans(params, function(error, response){
    if (error) { return res.send(error); }
    res.send(response);
  });
});

app.get('/providers', function(req, res) {
  res.render('providers');
});

app.post('/providers', function(req, res) {
  var data = req.body;
  var PokitDok = require('pokitdok-nodejs');
  var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

  var providerParams = {
    limit:              Number(data.limit) || 5,
    city:               data.city,
    first_name:         data.first_name,
    last_name:          data.last_name,
    organization_name:  data.organization_name,
    radius:             data.radius || '20mi',
    specialty:          data.specialty,
    state:              data.state,
    zipcode:            Number(data.zipcode),
    sort:               data.sort
  };

  var params = flattenParams(providerParams);

  pokitdok.providers(params, function(error, response) {
    if (error) { return res.send(error); }
    res.send(response);
  });
});

app.get('/eligibility', function(req, res) {
  res.render('eligibility');
});

app.post('/eligibility', function(req, res) {
  var data = req.body;
  var PokitDok = require('pokitdok-nodejs');
  var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

  var eligibilityParams = {
    member: {
      birth_date: data.member_birth_date,
      first_name: data.member_first_name,
      last_name:  data.member_last_name,
      id:         data.member_id
    },
    cpt_code:     data.cpt_code,
    provider: {
      first_name: data.provider_first_name,
      last_name:  data.provider_last_name,
      npi:        data.provider_npi,
      organization_name: data.organization_name
    },
    service_types: [data.service_type],
    trading_partner_id: data.trading_partner_id
  };

  var params = flattenParams(eligibilityParams);

  pokitdok.eligibility(params, function(error, response){
    if (error) { return res.send(error); }
    res.send(response); 
  });
});


app.get('/partners', function(req, res) {
  res.render('partners');
});

app.post('/partners', function(req, res) {
  var data = req.body;
  var PokitDok = require('pokitdok-nodejs');
  var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

  var partnerParams = {
    id:   data.partner_id
  };

  var params = flattenParams(partnerParams);


  pokitdok.tradingPartners(params, function(error, response) {
    if (error) { return res.send(error); }
    res.send(response);
  });
});

app.get('/claim-status', function(req, res) {
  res.render('claim-status');
});

app.post('/claim-status', function(req, res) {
  var data = req.body;
  var PokitDok = require('pokitdok-nodejs');
  var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

  var claimStatusParams = {
    patient: {
      birth_date: data.patient_birth_date,
      first_name: data.patient_first_name,
      last_name:  data.patient_last_name,
      id:         data.patient_id
    },
    provider: {
      first_name: data.provider_first_name,
      last_name:  data.provider_last_name,
      npi:        data.provider_npi,
      organization_name: data.provider_organization_name
    },
    service_date: data.service_date,
    service_end_date: data.service_date_end,
    trading_partner_id: data.trading_partner_id
  };

  var params = flattenParams(claimStatusParams);

  pokitdok.claimStatus(params, function(error, response) {
    if (error) { return res.send(error); }
    res.send(response);
  });
});

var server = app.listen(process.env.PORT, function() {
  
});

