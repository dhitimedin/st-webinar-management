const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Import the copy-webpack-plugin

module.exports = {
    ...defaultConfig,
    entry: {
        'webinar': './src/webinar/js/block-editor-script.jsx'
    },

    output: {
        path: path.resolve(__dirname, './assets'),
        filename: ({ chunk }) => {
            const folderName = chunk.name.split('/')[0]; // Get the folder name from the entry point
            return `${folderName}/js/[name].min.js`;
        },
        assetModuleFilename: ({ filename }) => {
            const folderName = path.dirname(filename).split('/')[0]; // Get the folder name from the source file
            return `${folderName}/images/[name][ext][query]`;
        },
        clean: true,
    },

    devtool: "source-map",

    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            path: require.resolve('path'),
        },
    },

    module: {
        ...defaultConfig.module,
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
 				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
                            publicPath: (resourcePath, context) => {
                                // publicPath is the relative path from the output directory to the assets
                                // In this case, it should be 'webinar/css/'
                                return path.relative(path.dirname(resourcePath), path.join(context, 'webinar/css')).replace(/\\/g, '/');
                            },
						},
					},
					{
						loader: 'css-loader',
					},
					'sass-loader',
				],
            },
            {
                test: /\.svg/,
                type: 'asset/inline',
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: (pathData) => {
                        const relativePath = path.relative(path.resolve(__dirname, 'src'), pathData.filename);
                        return `images/${relativePath}`;
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../fonts/[name][ext][query]',
                },
            },
        ],
    },

    plugins: [
        ...defaultConfig.plugins,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: ({ chunk }) => {
                const folderName = chunk.name.split('/')[0]; // Get the folder name from the entry point
                return `${folderName}/css/[name].min.css`;
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'src/**/block.json'),
                to({ context, absoluteFilename }) {
                  const relativePath = path.relative(context, absoluteFilename);
                  return path.resolve(__dirname, 'assets', relativePath);
                },
                context: path.resolve(__dirname, 'src'),
              },
            ],
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};
