const notifier = require('node-notifier');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const srcFolder = path.join(__dirname, '..', 'src');
const yamlDir = path.join(srcFolder, 'config');
const notify = (title, message) => {
  notifier.notify(
    {
      title,
      message,
      sound: true,
      wait: false,
    },
  );
};
exports.yamlToJSON = () => {
  const yamlFiles = fs.readdirSync(yamlDir);
  const JSON_DATA = {
    PT_SITE: {
    },
  };
  try {
    yamlFiles.forEach(file => {
      const fileName = file.replace('.yaml', '');
      const source = fs.readFileSync(yamlDir + '/' + file, 'UTF-8');
      JSON_DATA.PT_SITE[fileName] = YAML.parse(source);
    });
    fs.writeFileSync(`${srcFolder}/config.json`, JSON.stringify(JSON_DATA, null, 2));
  } catch (error) {
    notify('yamlToJSON Error', `${error.name}:${error.message}`);
    console.log(error);
  }
};

const { version, author, description = '' } = require('../package.json');

// 油猴前置注释
exports.userScriptComment = `// ==UserScript==
// @name         douban-info-for-pt
// @namespace    https://github.com/techmovie/DouBan-Info-for-PT
// @version      ${version}
// @description  ${description}
// @author       ${author}
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        *://passthepopcorn.me/torrents.php?id=*
// @match        *://passthepopcorn.me/requests.php?action=view&id=*
// @match        *://beyond-hd.me/torrents/*
// @match        *://beyond-hd.me/library/title/*
// @match        *://blutopia.xyz/torrents/*
// @match        *://asiancinema.me/torrents/*
// @match        *://hdbits.org/details.php?id=*
// @match        *://hdbits.org/requests/show_request?id=*
// @match        *://uhdbits.org/torrents.php?id=*
// @match        *://filelist.io/details.php?id=*
// @match        *://hd-torrents.org/details.php?id=*
// @match        *://karagarga.in/details.php?id=*
// @match        *://privatehd.to/torrent/*
// @match        *://www.rarbgmirror.com/torrent/*
// @match        *://rarbggo.org/torrent/*
// @match        *://rarbggo.to/torrent/*
// @match        *://rarbgprx.org/torrent/*
// @match        *://proxyrarbg.org/torrent/*
// @match        *://broadcasthe.net/series.php?id=*
// @match        *://iptorrents.com/torrent.php?id=*
// @match        *://www.iptorrents.com/torrent.php?id=*
// @match        *://www.torrentleech.org/torrent/*
// @match        *://avistaz.to/torrent/*
// @match        *://secret-cinema.pw/torrents.php?id=*
// @match        *://aither.cc/torrents/*
// @match        *://shadowthein.net/details.php?id=*
// @match        *://shadowthein.net/details.php?id=*
// @match        *://baconbits.org/torrents.php?id=*
// @match        *://broadcity.in/details.php?id=*
// @match        *://www.morethantv.me/torrents.php?id=*
// @match        *://www.morethantv.me/show/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==`;

exports.notify = notify;
