data2img
=====

A Node.js command line utility to convert images to data URIs.

[https://www.npmjs.com/package/img2data](https://www.npmjs.com/package/img2data)

Supported image formats: png | gif | jpg | jpeg | svg

## Installation
```bash
npm install img2data -g
```

## Usage
```bash
$ img2data img1.png img2.jpg img3.jpeg img4.gif img5.svg > output.css
$ img2data -a > output.css
```

## Output Example:
```css
.img1 {
  background-image: url("data:image/png;base64,......");
}
.img2 {
  background-image: url("data:image/jpg;base64,......");
}
.img3 {
  background-image: url("data:image/jpeg;base64,......");
}
.img4 {
  background-image: url("data:image/gif;base64,......");
}
.img5 {
  background-image: url("data:image/svg+xml;base64,......");
}
```
