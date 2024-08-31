const Identicon = require("identicon.js");
const CryptoJS = require("crypto-js");

const generateIdenticon = (input, size = 64) => {
  const hash = CryptoJS.MD5(input).toString();
  const data = new Identicon(hash, size).toString();
  return `data:image/png;base64,${data}`;
};

module.exports = generateIdenticon;
