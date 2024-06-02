const Identicon = require("identicon.js");
const crypto = require("crypto");

const generateIdenticon = (input, size = 64) => {
  const hash = crypto.createHash("md5").update(input).digest("hex");

  // Identiconの生成
  const data = new Identicon(hash, size).toString();

  return `data:image/png;base64,${data}`;
};

module.exports = generateIdenticon;
