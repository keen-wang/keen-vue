const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    video_effect: "./demo/index.ts"
  },
  output: {
    filename: "[name].js", 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./demo/index.html",
      filename: "index.html",
      chunks: ["video_effect"]
    })
  ],
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, 'demo/'),
    },
    // host: internalIp.v4.sync(),
    https: true,
    open: true,
    port: 7474
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader", "source-map-loader"],
        exclude: /node_modules/
      }
      // {
      //   test: /\.(glsl|vs|fs)$/,
      //   loader: "ts-shader-loader"
      // }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};
