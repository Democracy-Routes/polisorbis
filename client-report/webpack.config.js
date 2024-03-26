// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

const common = require('./webpack.common');
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const writeHeadersJsonTask = require('./writeHeadersJsonTask');

const pLogoIcoUrl = process.env.P_LOGO_ICO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo-square.png";
const pLogoUrl = process.env.P_LOGO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo.png";
const pTitle = process.env.P_TITLE || "PolisOrbis";
const pClaim = process.env.P_CLAIM || "Input Crowd, Output Meaning";
const pDescription = process.env.P_DESCRIPTION || "PolisOrbis is a real-time system for gathering, analyzing and understanding what large groups of people think in their own words, enabled by advanced statistics and machine learning";
const pDocURL = process.env.P_DOC_URL || "https://doc.polisorbis.copernicani.it";
const pRepoURL = process.env.P_REPO_URL || "https://gitlab.com/copernicani/polisorbis/codebase";
const pTosURL = process.env.P_TOS_URL || "http://deeznuts";
const pPrivacyPolicyURL = process.env.P_PRIVACY_POLICY_URL;

module.exports = {
    ...common,
    mode: 'production',
    output: {
        filename: 'report_bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    plugins: [
        ...common.plugins,
        new CompressionPlugin({
            // It appears that nothing is currently using these gzipped files.
            // So we're just going to generate it with the .gz extension and not
            // delete the original.
            // TODO: Decide if we want to use these gzipped files.
            test: /\.js$/,
            // filename: '[path][base]',
            // deleteOriginalAssets: true,
        }),
        new EventHooksPlugin({
            afterEmit: () => writeHeadersJsonTask(),
        }),
        new MiniCssExtractPlugin({
            filename: 'report_style.[contenthash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.SERVICE_URL': null,
            'process.env.P_LOGO_ICO_URL': JSON.stringify(pLogoIcoUrl),
            'process.env.P_LOGO_URL': JSON.stringify(pLogoUrl),
            'process.env.P_TITLE': JSON.stringify(pTitle),
            'process.env.P_DESCRIPTION': JSON.stringify(pDescription),
            'process.env.P_CLAIM': JSON.stringify(pClaim),
            'process.env.P_DOC_URL': JSON.stringify(pDocURL),
            'process.env.P_REPO_URL': JSON.stringify(pRepoURL),
            'process.env.P_TOS_URL': JSON.stringify(pTosURL),
            'process.env.P_PRIVACY_POLICY_URL': JSON.stringify(pPrivacyPolicyURL)
        })
    ],
    performance: {
        // TODO: Find and remove orphan modules; Reduce bundle size.
        hints: 'warning', // 'error' for errors, 'warning' for warnings, false to disable
        maxAssetSize: 505000, // Size limit in bytes, default is 250000 (250 KB)
        maxEntrypointSize: 500000, // Size limit in bytes, default is 250000 (250 KB)
    },
};
