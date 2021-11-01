const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');
const SRC = path.resolve(__dirname, './src/assets/audio');

module.exports = (env,options) => {
  const isDev = options.mode == 'development';
  return {
   output: {
      path: path.resolve(__dirname, "videovisit"),
      filename: "bundle.js?[contenthash]",
      publicPath: '/videovisit/'
    },
  devtool: isDev ? "#eval-source-map":false,
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
        test:/\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
       {
        test: /\.(png|svg|ico|jpg|jpeg|gif|webp)$/,
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
      },
      {
          test: /\.(mp3|ogg|wav)$/,
          include: SRC,
          loader: "file-loader"
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
}
};
