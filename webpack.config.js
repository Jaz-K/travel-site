const path = require("path");

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    require("postcss-hexrgba"),
    require("autoprefixer"),
];

module.exports = {
    entry: "./client/src/App.js",
    output: {
        filename: "bundled.js",
        path: path.resolve(__dirname, "client"),
    },
    devServer: {
        watchFiles: ["./client/**/*.html"],
        static: "client",
        hot: true,
        port: 3000,
        host: "0.0.0.0",
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader?url=false",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: { plugins: postCSSPlugins },
                        },
                    },
                ],
            },
        ],
    },
};
