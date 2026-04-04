const path = require("path");
const { override } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

const overrideProcessEnv = (value) => (config) => {
  config.resolve.modules = [path.join(__dirname, "src")].concat(
    config.resolve.modules
  );

  return config;
};

module.exports = {
  paths: function (paths) {
    if (process.env.BUILD_PATH) {
      paths.appBuild = path.resolve(process.env.BUILD_PATH);
    }
    return paths;
  },
  webpack: override(
  addLessLoader({
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
        options: {
          javascriptEnabled: true,
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  }),
  overrideProcessEnv({
    VERSION: JSON.stringify(require("./package.json").version),
  })
),
};
