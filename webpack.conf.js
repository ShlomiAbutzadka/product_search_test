const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sass|less|css)$/,
        loaders: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "@common": path.resolve(__dirname, "./src/common"),
    },
    extensions: [".ts", ".js"],
  },
};
