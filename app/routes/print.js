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

  // print the file
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
});

module.exports = router;
