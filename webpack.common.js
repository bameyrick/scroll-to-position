import * as path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { NoEmitOnErrorsPlugin, ProgressPlugin, NamedModulesPlugin } from 'webpack';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

import postCssPlugins from './postcss.config';

export default function mode(mode) {
  const devMode = mode === 'development';

  return {
    mode,

    context: `${__dirname}/demo`,

    entry: {
      index: ['./index.ts'],
      html: ['./index.pug'],
      styles: ['./styles.scss']
    },

    output: {
      path: path.join(process.cwd(), 'build'),
    },

    resolve: {
      extensions: ['.ts', '.js', '.pug'],
      modules: ['./node_modules'],
      symlinks: true,
    },

    resolveLoader: {
      modules: ['./node_modules'],
    },
    
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          use: ['ts-loader']
        },
        {
          test: /\.pug$/,
          loaders: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].html'
              }
            },
            {
              loader: 'pug-html-loader',
              options: {
                doctype: 'html',
                data: {
                  debug: devMode
                }
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                indent: 'postcss',
                plugins: postCssPlugins
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                precision: 8
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new NoEmitOnErrorsPlugin(),

      new ProgressPlugin(),

      new CircularDependencyPlugin({
        exclude: /(\\|\/)node_modules(\\|\/)/,
        failOnError: false,
      }),
  
      new NamedModulesPlugin(),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),

      new FixStyleOnlyEntriesPlugin({
        extensions: ['scss', 'pug', 'html', 'css'],
        silent: true
      }),
    ]
  };
}
