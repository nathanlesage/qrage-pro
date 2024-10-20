const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')

module.exports = {
  entry: './src/index.ts',
  mode: 'development', // "development" or "production"
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/] // Enable ts support in Vue SFCs
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // Apply webpack rules to the corresponding language blocks in .vue files
    new VueLoaderPlugin(),,
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // New in Vue 3.4
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  }
}
