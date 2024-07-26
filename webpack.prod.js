const path = require("path");
const { merge } = require("webpack-merge");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const ImageminWebpackPlugin = require("imagemin-webpack-plugin").default;
const common = require("./webpack.common");

async function getImageminMozjpeg() {
  const ImageminMozjpeg = await import("imagemin-mozjpeg");
  return ImageminMozjpeg.default;
}

module.exports = async () => {
  const ImageminMozjpeg = await getImageminMozjpeg();

  return merge(common, {
    mode: "production",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, "src/scripts/libs/sw.js"),
        swDest: "./sw.bundle.js",
      }),
      new ImageminWebpackPlugin({
        plugins: [
          ImageminMozjpeg({
            quality: 50,
            progressive: true,
          }),
        ],
      }),
    ],
  });
};
