const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
    /* Home */
        Index: "./ReactJS/Home/Index.js"


    /* Club */
        //Edit: "./ReactJS/Club/Edit.js",
        //Create: "./ReactJS/Club/Create.js",
        //Detail: "./ReactJS/Club/Detail.js",
        //Search: "./ReactJS/Club/Search.js",
        //Chatbox: "./ReactJS/Club/Chatbox.js"

    /* Post */
        //Create: "./ReactJS/Post/Create.js",
        //Edit: "./ReactJS/Post/Edit.js",
        //Detail: "./ReactJS/Post/Detail.js",

    /* Manage */
        //Club: './ReactJS/Manage/Club.js',
        //Post: './ReactJS/Manage/Post.js',
        //Following: './ReactJS/Manage/Following.js',
        //Report: './ReactJS/Manage/Report.js',

    /* Admin */
        //App: "./ReactJS/Admin/App.js"

    },
    output: {
        path: path.resolve(__dirname, "../dist/Home"),
        //path: path.resolve(__dirname, "../dist/Club"),
        //path: path.resolve(__dirname, "../dist/Post"),
         //path: path.resolve(__dirname, "../dist/Manage"),
         //path: path.resolve(__dirname, "../dist/Admin"),
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