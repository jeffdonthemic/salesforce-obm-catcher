var should = require("should");
var superagent = require('superagent');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

describe('Process OBM from Salesforce', function(){

  it('should return a success acknoledgement when all goes well', function(done){

    fs.readFile('./test/sample.xml', 'utf8', function (err, xml) {
      superagent.post('http://localhost:3000/obm')
      .send(JSON.parse(xml))
      .end(function(e, res){
        res.text.should.equal('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>');
        done();
      });
    });

  });

  it('should gracefully fail if cannot parse xml', function(done){

    superagent.post('http://localhost:3000/obm')
    .send('BAD-XML')
    .end(function(e, res){
      res.text.should.equal('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>false</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>');
      done();
    });

  });

});
