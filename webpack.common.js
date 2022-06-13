import * as path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { NoEmitOnErrorsPlugin, ProgressPlugin } from 'webpack';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import postcssPlugins from './postcss.config';

export default function mode(mode) {
  const devMode = mode === 'development';

  return {
    mode,

    context: `${__dirname}/demo`,

    entry: {
      index: ['./index.ts'],
      html: ['./index.pug'],
      styles: ['./styles.scss'],
    },

    output: {
      path: path.join(process.cwd(), 'build'),
    },

    resolve: {
      extensions: ['.ts', '.js', '.mjs', '.pug'],
      modules: ['./node_modules'],
      symlinks: true,
    },

    resolveLoader: {
      modules: ['./node_modules'],
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          use: ['ts-loader'],
        },
        {
          test: /\.pug$/,
          rules: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].html',
              },
            },
            {
              loader: 'pug-html-loader',
              options: {
                doctype: 'html',
                data: {
                  debug: devMode,
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: postcssPlugins,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                sassOptions: {
                  precision: 8,
                  includePaths: [path.resolve('./src/styles')],
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new NoEmitOnErrorsPlugin(),

      new ProgressPlugin(),

      new CircularDependencyPlugin({
        exclude: /(\\|\/)node_modules(\\|\/)/,
        failOnError: false,
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      new RemoveEmptyScriptsPlugin(),
    ],

    optimization: {
      moduleIds: 'named',
    },
  };
}
