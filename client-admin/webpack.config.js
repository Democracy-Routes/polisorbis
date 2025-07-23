// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var path = require("path");
var webpack = require("webpack");
var CompressionPlugin = require('compression-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var EventHooksPlugin = require('event-hooks-webpack-plugin');
var CopyPlugin = require("copy-webpack-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var mri = require('mri');
var glob = require('glob');
var fs = require('fs');

// CLI commands for deploying built artefact.
var argv = process.argv.slice(2)
var cliArgs = mri(argv)

var enableTwitterWidgets = process.env.ENABLE_TWITTER_WIDGETS === 'true';
var fbAppId = process.env.FB_APP_ID;

var pHomeName = process.env.P_HOME_NAME || "Home";
var pLogoIcoUrl = process.env.P_LOGO_ICO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo-square.png";
var pLogoUrl = process.env.P_LOGO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo.png";
var pTitle = process.env.P_TITLE || "PolisOrbis";
var pClaim = process.env.P_CLAIM || "Input Crowd, Output Meaning";
var pDescription = process.env.P_DESCRIPTION || "PolisOrbis is a real-time system for gathering, analyzing and understanding what large groups of people think in their own words, enabled by advanced statistics and machine learning";
var pDocURL = process.env.P_DOC_URL || "https://doc.polisorbis.copernicani.it";
var pRepoURL = process.env.P_REPO_URL || "https://gitlab.com/copernicani/polisorbis/codebase";
var pTosURL = process.env.P_TOS_URL;
var pPrivacyPolicyURL = process.env.P_PRIVACY_POLICY_URL;

var pOpenidEnabled = process.env.P_OPENID_ENABLED === 'true';
var pOpenidProviderName = process.env.P_OPENID_PROVIDER_NAME || "OpenID";
var pOpenidProfilePageURL = process.env.P_OPENID_PROFILE_PAGE_URL;

module.exports = (env, options) => {
  var isDevBuild = options.mode === 'development';
  var isDevServer = process.env.WEBPACK_SERVE;
  var chunkHashFragment = (isDevBuild || isDevServer) ? '' : '.[chunkhash:8]';
  return {
    entry: ["./src/index"],
    output: {
      publicPath: '/',
      filename: `static/js/admin_bundle${chunkHashFragment}.js`,
      path: path.resolve(__dirname, "build"),
      clean: true,
    },
    resolve: {
      extensions: [".js", ".css", ".png", ".svg"],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify')
      }
    },
    devServer: {
      historyApiFallback: true,
      /**
      // TODO: Set up API proxy later for server component.
      // See: https://webpack.js.org/configuration/dev-server/#devserverproxy
      proxy: {
        '/api': {
        target: 'https://pol.is',
        secure: false,
        },
      },
      **/
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new CopyPlugin({
        patterns: [
          { from: 'public', globOptions: { ignore: ['**/index.ejs']}},
        ],
      }),
      new HtmlWebPackPlugin({
        template: path.resolve( __dirname, 'public/index.ejs' ),
        filename: (isDevBuild || isDevServer) ? 'index.html' : 'index_admin.html',
        inject: "body",
        templateParameters: {
          enableTwitterWidgets: enableTwitterWidgets,
          fbAppId: fbAppId
        },
      }),
      new LodashModuleReplacementPlugin({
        currying: true,
        flattening: true,
        paths: true,
        placeholders: true,
        shorthands: true
      }),
      new webpack.DefinePlugin({
        'process.env.FB_APP_ID': JSON.stringify(fbAppId),
        'process.env.P_HOME_NAME': JSON.stringify(pHomeName),
        'process.env.P_LOGO_ICO_URL': JSON.stringify(pLogoIcoUrl),
        'process.env.P_LOGO_URL': JSON.stringify(pLogoUrl),
        'process.env.P_TITLE': JSON.stringify(pTitle),
        'process.env.P_DESCRIPTION': JSON.stringify(pDescription),
        'process.env.P_CLAIM': JSON.stringify(pClaim),
        'process.env.P_DOC_URL': JSON.stringify(pDocURL),
        'process.env.P_REPO_URL': JSON.stringify(pRepoURL),
        'process.env.P_TOS_URL': JSON.stringify(pTosURL),
        'process.env.P_PRIVACY_POLICY_URL': JSON.stringify(pPrivacyPolicyURL),
        'process.env.P_OPENID_ENABLED': JSON.stringify(pOpenidEnabled),
        'process.env.P_OPENID_PROVIDER_NAME': JSON.stringify(pOpenidProviderName),
        'process.env.P_OPENID_PROFILE_PAGE_URL': JSON.stringify(pOpenidProfilePageURL)
      }),
      // Only run analyzer when specified in flag.
      ...(cliArgs.analyze ? [new BundleAnalyzerPlugin({ defaultSizes: 'gzip' })] : []),
      // Only compress and create headerJson files during production builds.
      ...((isDevBuild || isDevServer || cliArgs.analyze) ? [] : [
        new CompressionPlugin({
          test: /\.js$/,
          // Leave unmodified without gz ext.
          // See: https://webpack.js.org/plugins/compression-webpack-plugin/#options
          filename: '[path][base]',
          deleteOriginalAssets: true,
        }),
        new EventHooksPlugin({
          afterEmit: () => {
            console.log('Writing *.headersJson files...')

            function writeHeadersJson(matchGlob, headersData = {}) {
              const files = glob.sync(path.resolve(__dirname, "build", matchGlob))
              files.forEach((f, i) => {
                const headersFilePath = f + '.headersJson'
                fs.writeFileSync(headersFilePath, JSON.stringify(headersData))
              })
            }

            function writeHeadersJsonHtml() {
              const headersData = {
                'x-amz-acl': 'public-read',
                'Content-Type': 'text/html; charset=UTF-8',
                'Cache-Control': 'no-cache'
              }
              writeHeadersJson('*.html', headersData)
            }

            function writeHeadersJsonJs() {
              const headersData = {
                'x-amz-acl': 'public-read',
                'Content-Encoding': 'gzip',
                'Content-Type': 'application/javascript',
                'Cache-Control':
                  'no-transform,public,max-age=31536000,s-maxage=31536000'
              }
              writeHeadersJson('static/js/*.js?(.map)', headersData)
            }

            function writeHeadersJsonMisc() {
              writeHeadersJson('favicon.ico')
            }

            writeHeadersJsonHtml()
            writeHeadersJsonJs()
            writeHeadersJsonMisc()
          }
        }),
      ])
    ],
    optimization: {
      minimize: !isDevBuild,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
        },
        {
          test: /\.mdx?$/,
          use: ['babel-loader', '@mdx-js/loader']
        }
      ],
    },
  };
}
