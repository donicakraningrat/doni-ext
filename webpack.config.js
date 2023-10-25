const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
module.exports = {
    entry:{
        popup: path.resolve("./src/page/popup/index.tsx"),
        // options: path.resolve("./src/page/options/options.tsx"),
        // background: path.resolve("./src/background/background.ts"),
        cs: path.resolve("./src/chrome/cs.ts"),
    },
    module:{
        rules:[
            {
                use:"ts-loader",
                test:/\.(tsx|ts)$/,
                exclude: /node_modules/
            },
            {
                use:["style-loader","css-loader"],
                test:/\.css$/i,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ]
    },
    plugins:[
        new CopyPlugin({
            patterns:[
                {
                    from:path.resolve('src/public'),
                    to:path.resolve("dist")
                }
            ]
        }),
        ...getHtmlPlugins([
            "popup","options"
        ])
    ],
    resolve:{
        extensions:[".tsx",".ts",".js"]
    },
    output:{
        filename: "[name].js"
    },
    optimization:{
        splitChunks:{
            chunks: "all"
        }
    }
}

function getHtmlPlugins(chunks){
    return chunks.map(chunk=> new HtmlPlugin({
        title: "Chrome Ext",
        filename: `${chunk}.html`,
        chunks:[chunk]
    }))
}