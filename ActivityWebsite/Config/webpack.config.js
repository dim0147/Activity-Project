﻿const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
    /* Club */
        //Edit: "./ReactJS/Club/Edit.js",
        //Create: "./ReactJS/Club/Create.js",
        //Detail: "./ReactJS/Club/Detail.js"

    /* Post */
        Create: "./ReactJS/Post/Create.js",
    },
    output: {
        //path: path.resolve(__dirname, "../dist/Club"),
        path: path.resolve(__dirname, "../dist/Post"),
        filename: "[name].js"
    },
    resolve: {
        fallback: {
            url: false,
            path: false
        }
    },
    module: {
        rules: [
            {
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                },
                test: /\.js$/,
                exclude: /node_modules/, //excludes node_modules folder from being transpiled by babel. We do this because it's a waste of resources to do so.
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    }
}