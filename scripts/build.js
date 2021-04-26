const { userScriptComment, yamlToJSON } = require('./helper');
yamlToJSON();
require('esbuild').build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/douban-info-for-pt.js',
  bundle: true,
  target: 'chrome58',
  sourcemap: false,
  banner: userScriptComment,
}).catch(() => process.exit(1));
