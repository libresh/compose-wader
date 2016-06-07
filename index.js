var app = require('express')();
var archiver = require('archiver');
var config = require('./config.json');
var fs = require('fs');
var request = require('request');
var p = require('path');

var domain = function(res, hash) {
  if (config[hash]) {
    return config[hash];
  } else {
    res.status(404).end();
  }
}

var archive = function(res, domain) {
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
  if (req.params.type === 'download') {
    archive(res, domain(res, req.params.hash));
  } else if (req.params.type === 'migrate') {
    request('http://172.17.0.1:8080/' + req.params.hash, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        archive(res, domain(res, req.params.hash));
      } else {
        res.status(500).send({ error: 'Migration failed.' });
      }
    })
  }
});

app.listen(3000);
