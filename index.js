#!/usr/bin/env node

var program = require('commander'),
    util = require('util'),
    chalk = require('chalk'),
    fs = require('fs');

var filetypes = ['png', 'jpg', 'jpeg', 'gif'];

(function init() {
  program
    .version('0.0.1')
    .usage('<filenames> | [options]')
    .option('-a, --all', 'Covert all images in current directory');

  program.on('--help', function () {
    util.log('  File types:');
    util.log('  png | jpg | jpeg | gif\n');
    util.log('  Examples:');
    util.log('  $ img2data img1.png img2.gif img3.png img4.jpeg > target.css');
    util.log('  $ img2data -a > target.css\n');
  });

  program.parse(process.argv);
  if (program.all) {
    convertAll()
  } else if (!program.args.length) {
    program.help();
  } else {
    convertOpt(program.args);
  }
})();

function convertOpt (files) {
  var files, file, meta, result, imgData;

  result = '';

  for (var i = 0, length = files.length; i < length; i++) {
    var file = files[i],
        meta = analyseFile(file);

    if (!meta) {
      util.log(chalk.red('[ERR] ') + util.format('File `%s` is not a image file >_<.', file));
      process.exit(0);
    }

    if (!checkType(meta.type)) {
      util.log(chalk.red('[ERR] ') + util.format('File type of `%s` must be png | jpg | jpeg | gif >_<.', file));
      process.exit(0);
    }

    imgData = img2data(file);
    if (!imgData) {
      process.exit(0);
    }

    css = util.format('.%s {\n  background: url(data:image/%s;base64,%s);\n}\n\n', meta.name, meta.type, imgData);
    result += css;
  }
  util.print(result);
}

function convertAll () {
  var files, file, result, imgData;

  result = '';
  files = fs.readdirSync('./');

  for (var i = 0, length = files.length; i < length; i++) {
    var file = analyseFile(files[i]);

    if (!file) continue;

    if (!checkType(meta.type)) continue;

    imgData = img2data(file.source);
    if (!imgData) {
      process.exit(0);
    }

    css = util.format('.%s {\n background: url(data:image/%s;base64,%s);\n}\n\n', meta.name, meta.type, imgData);
    result += css;
  }
  util.print(result);
}

function analyseFile (file) {
  var data = file.split('.');
  if (data.length <= 1) {
    return false;
  }

  return {
    type: data[data.length - 1].toLowerCase(),
    name: data.slice(0, data.length - 1).join('_').replace(/@/g, '_')
  };
}

function checkType (filetype) {
  if (filetypes.indexOf(filetype) === -1) {
    return false;
  }
  return true;
}

function img2data(file) {
  try {
    var bitmap = fs.readFileSync(file);
  } catch (e) {
    if (e.code === 'ENOENT') {
      util.log(chalk.red('[ERR] ') + util.format('File `%s` is not found >_<.', file));
    } else {
      util.log(chalk.red('[ERR] '));
      throw e;
    }
    return false;
  }
  var string = new Buffer(bitmap).toString('base64');
  return string;
}
