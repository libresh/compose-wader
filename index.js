var app = require('express')();
var archiver = require('archiver');
var config = require('./config.json');
var fs = require('fs');
var request = require('request');
var p = require('path');

var getDomain = function(res, hash) {
  if (config[hash]) {
    return config[hash];
  } else {
    res.status(404).end();
  }
}

var archiveIt = function(res, domain) {
  var archive = archiver('zip');

  archive.on('error', function(err) {
    console.log('error in archive:\n\n' + err);
    res.status(500).send({error: err.message});
  });

  //set the archive name
  res.attachment('IndieHosted.zip');

  //this is the streaming magic
  archive.pipe(res);
  archive.directory("/data/domains/" + domain, domain);
  archive.finalize();
}

app.get('/:type(download|migrate)/:hash', function(req, res) {
  var domain = getDomain(res, req.params.hash);
  if (req.params.type === 'download') {
    archiveIt(res, domain);
  } else if (req.params.type === 'migrate') {
    request('http://172.17.42.1:8080/' + req.params.hash, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        archiveIt(res, domain);
      } else {
        res.status(500).send({ error: 'Migration failed.' });
      }
    })
  }
});

app.get('/status', function(req, res) {
  res.status(200).send({ status: 'running' });
});

app.listen(3000);
