const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    require("postcss-hexrgba"),
    require("autoprefixer"),
];

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap("Copy images", function () {
            fse.copySync("./client/public", "./docs/public");
        });
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: [
        "css-loader?url=false",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: { plugins: postCSSPlugins },
            },
        },
    ],
};

let pages = fse
    .readdirSync("./client")
    .filter(function (file) {
        return file.endsWith(".html");
    })
    .map(function (page) {
        return new HtmlWebpackPlugin({
            filename: page,
            template: `./client/${page}`,
        });
    });

let config = {
    entry: "./client/src/App.js",
    plugins: pages,
    module: {
        rules: [cssConfig],
    },
};

if (currentTask == "dev") {
    cssConfig.use.unshift("style-loader");
    config.output = {
        filename: "bundled.js",
        path: path.resolve(__dirname, "client"),
    };
    config.devServer = {
        watchFiles: ["./client/**/*.html"],
        static: "client",
        hot: true,
        port: 3000,
        host: "0.0.0.0",
    };
    config.mode = "development";
}

if (currentTask == "build") {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
            },
        },
    });
    cssConfig.use.unshift(MiniCssExtractPlugin.loader);
    config.output = {
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "docs"),
    };
    config.mode = "production";
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    enforce: true,
                    chunks: "all",
                },
            },
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()],
    };
    config.plugins.push(
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
        new RunAfterCompile()
    );
}

module.exports = config;
