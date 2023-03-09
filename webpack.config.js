const path = require("path");

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    // require("postcss-hexrgba"),
    require("autoprefixer"),
];

module.exports = {
    entry: "./client/src/App.js",
    output: {
        filename: "bundled.js",
        path: path.resolve(__dirname, "client"),
    },
    mode: "development",
    watch: true,
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
