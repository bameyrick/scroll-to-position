import merge from 'webpack-merge';

import commonConfig from './webpack.common';

const common = commonConfig('production');

export default merge(common);
