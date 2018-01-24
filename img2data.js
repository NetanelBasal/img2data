#!/usr/bin/env node

var program = require('commander'),
    util = require('util'),
    chalk = require('chalk'),
    fs = require('fs');
var imgformatsStr = 'png | jpg | jpeg | gif | svg',
    imgformatsArr = imgformatsStr.split(' | ');
(function init() {
    program.version('0.0.1').usage('<filenames> | [options]')
        .option('-a, --all', 'Covert all images in current directory');
    program.on('--help', function() {
        console.log('  Supported Image Formats:');
        console.log(util.format('  %s \n', imgformatsStr));
        console.log(chalk.blue('  Usage Examples:'));
        console.log('  $ img2data img1.png img2.jpg img3.jpeg img4.gif img5.svg > output.css');
        console.log('  $ img2data -a > output.css\n');
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
// data2img *.png *.svg ...
function convertOpt(imgs) {
    var imgs, img, meta, result, imgData, css;
    result = '';
    for (var i = 0, length = imgs.length; i < length; i++) {
        var img = imgs[i],
            meta = analyse(img);
        if (!meta) {
            errlog('not_img', img);
            process.exit(0);
        }
        if (!checkFormat(meta.format)) {
            errlog('format', img);
            process.exit(0);
        }
        imgData = img2data(img);
        if (!imgData) {
            process.exit(0);
        }
        css = getCSS(meta, imgData);
        result += css;
    }
    util.print(result);
}
// data2img -a
function convertAll() {
    var imgs, img, result, imgData, css;
    result = '';
    imgs = fs.readdirSync('./');
    for (var i = 0, length = imgs.length; i < length; i++) {
        var img = imgs[i],
            meta = analyse(img);
        if (!img) continue;
        if (!checkFormat(meta.format)) continue;
        imgData = img2data(img);
        if (!imgData) {
            process.exit(0);
        }
        css = getCSS(meta, imgData);
        result += css;
    }
    util.print(result);
}
/*
  return file meta data
  {format: 'png|jpg|jpeg|svg+xml',
  name: ''}
*/
function analyse(img) {
    var data = img.split('.');
    if (data.length <= 1) {
        return false;
    }
    return {
        format: data[data.length - 1].toLowerCase(),
        name: data.slice(0, data.length - 1).join('_').replace(/@/g, '_')
    };
}
// return .class { background-image: url()}
function getCSS(meta, imgData) {
    var imgformat = meta.format === 'svg' ? meta.format + '+xml' : meta.format;
    return util.format('.%s {\n    background-repeat: no-repeat; background-image: url("data:image/%s;base64,%s");\n}\n\n', meta.name.toLowerCase(), imgformat, imgData);
}

function checkFormat(format) {
    if (imgformatsArr.indexOf(format) === -1) {
        return false;
    }
    return true;
}
// img 2 data uri
function img2data(img) {
    try {
        var bitmap = fs.readFileSync(img);
    } catch (e) {
        if (e.code === 'ENOENT') {
            errlog('not_found', img);
        } else {
            errlog('err', img);
            throw e;
        }
        return false;
    }
    var string = new Buffer(bitmap).toString('base64');
    return string;
}
// Error log
function errlog(type, img) {
    switch (type) {
        case 'not_img':
            util.log(chalk.red('[ERR] ') + util.format('`%s` is not a image file >_<.', img));
            break;
        case 'format':
            util.log(chalk.red('[ERR] ') + util.format('Format of `%s` must be %s >_<.', img, imgformatsStr));
            break;
        case 'not_found':
            util.log(chalk.red('[ERR] ') + util.format('`%s` is not found >_<.', img));
            break;
        case 'err':
            util.log(chalk.red('[ERR] ') + util.format('Error happens while handling `%s` >_<.', img));
            break;
    }
}
