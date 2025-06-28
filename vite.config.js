import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';
import { yamlToJSON } from './scripts/helper.js';
import chokidar from 'chokidar';

const cmd = process.argv.slice(2)[0];
const isDev = cmd === 'dev';

export default defineConfig({
  plugins: [
    {
      name: 'watch-yaml',
      buildStart () {
        yamlToJSON();
        if (!isDev) return;
        chokidar
          .watch(['src/config/*.yaml'], {
            awaitWriteFinish: {
              stabilityThreshold: 200,
              pollInterval: 100,
            },
            ignoreInitial: true,
          })
          .on('all', (eventName, path) => {
            console.log(`${path}:${eventName}`);
            yamlToJSON();
          });
      },
    },
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: {
          '': 'douban-info-for-pt',
          en: 'douban-info-for-pt',
        },
        description: {
          '': '在PT站电影详情页展示部分中文信息',
          en: 'Display some Chinese information on the PT site movie details page',
        },
        namespace: 'https://github.com/techmovie/DouBan-Info-for-PT',
        match: [
          '*://passthepopcorn.me/torrents.php?id=*',
          '*://passthepopcorn.me/requests.php?action=view&id=*',
          '*://anthelion.me/torrents.php?id=*',
          '*://anthelion.me/requests.php?action=view&id=*',
          '*://beyond-hd.me/torrents/*',
          '*://beyond-hd.me/library/title/*',
          '*://blutopia.cc/torrents/*',
          '*://eiga.moi/torrents/*',
          '*://hdbits.org/details.php?id=*',
          '*://hdbits.org/requests/show_request?id=*',
          '*://uhdbits.org/torrents.php?id=*',
          '*://filelist.io/details.php?id=*',
          '*://hd-torrents.org/details.php?id=*',
          '*://karagarga.in/details.php?id=*',
          '*://privatehd.to/torrent/*',
          '*://broadcasthe.net/series.php?id=*',
          '*://iptorrents.com/torrent.php?id=*',
          '*://www.iptorrents.com/torrent.php?id=*',
          '*://www.torrentleech.org/torrent/*',
          '*://avistaz.to/torrent/*',
          '*://secret-cinema.pw/torrents.php?id=*',
          '*://aither.cc/torrents/*',
          '*://shadowthein.net/details.php?id=*',
          '*://shadowthein.net/details.php?id=*',
          '*://baconbits.org/torrents.php?id=*',
          '*://broadcity.in/details.php?id=*',
          '*://www.morethantv.me/torrents.php?id=*',
          '*://www.morethantv.me/show/*',
          '*://tgx.rs/torrent/*',
        ],
        downloadURL:
          'https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js',
        updateURL:
          'https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js',
        license: 'MIT',
      },
      build: {
        externalGlobals: {
          jquery: cdn.jsdelivr('jQuery', 'dist/jquery.min.js'),
        },
      },
      server: {
        mountGmApi: true,
      },
    }),
  ],
  build: {
    minifyCss: true,
    target: 'chrome58',
    outDir: './dist',
  },
});
