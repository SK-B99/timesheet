const fs = require("fs");
const path = require("path");

function checkLicense(req, res, next) {
  const licenseKey = req.headers["x-license-key"];

  if (!licenseKey) {
    return res.status(401).json({
      error: "No license key provided",
    });
  }

  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/licenses.json"), "utf8"),
  );

  const license = data.licenses.find((l) => l.key === licenseKey);

  if (!license) {
    return res.status(403).json({
      error: "Invalid license key",
    });
  }

  if (!license.active) {
    return res.status(403).json({
      error: "License inactive. Contact your administrator.",
    });
  }

  // Attach user info to request
  req.user = license;
  next();
}

module.exports = checkLicense;
