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
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://passthepopcorn.me/requests.php?action=view&id=*
// @match        https://beyond-hd.me/torrents/*
// @match        https://beyond-hd.me/library/title/*
// @match        https://blutopia.xyz/torrents/*
// @match        https://asiancinema.me/torrents/*
// @match        https://hdbits.org/details.php?id=*
// @match        https://hdbits.org/requests/show_request?id=*
// @match        https://uhdbits.org/torrents.php?id=*
// @match        https://filelist.io/details.php?id=*
// @match        https://hd-torrents.org/details.php?id=*
// @match        https://karagarga.in/details.php?id=*
// @match        https://privatehd.to/torrent/*
// @match        https://www.rarbgmirror.com/torrent/*
// @match        http://rarbggo.org/torrent/*
// @match        http://rarbggo.to/torrent/*
// @match        https://rarbgprx.org/torrent/*
// @match        https://proxyrarbg.org/torrent/*
// @match        https://broadcasthe.net/series.php?id=*
// @match        https://iptorrents.com/torrent.php?id=*
// @match        https://www.iptorrents.com/torrent.php?id=*
// @match        https://www.torrentleech.org/torrent/*
// @match        https://avistaz.to/torrent/*
// @match        https://secret-cinema.pw/torrents.php?id=*
// @match        https://aither.cc/torrents/*
// @match        http://shadowthein.net/details.php?id=*
// @match        https://shadowthein.net/details.php?id=*
// @match        https://baconbits.org/torrents.php?id=*
// @match        https://broadcity.in/details.php?id=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==`;

exports.notify = notify;
