var express = require('express');
var router = express.Router();
var execFile = require('child_process').execFile;

// print a PDF-file
router.post('/', function(req, res, next) {
  var x = req.body.filedata;

  if (!('file' in req.files)) {
    res.status(400).send('Missing data');
    return;
  }

  checkQueue();

  function checkQueue() {
    execFile('lpstat', ['-l'], function (error, stdout, stderr) {
      if (stdout.indexOf('Waiting for printer to become available') !== -1) {
        res.status(503).json({
          status: 'Printer offline',
          code: 1,
          stderr: 'OFFLINE'
        });
        return;
      }

      printFile();
    });
  }

  function printFile() {
    execFile('lp', ['-d', 'SEWOO_LKT_Series', req.files['file'].path], function (error, stdout, stderr) {
      if (error !== null) {
        res.status(500).json({
          status: 'Print command failed',
          code: error.code,
          stderr: stderr
        });
        return;
      }

      res.json({
        status: 'Print OK',
        stdout: stdout
      });
    });
  }
});

module.exports = router;
