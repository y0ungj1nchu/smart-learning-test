const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
    "@components": path.resolve(__dirname, "src/components"),
    "@assets": path.resolve(__dirname, "src/assets"),
    "@styles": path.resolve(__dirname, "src/styles"),
    "@pages": path.resolve(__dirname, "src/pages")
  })
);
