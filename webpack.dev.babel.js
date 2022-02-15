import merge from 'webpack-merge';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import commonConfig from './webpack.common';

const common = commonConfig('development');

export default merge(common, {
  plugins: [new LiveReloadPlugin()],
});
