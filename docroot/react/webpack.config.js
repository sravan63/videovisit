const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');
module.exports = {
   output: {
      path: path.resolve(__dirname, "videovisit"),
      filename: "bundle.js",
      publicPath: '/videovisit/'
    },
  devtool: "#eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
                test:/\.css$/,
                use:['style-loader','css-loader']
      },
       {
        test: /\.(png|svg|ico|jpg|gif)$/,
        use: [
           'file-loader'
        ]
       },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
   devServer: {
    contentBase: path.join(__dirname, '/videovisit/'),
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      favicon: './src/assets/favicon.ico'
    })
  ]
};
