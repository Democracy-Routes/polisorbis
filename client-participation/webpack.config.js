const path = require("path")
const webpack = require("webpack")
const CopyPlugin = require("copy-webpack-plugin")
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const EventHooksPlugin = require('event-hooks-webpack-plugin')
const LodashReplacementPlugin = require('lodash-webpack-plugin')
const lodashTemplate = require('lodash/template')
const glob = require('glob')
const fs = require('fs')
const pkg = require('./package.json')
const TerserPlugin = require("terser-webpack-plugin")

const embedServiceHostname = process.env.EMBED_SERVICE_HOSTNAME || 'demo.polisorbis.eu';
const fbAppId = process.env.FB_APP_ID;
const gaTrackingId = process.env.GA_TRACKING_ID;
const outputDirectory = 'dist';

const pHomeName = process.env.P_HOME_NAME || "Home";
const pLogoIcoUrl = process.env.P_LOGO_ICO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo-square.png";
const pLogoUrl = process.env.P_LOGO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo.png";
const pTitle = process.env.P_TITLE || "PolisOrbis";
const pClaim = process.env.P_CLAIM || "Input Crowd, Output Meaning";
const pDescription = process.env.P_DESCRIPTION || "PolisOrbis is a real-time system for gathering, analyzing and understanding what large groups of people think in their own words, enabled by advanced statistics and machine learning";
const pDocURL = process.env.P_DOC_URL || "https://doc.polisorbis.copernicani.it";
const pRepoURL = process.env.P_REPO_URL || "https://gitlab.com/copernicani/polisorbis/codebase";
// Blank means the built-in pages served by the admin client.
const pOrbisRating = process.env.P_ORBIS_RATING === 'true';
const pHomeUrl = process.env.P_HOME_URL || '/home';
const pTosURL = process.env.P_TOS_URL || "/tos";
const pPrivacyPolicyURL = process.env.P_PRIVACY_POLICY_URL || "/privacy";

const pOpenidEnabled = process.env.P_OPENID_ENABLED === 'true';
const pOpenidProviderName = process.env.P_OPENID_PROVIDER_NAME || "OpenID";

/**
 * Generates .headersJson files alongside files served by the file-server. Reading these files instructs file-server
 * what HTML headers should be added to each file.
 *
 * @deprecated
 */
function writeHeadersJsonForOutputFiles(isDev) {
  function writeHeadersJson(matchGlob, headersData = {}) {
    const files = glob.sync(path.resolve(__dirname, outputDirectory, matchGlob))
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
      ...(!isDev && { 'Content-Encoding': 'gzip' }),
      'Content-Type': 'application/javascript',
      'Cache-Control':
        'no-transform,public,max-age=31536000,s-maxage=31536000'
    }
    writeHeadersJson('js/*.js', headersData)
    writeHeadersJson('*.js', headersData)
  }

  function writeHeadersJsonCss() {
    const headersData = {
      'x-amz-acl': 'public-read',
      ...(!isDev && { 'Content-Encoding': 'gzip' }),
      'Content-Type': 'text/css',
      'Cache-Control':
        'no-transform,public,max-age=31536000,s-maxage=31536000'
    }
    writeHeadersJson('css/*.css', headersData)
  }

  function writeHeadersJsonMisc() {
    const headersData = {
      'Content-Type': 'image/vnd.microsoft.icon'
    }
    writeHeadersJson('favicon.ico', headersData)
  }

  writeHeadersJsonCss()
  writeHeadersJsonHtml()
  writeHeadersJsonJs()
  writeHeadersJsonMisc()
}

module.exports = (env, options) => {
  var isDevBuild = options.mode === 'development'
  var isDevServer = process.env.WEBPACK_SERVE
  return {
    entry: [
      './js/main',
      './css/polis_main.scss'
    ],
    output: {
      publicPath: '/',
      filename: `js/participation_bundle.[chunkhash:8].js`,
      path: path.resolve(__dirname, outputDirectory),
      clean: true
    },
    resolve: {
      extensions: ['.js', '.css', '.png', '.svg'],
      alias: {
        // The following modules need deep importing of JS files
        'handlebars': path.resolve(__dirname, 'node_modules/handlebars/dist/cjs/handlebars.runtime.js'),
        'handlebones': path.resolve(__dirname, 'node_modules/handlebones/handlebones'),
        'deepcopy': path.resolve(__dirname, 'node_modules/deepcopy/deepcopy.js')
      },
      fallback: {
        util: require.resolve('util/')
      }
    },
    plugins: [
      // Define some globals
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new webpack.DefinePlugin({
        'process.env.FB_APP_ID': JSON.stringify(fbAppId),
        'process.env.GA_TRACKING_ID': JSON.stringify(gaTrackingId),
        'process.env.P_HOME_NAME': JSON.stringify(pHomeName),
        'process.env.P_LOGO_ICO_URL': JSON.stringify(pLogoIcoUrl),
        'process.env.P_LOGO_URL': JSON.stringify(pLogoUrl),
        'process.env.P_TITLE': JSON.stringify(pTitle),
        'process.env.P_DESCRIPTION': JSON.stringify(pDescription),
        'process.env.P_CLAIM': JSON.stringify(pClaim),
        'process.env.P_DOC_URL': JSON.stringify(pDocURL),
        'process.env.P_REPO_URL': JSON.stringify(pRepoURL),
        'process.env.P_TOS_URL': JSON.stringify(pTosURL),
        'process.env.P_ORBIS_RATING': JSON.stringify(pOrbisRating),
        'process.env.P_HOME_URL': JSON.stringify(pHomeUrl),
        'process.env.P_PRIVACY_POLICY_URL': JSON.stringify(pPrivacyPolicyURL),
        'process.env.P_OPENID_ENABLED': JSON.stringify(pOpenidEnabled),
        'process.env.P_OPENID_PROVIDER_NAME': JSON.stringify(pOpenidProviderName)
      }),
      new CopyPlugin({
        patterns: [
          { from: 'public', globOptions: { ignore: ['**/index.ejs'] } },
          { from: 'api', globOptions: { ignore: ['**/embed.js'] } },
          {
            from: 'api/embed.js',
            transform(content, absoluteFrom) {
              return lodashTemplate(content.toString())({ embedServiceHostname })
            }
          },
          { from: 'node_modules/font-awesome/fonts/**/*', to: './fonts/[name][ext]' }
        ]
      }),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'public/index.ejs'),
        filename: 'index.html',
        templateParameters: {
          versionString: pkg.version,
          fbAppId: fbAppId,
          gaTrackingId: gaTrackingId
        }
      }),
      // Generate the .headersJson files ...
      new EventHooksPlugin({
        afterEmit: () => {
          console.log('Writing *.headersJson files...')
          writeHeadersJsonForOutputFiles(isDevBuild || isDevServer)
        }
      }),
      // Only compress files during production builds.
      ...((isDevBuild || isDevServer) ? [] : [
        new CompressionPlugin({
          test: /\.(js|css)$/,
          filename: '[path][base]',
          deleteOriginalAssets: true
        })
      ])
    ],
    // Only minify during production builds
    optimization: {
      minimize: !isDevBuild,
      minimizer: [new TerserPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.(handlebars|hbs)$/,
          exclude: /node_modules/,
          loader: 'handlebars-loader',
          options: {
            ignorePartials: true // We load partials at runtime so ignore at compile-time
          }
        },
        {
          test: /\.m?js$/,
          exclude: [
            /node_modules/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react']
            },
          },
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          exclude: /node_modules/,
          use: ['file-loader'],
        },
        {
          test: /\.mdx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', '@mdx-js/loader']
        },
        {
          test: /\.s[ac]ss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: { outputPath: 'css/', name: 'polis.css' }
            },
            'sass-loader'
          ]
        },
        // Shims for older modules
        {
          test: /d3-tip/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/react'
              ],
              sourceType: 'script' // set 'this' to 'window'
            },
          },
        },
        {
          test: /deepcopy/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/react'
              ],
              sourceType: 'script', // set 'this' to 'window'
            },
          },
        },
        {
          test: /bootstrap\/(transition|button|tooltip|affix|dropdown|collapse|popover|tab|alert)/,
          use: [
            {
              loader: 'imports-loader',
              options: {
                imports: [
                  // Expects jQuery to be present
                  'default jquery jQuery'
                ]
              }
            }
          ]
        },
        {
          test: /backbone\/backbone$/,
          use: [
            {
              loader: 'imports-loader',
              options: {
                imports: [
                  // Expects jQuery and lodash to be present
                  'default jquery $',
                  'default lodash _'
                ]
              }
            }
          ]
        },
        {
          test: /handlebones$/,
          use: [
            {
              loader: 'imports-loader',
              options: {
                imports: [
                  // Expects lodash, Backbone and handlebars to be present
                  'default handlebars Handlebars',
                  'default backbone Backbone',
                  'default lodash _'
                ]
              }
            }
          ]
        }
      ]
    }
  }
}
