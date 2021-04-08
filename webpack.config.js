const path = require('path');

module.exports = {
    entry: {
        audiolingual_main:'/jsx/audiolingual_main.jsx',
        postList:'/jsx/postList.jsx'
      },
      output: {
        path: path.resolve(__dirname, './js'),
        filename: '[name].js'
      },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', '@babel/preset-react'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  }
}

// module.exports = {     entry:'./jsx/postList.jsx',     output: {
// path: path.resolve(__dirname, 'js'),         filename: 'postList.js'     },
//   mode: "development",     module:{         rules:[             {
//     test:/\.jsx?$/,                 exclude: /node_modules/,
// use:{                     loader: 'babel-loader',
// options:{                         presets: ['@babel/preset-env',
// '@babel/preset-react'],                         plugins:
// ['@babel/plugin-proposal-class-properties']                     }
//     }             }         ]     }   }