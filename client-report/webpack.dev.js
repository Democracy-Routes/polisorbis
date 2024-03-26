// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

const common = require('./webpack.common');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const serviceUrl = process.env.SERVICE_URL || 'http://localhost:5000';

const pLogoIcoUrl = process.env.P_LOGO_ICO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo-square.png";
const pLogoUrl = process.env.P_LOGO_URL || "https://doc.polisorbis.copernicani.it/images/polisorbis-logo.png";
const pTitle = process.env.P_TITLE || "PolisOrbis";
const pClaim = process.env.P_CLAIM || "Input Crowd, Output Meaning";
const pDescription = process.env.P_DESCRIPTION || "PolisOrbis is a real-time system for gathering, analyzing and understanding what large groups of people think in their own words, enabled by advanced statistics and machine learning";
const pDocURL = process.env.P_DOC_URL || "https://doc.polisorbis.copernicani.it";
const pRepoURL = process.env.P_REPO_URL || "https://gitlab.com/copernicani/polisorbis/codebase";
const pTosURL = process.env.P_TOS_URL;
const pPrivacyPolicyURL = process.env.P_PRIVACY_POLICY_URL;

module.exports = {
    ...common,
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'report_bundle.js',
        path: path.resolve(__dirname, 'devel'),
        publicPath: '/',
    },
    plugins: [
        ...common.plugins,
        new MiniCssExtractPlugin({
            filename: 'report_style.css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.SERVICE_URL': JSON.stringify(process.env.SERVICE_URL),
            'process.env.P_LOGO_ICO_URL': JSON.stringify(pLogoIcoUrl),
            'process.env.P_LOGO_URL': JSON.stringify(pLogoUrl),
            'process.env.P_TITLE': JSON.stringify(pTitle),
            'process.env.P_DESCRIPTION': JSON.stringify(pDescription),
            'process.env.P_CLAIM': JSON.stringify(pClaim),
            'process.env.P_DOC_URL': JSON.stringify(pDocURL),
            'process.env.P_REPO_URL': JSON.stringify(pRepoURL),
            'process.env.P_TOS_URL': JSON.stringify(pTosURL),
            'process.env.P_PRIVACY_POLICY_URL': JSON.stringify(pPrivacyPolicyURL)
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        compress: true,
        hot: true,
        open: "index_report.html",
        port: 5010,
        proxy: {
            '/api': {
                target: serviceUrl,
                secure: false
            }
        },
        static: false,
    },
    performance: {
        // TODO: Find and remove orphan modules; Reduce bundle size.
        hints: 'warning', // 'error' for errors, 'warning' for warnings, false to disable
        maxAssetSize: 7100000, // Size limit in bytes, default is 250000 (250 KB)
        maxEntrypointSize: 7100000, // Size limit in bytes, default is 250000 (250 KB)
    },
};
