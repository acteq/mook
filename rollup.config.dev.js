import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

import config from './rollup.config.js'
export default Object.assign({}, config, { plugins: [...config.plugins, serve({open: true, contentBase:"dist"}),
livereload()]});
