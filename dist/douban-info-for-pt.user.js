// ==UserScript==
// @name         douban-info-for-pt
// @namespace    https://github.com/techmovie/DouBan-Info-for-PT
// @version      1.6.2
// @description  在PT站电影详情页展示部分中文信息
// @author       birdplane
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
// @match        https://www.morethantv.me/torrents.php?id=*
// @match        https://www.morethantv.me/show/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==
(() => {
  var __assign = Object.assign;

  // src/config.json
  var PT_SITE = {
    "aither.cc": {
      url: "https://aither.cc",
      host: "aither.cc",
      siteName: "Aither",
      poster: "#meta-poster",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: ".torrent-buttons",
      doubanContainerDom: '<div class="movie-wrapper"><div class="movie-overlay" style="background-color: rgba(81, 51, 40, 0.75);"></div><div class="douban-dom" style="position: relative;z-index: 2;"></div></div>'
    },
    "asiancinema.me": {
      url: "https://asiancinema.me",
      host: "asiancinema.me",
      siteName: "ACM",
      poster: "img.movie-poster",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: "#vue",
      doubanContainerDom: '<div class="douban-dom" style="width: 1100px;"></div>'
    },
    "avistaz.to": {
      url: "https://avistaz.to",
      host: "avistaz.to",
      siteName: "AvistaZ",
      imdb: '.movie-details .badge-extra a[href*="imdb.com/title"]:first',
      titleDom: ".title .torrent-filename",
      poster: ".movie-poster img",
      insertDomSelector: ".movie-poster",
      doubanContainerDom: '<div class="douban-dom" style="justify-content: flex-start;"></div>'
    },
    "baconbits.org": {
      url: "https://baconbits.org",
      host: "baconbits.org",
      siteName: "bB",
      imdb: '.box .body a[href*="imdb.com/title"]:first',
      insertDomSelector: ".linkbox:first",
      titleDom: "h1:first",
      doubanContainerDom: '<div class="douban-dom bb"></div>'
    },
    "beyond-hd.me": {
      url: "https://beyond-hd.me",
      host: "beyond-hd.me",
      siteName: "BHD",
      imdb: '.movie-details a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: ".movie-wrapper",
      doubanContainerDom: '<div class="douban-dom bhd"></div>'
    },
    "blutopia.xyz": {
      url: "https://blutopia.xyz",
      host: "blutopia.xyz",
      siteName: "BLU",
      poster: "#meta-poster",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: ".torrent-buttons",
      doubanContainerDom: '<div class="movie-wrapper"><div class="movie-overlay" style="background-color: rgba(81, 51, 40, 0.75);"></div><div class="douban-dom" style="position: relative;z-index: 2;"></div></div>'
    },
    "broadcasthe.net": {
      url: "https://broadcasthe.net",
      host: "broadcasthe.net",
      siteName: "BTN",
      imdb: '.stats td a[href*="imdb.com/title"]',
      insertDomSelector: "#content .linkbox",
      poster: ".sidebar .box img:first",
      doubanContainerDom: '<div class="douban-dom btn" style="display:flex;justify-content: center;width: 850px;margin-left: -20px;"></div>'
    },
    "broadcity.in": {
      url: "https://broadcity.in",
      host: "broadcity.in",
      siteName: "Bdc",
      imdb: '#imdbdetails a[href*="imdb.com/title"]',
      titleDom: "#details>table>tbody>tr:first",
      insertDomSelector: "#imdbdetails",
      poster: "#ts_show_preview img",
      doubanContainerDom: '<div class="douban-dom bdc" style="display:flex;justify-content: center;"></div>'
    },
    "filelist.io": {
      url: "https://filelist.io",
      host: "filelist.io",
      siteName: "FL",
      imdb: '.cblock-innercontent div a[href*="imdb.com/title"]:first',
      poster: 'img[width="300px"][src*="image.tmdb.org"]',
      titleDom: ".cblock-header h4",
      insertDomSelector: ".cblock-innercontent hr.separator:first",
      doubanContainerDom: '<div class="douban-dom" style="width: 100%;padding-top:20px;"></div>'
    },
    "hd-torrents.org": {
      url: "https://hd-torrents.org",
      host: "hd-torrents.org",
      siteName: "HDT",
      poster: "#IMDBDetailsInfoHideShowTR .imdbnew a img",
      imdb: '.imdbnew2 a[href*="imdb.com/title"]:first',
      insertDomSelector: "td.detailsleft:contains(IMDb)",
      doubanContainerDom: '<tr><td align="left" class="detailsleft">\u8C46\u74E3</td><td valign="top" align="left" class="detailshash douban-dom hdt"></td></tr>'
    },
    "hdbits.org": {
      url: "https://hdbits.org",
      host: "hdbits.org",
      siteName: "HDB",
      imdb: {
        movie: ".contentlayout h1 a",
        tv: "#details .showlinks li:nth-child(2) a",
        tvRequest: ".lottery_table2 .showlinks li:nth-child(2) a"
      },
      titleDom: "h1:first",
      insertDomSelector: "#details>tbody>tr:nth-child(2),.lottery_table2>tbody>tr:nth-child(1)",
      doubanContainerDom: '<tr><td><div id="l7829483" class="label collapsable" onclick="showHideEl(7829483);(7829483)"><span class="plusminus">- </span>\u8C46\u74E3\u4FE1\u606F</div><div id="c7829483" class="hideablecontent" ><div class="contentlayout douban-dom hdb"></div></td></tr>'
    },
    "iptorrents.com": {
      url: "https://iptorrents.com",
      host: "iptorrents.com",
      siteName: "IPT",
      imdb: '.main td a[href*="imdb.com/title"]',
      titleDom: ".dBox h1",
      insertDomSelector: ".dBox .info",
      doubanContainerDom: '<div class="douban-dom" style="display:flex;justify-content: center;"></div>'
    },
    "karagarga.in": {
      url: "https://karagarga.in",
      host: "karagarga.in",
      siteName: "KG",
      imdb: 'td a[href*="imdb.com/title"]:first',
      insertDomSelector: ".outer h1~table:first",
      doubanContainerDom: '<div class="douban-dom kg" style="width:1100px;padding-top:20px;"></div>'
    },
    "passthepopcorn.me": {
      url: "https://passthepopcorn.me",
      host: "passthepopcorn.me",
      siteName: "PTP",
      siteType: "gazelle",
      imdb: {
        request: '#request-table a[href*="imdb.com/title"]:first',
        torrent: "#imdb-title-link"
      }
    },
    "privatehd.to": {
      url: "https://privatehd.to",
      host: "privatehd.to",
      siteName: "PHD",
      imdb: '.movie-details .badge-extra a[href*="imdb.com/title"]:first',
      titleDom: ".title .torrent-filename",
      poster: ".movie-poster img",
      insertDomSelector: ".movie-poster",
      doubanContainerDom: '<div class="douban-dom" style="justify-content: flex-start;"></div>'
    },
    "secret-cinema.pw": {
      url: "https://secret-cinema.pw",
      host: "secret-cinema.pw",
      siteName: "SC",
      imdb: '.torrent_row a[href*="imdb.com/title"]:first',
      insertDomSelector: ".linkbox:first",
      doubanContainerDom: '<div class="douban-dom sc"></div>'
    },
    "shadowthein.net": {
      url: "http://shadowthein.net",
      host: "shadowthein.net",
      siteName: "iTS",
      imdb: '.IMDBtable a[href*="imdb.com/title"]:first',
      insertDomSelector: "h1+table.line",
      titleDom: "h1:first",
      doubanContainerDom: '<div class="douban-dom its"></div>'
    },
    "uhdbits.org": {
      url: "https://uhdbits.org",
      host: "uhdbits.org",
      siteName: "UHD",
      imdb: ".tooltip.imdb_icon",
      poster: ".poster_box .imgbox img",
      insertDomSelector: "div.head:contains(IMDB)",
      doubanContainerDom: '<div class="box"><div class="head"><a href="#">\u2191</a>&nbsp;<strong>\u8C46\u74E3</strong></div><div class="body douban-dom"></div></div>'
    },
    "www.morethantv.me": {
      url: "www.morethantv.me",
      host: "morethantv.me",
      siteName: "MTV",
      imdb: '.metalinks a[href*="imdb.com/title"]',
      insertDomSelector: "#content>.thin>div:first",
      poster: ".sidebar img:first",
      titleDom: ".details h2:first",
      doubanContainerDom: '<div class="douban-dom mtv"></div>'
    },
    "www.rarbgmirror.com": {
      url: "https://www.rarbgmirror.com",
      host: "www.rarbgmirror.com",
      siteName: "RARBG",
      poster: "td.header2:contains(Poster) ~ td img",
      imdb: '.lista a[href*="imdb.com/title"]:first',
      titleDom: "h1.black",
      insertDomSelector: "td.header2:contains(Poster)",
      doubanContainerDom: '<tr><td align="right" class="header2" valign="top">\u8C46\u74E3</td><td class="lisaa douban-dom"></td></tr>'
    },
    "www.torrentleech.org": {
      url: "https://www.torrentleech.org",
      host: "torrentleech.org",
      siteName: "IPT",
      imdb: '.imdb-info a[href*="imdb.com/title"]',
      titleDom: "#torrentnameid",
      poster: ".imdb_cover img",
      insertDomSelector: ".torrent-info .torrent-info-details",
      doubanContainerDom: '<div class="douban-dom"></div>'
    }
  };

  // src/const.js
  var host = location.host;
  var _a, _b;
  var siteInfo = (_b = (_a = PT_SITE) == null ? void 0 : _a[host]) != null ? _b : "";
  var _a2, _b2;
  if (host && host.match(/rarbg/i)) {
    siteInfo = PT_SITE["www.rarbgmirror.com"];
  } else if (host && host.match(/iptorrents/i)) {
    siteInfo = PT_SITE["iptorrents.com"];
  } else {
    siteInfo = (_b2 = (_a2 = PT_SITE) == null ? void 0 : _a2[host]) != null ? _b2 : "";
  }
  var CURRENT_SITE_INFO = siteInfo;
  var _a3;
  var CURRENT_SITE_NAME = (_a3 = CURRENT_SITE_INFO == null ? void 0 : CURRENT_SITE_INFO.siteName) != null ? _a3 : "";
  var DOUBAN_API_URL = "https://movie.douban.com/subject/{doubanId}";
  var DOUBAN_SEARCH_API = "https://movie.douban.com/j/subject_suggest?q={query}";
  var PIC_URLS = {
    border: "https://ptpimg.me/zz4632.png",
    icon2x: "https://ptpimg.me/n74cjc.png",
    icon: "https://ptpimg.me/yze1gz.png",
    line: "https://ptpimg.me/e11hb1.png"
  };

  // src/common.js
  var addToPtpPage = (data) => {
    console.log(data);
    $(".page__title").prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
    if (data.summary) {
      const synopsisDom = `
    <div class="panel" id="douban-synopsis">
    <div class="panel__heading"><span class="panel__heading__title">\u4E2D\u6587\u7B80\u4ECB</span></div>
    <div class="panel__body">
          <div id="synopsis">${data.summary}</div>
    </div>
    </div>`;
      $("#synopsis-and-trailer,#request-table").after(synopsisDom);
    }
    $("#movieinfo").before(`
    <div class="panel">
    <div class="panel__heading"><span class="panel__heading__title">\u7535\u5F71\u4FE1\u606F</span></div>
    <div class="panel__body">
    <div><strong>\u5BFC\u6F14:</strong> ${data.director}</div>
    <div><strong>\u7C7B\u578B:</strong> ${data.genre}</div>
    <div><strong>\u5236\u7247\u56FD\u5BB6/\u5730\u533A:</strong> ${data.region}</div>
    <div><strong>\u8BED\u8A00:</strong> ${data.language}</div>
    <div><strong>\u65F6\u957F:</strong> ${data.runtime}</div>
    <div><strong>\u53C8\u540D:</strong>  ${data.aka}</div
    <div><strong>\u83B7\u5956\u60C5\u51B5:</strong> <br> ${data.awards}</div
    </div>`);
    if (data.average) {
      $("#movie-ratings-table tr").prepend(`<td colspan="1" style="width: 152px;">
    <center>
    <a target="_blank" class="rating" href="${data.link}" rel="noreferrer">
    <div style="font-size: 0;min-width: 105px;">
        <span class="icon-pt1">\u8C46</span>
        <span class="icon-pt2">\u8C46\u74E3\u8BC4\u5206</span>
    </div>
    </a>
    </center>
    </td>
    <td style="width: 153px;">
    <span class="rating">${data.average}</span>
    <span class="mid">/</span>
    <span class="outof"> 10</span>
    <br>(${data.votes} votes)</td>`);
    }
  };
  var getImdbId = () => {
    var _a4, _b3;
    let imdbLink = "";
    const imdbConfig = CURRENT_SITE_INFO.imdb;
    if (typeof imdbConfig === "object") {
      try {
        Object.keys(imdbConfig).forEach((key) => {
          if ($(`${imdbConfig[key]}`)[0]) {
            imdbLink = $(imdbConfig[key]).attr("href");
            throw new Error("end loop");
          }
        });
      } catch (error) {
        if (error.message !== "end loop") {
          console.log(error);
        }
      }
    } else {
      imdbLink = $(imdbConfig).attr("href");
    }
    console.log(imdbLink);
    return (_b3 = (_a4 = /tt\d+/.exec(imdbLink)) == null ? void 0 : _a4[0]) != null ? _b3 : "";
  };
  var getDoubanId = async (imdbId) => {
    try {
      const url = DOUBAN_SEARCH_API.replace("{query}", imdbId);
      const res = await fetch(url, {
        responseType: "json"
      });
      if (res && res.length > 0 && res[0].id) {
        const {id, title, episode} = res[0];
        return {
          id,
          season: episode,
          title
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  var getTvSeasonData = (data) => {
    const torrentTitle = getTorrentTitle();
    return new Promise((resolve, reject) => {
      var _a4, _b3;
      const {season = "", title} = data;
      if (season) {
        const seasonNumber = (_b3 = (_a4 = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)) == null ? void 0 : _a4[1]) != null ? _b3 : 1;
        if (parseInt(seasonNumber) === 1) {
          resolve(data);
        } else {
          const query = title.replace(/第.+?季/, `\u7B2C${seasonNumber}\u5B63`);
          getDoubanId(query).then((data2) => {
            resolve(data2);
          });
        }
      }
    });
  };
  var getDoubanInfo = async (doubanId, imdbId) => {
    try {
      const url = DOUBAN_API_URL.replace("{doubanId}", doubanId);
      const data = await fetch(url, {
        responseType: "text"
      });
      if (data) {
        const doubanInfo = await formatDoubanInfo(data);
        const savedIds = GM_getValue("ids") || {};
        savedIds[imdbId] = __assign({
          doubanId
        }, doubanInfo);
        GM_setValue("ids", savedIds);
        return doubanInfo;
      } else {
        console.log("\u8C46\u74E3\u6570\u636E\u83B7\u53D6\u5931\u8D25");
      }
    } catch (error) {
      console.log(error);
    }
  };
  var formatDoubanInfo = async (domString) => {
    var _a4, _b3, _c;
    const dom = new DOMParser().parseFromString(domString, "text/html");
    const chineseTitle = $("title", dom).text().replace("(\u8C46\u74E3)", "").trim();
    const jsonData = JSON.parse($('head > script[type="application/ld+json"]', dom).html().replace(/(\r\n|\n|\r|\t)/gm, ""));
    const fetchAnchor = function(anchor) {
      var _a5, _b4, _c2, _d;
      return (_d = (_c2 = (_b4 = (_a5 = anchor == null ? void 0 : anchor[0]) == null ? void 0 : _a5.nextSibling) == null ? void 0 : _b4.nodeValue) == null ? void 0 : _c2.trim()) != null ? _d : "";
    };
    const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
    const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
    const director = jsonData.director ? jsonData.director : [];
    const poster = jsonData.image.replace(/s(_ratio_poster|pic)/g, "l$1").replace(/img\d/, "img9");
    const link = `https://movie.douban.com${jsonData.url}`;
    const introductionDom = $('#link-report > span.all.hidden, #link-report > [property="v:summary"]', dom);
    const summary = (introductionDom.length > 0 ? introductionDom.text() : "\u6682\u65E0\u76F8\u5173\u5267\u60C5\u4ECB\u7ECD").split("\n").map((a) => a.trim()).filter((a) => a.length > 0).join("\n");
    const genre = $('#info span[property="v:genre"]', dom).map(function() {
      return $(this).text().trim();
    }).toArray();
    const language = fetchAnchor($('#info span.pl:contains("\u8BED\u8A00")', dom));
    const region = fetchAnchor($('#info span.pl:contains("\u5236\u7247\u56FD\u5BB6/\u5730\u533A")', dom));
    const runtimeAnchor = $('#info span.pl:contains("\u5355\u96C6\u7247\u957F")', dom);
    const runtime = runtimeAnchor[0] ? fetchAnchor(runtimeAnchor) : $('#info span[property="v:runtime"]', dom).text().trim();
    const akaAnchor = $('#info span.pl:contains("\u53C8\u540D")', dom);
    let aka = [];
    if (akaAnchor.length > 0) {
      aka = fetchAnchor(akaAnchor).split(" / ").sort(function(a, b) {
        return a.localeCompare(b);
      }).join("/");
      aka = aka.split("/");
    }
    const awardsPage = await fetch(`${link}/awards`, {
      responseType: "text"
    });
    const awardsDoc = new DOMParser().parseFromString(awardsPage, "text/html");
    const awards = $("#content > div > div.article", awardsDoc).html().replace(/[ \n]/g, "").replace(/<\/li><li>/g, "</li> <li>").replace(/<\/a><span/g, "</a> <span").replace(/<(div|ul)[^>]*>/g, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/ +\n/g, "\n").trim();
    return {
      director: director.map((item) => item.name),
      runtime,
      language,
      genre: (_a4 = genre == null ? void 0 : genre.join(" / ")) != null ? _a4 : "",
      aka: (_b3 = aka == null ? void 0 : aka.join(" / ")) != null ? _b3 : "",
      region,
      link,
      poster,
      summary,
      chineseTitle,
      votes,
      average: rating,
      awards: (_c = awards == null ? void 0 : awards.replace(/\n/g, "<br>")) != null ? _c : ""
    };
  };
  var getTorrentTitle = () => {
    let {titleDom} = CURRENT_SITE_INFO;
    if (!titleDom) {
      if (CURRENT_SITE_NAME === "BHD") {
        titleDom = $(".dotborder").find("td:contains(Name)").next("td");
      } else if (CURRENT_SITE_NAME.match(/ACM|BLU/)) {
        const keyMap = {
          Name: "Name",
          \u540D\u79F0: "Name",
          \u540D\u7A31: "Name"
        };
        $("#vue+.panel table tr").each((index, element) => {
          const key = $(element).find("td:first").text().replace(/\s|\n/g, "");
          if (keyMap[key]) {
            titleDom = $(element).find("td:last");
          }
        });
      } else if (CURRENT_SITE_NAME === "UHD") {
        const torrentId = getUrlParam("torrentid");
        const torrentFilePathDom = $(`#files_${torrentId} .filelist_path`);
        const torrentFileDom = $(`#files_${torrentId} .filelist_table>tbody>tr:nth-child(2) td`).eq(0);
        titleDom = torrentFilePathDom || torrentFileDom;
      } else if (CURRENT_SITE_NAME === "HDT") {
        return document.title.replace(/HD-Torrents.org\s*-/ig, "").trim();
      }
    }
    return $(titleDom).text();
  };
  var getUrlParam = (key) => {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    const regArray = location.search.substr(1).match(reg);
    if (regArray) {
      return unescape(regArray[2]);
    }
    return "";
  };
  var createDoubanDom = async (doubanId, imdbId, doubanInfo) => {
    const div = document.createElement("div");
    let {doubanContainerDom, insertDomSelector, siteName, poster} = CURRENT_SITE_INFO;
    if (siteName.match(/(HDT|RARBG)$/)) {
      insertDomSelector = $(insertDomSelector).parent();
    }
    $(insertDomSelector).before(doubanContainerDom);
    const doubanLink = `https://movie.douban.com/subject/${doubanId}`;
    let htmlData = await fetch(`${doubanLink}/output_card`, {
      responseType: "text"
    });
    htmlData = htmlData.replace(/wrapper/g, "douban-wrapper").replace(/<script.+?script>/g, "");
    htmlData = htmlData.replace(/(html,)body,/, "$1");
    htmlData = htmlData.replace(/url\(.+?output_card\/border.png\)/g, `url(${PIC_URLS.border})`);
    htmlData = htmlData.replace(/src=.+?output_card\/line\.png/g, `src="${PIC_URLS.line}`);
    htmlData = htmlData.replace(/url\(.+?output_card\/ic_rating_m\.png\)/g, `url(${PIC_URLS.icon})`);
    htmlData = htmlData.replace(/(1x,\s+)url\(.+?output_card\/ic_rating_m@2x\.png\)/g, `$1url(${PIC_URLS.icon2x})`);
    let headDom = htmlData.match(/<head>((.|\n)+)<\/head>/)[1];
    headDom = headDom.replace(/<link.+?>/g, "");
    const bodyDom = htmlData.match(/<body>((.|\n)+)<\/body>/)[1];
    div.insertAdjacentHTML("beforeend", headDom);
    div.insertAdjacentHTML("beforeend", bodyDom);
    $(".douban-dom").append(div).attr("douban-link", doubanLink);
    $(".douban-dom .grid-col4").after(`
  <div class="fix-col grid-col3">
  <div class="line-wrap">
    <img src="https://ptpimg.me/e11hb1.png">
  </div>
  </div>
  <div class="fix-col grid-col5"></div>`);
    const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
    $(".douban-dom .grid-col5").html(`<div class="summary">${doubanData.summary || "\u6682\u65E0\u7B80\u4ECB"}</div>`);
    let posterStyle = $(".picture-douban-wrapper").attr("style");
    const posterImg = siteName === "MTV" ? $(poster).attr("src") : doubanData.poster;
    posterStyle = posterStyle == null ? void 0 : posterStyle.replace(/\(.+\)/, `(${posterImg})`);
    $(".picture-douban-wrapper").attr("style", posterStyle);
    $(".douban-dom").click(() => {
      GM_openInTab(doubanLink);
    });
  };
  function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(__assign(__assign({
        method: "GET",
        url,
        responseType: "json"
      }, options), {
        onload: (res) => {
          const {statusText, status, response} = res;
          if (status !== 200) {
            reject(new Error(statusText || status));
          } else {
            resolve(response);
          }
        },
        ontimeout: () => {
          reject(new Error("timeout"));
        },
        onerror: (error) => {
          reject(error);
        }
      }));
    });
  }

  // src/style.js
  var style_default = GM_addStyle(`
.contentlayout.douban-info {
    display: flex;
    justify-content: space-around;
}
.contentlayout.douban-info .detail{
    flex:1;
}
.detail .title{
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 20px;
}
.detail .title a{
    text-decoration: none;
}
.movie-detail{
    display: flex;
    justify-content: space-between;
}
.movie-detail .synopsis {
    width: 60%;
}
.movie-detail .movieinfo {
    margin-right: 20px;
    max-width: 30%;
}
.icon-pt1{
    font-size: 14px;
    display: inline-block;
    text-align: center;
    border: 1px solid #41be57;
    background-color: #41be57;
    color: white;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 24px;
    height: 24px;
    line-height: 24px;
}

.icon-pt2{
    display: inline-block;
    text-align: center;
    border: 1px solid #41be57;
    color: #3ba94d;
    background: #ffffff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 69px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
}
.douban-dom {
    display: flex;
    cursor: pointer;
}
.douban-dom {
    text-align: left;
}
#douban-wrapper *{
    box-sizing: content-box;
}
#douban-wrapper .clearfix:after { 
    content: "."; 
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
}
#douban-wrapper .clearfix {
    zoom: 1;
    display: inline-block; 
    _height: 1px;
}
#douban-wrapper  .clearfix { 
    height: 1% 
}
#douban-wrapper .clearfix { 
    display: block 
}
#douban-wrapper .rating_per{
    color: #111;
}
#douban-wrapper .grid{
    overflow: initial;
}
.content-rounded #douban-wrapper div{
    margin-left: 0;
}
#douban-wrapper #content .douban-icon .icon-pt1 {
    background-image:none;
}
#douban-wrapper h2,#douban-wrapper h1{
    border:none;
    background-image: none;
    background-color: transparent;
    text-shadow: none;
}
#douban-wrapper .grid-col5 {
    font-size: 14px;
    padding: 27px 14px 0 12px;
    width: 190px;
    overflow-y: auto;
    height: 277px;
    width: calc(100% - 225px - 254px - 36px - 280px);
}

#douban-wrapper .summary{
    padding-top: 10px;
    color: #000000;
    line-height: 25px;
    letter-spacing: 1px;
    word-break: break-all;
    font-weight: 400;
}
#douban-wrapper {
    width: 100% !important;
}
.douban-dom>div{
    width: 100%;
}
#douban-wrapper #content{
    background-image:none !important;
    background: #fff;
    width: calc(100% - 20px) !important;
}
#douban-wrapper #content .grid{
    width: 100% !important;
}
.bhd #douban-wrapper ::-webkit-scrollbar-track{
    background-color: #fff;
}
.bhd #douban-wrapper ::-webkit-scrollbar-thumb{
    background-color: #ddd;
}
.btn #douban-wrapper .grid-col1 {
    display: none;
}
.hdb #douban-wrapper .grid-col1 {
    display: none;
}
.hdt #douban-wrapper .grid-col1 {
    display: none;
}
.sc #douban-wrapper .grid-col1 {
    display: none;
}
.its #douban-wrapper .grid-col1 {
    display: none;
}
.bb #douban-wrapper .grid-col1 {
    display: none;
}
.btn #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.hdt #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.hdb #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.sc #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.its #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.bb #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.its #douban-wrapper {
    background-color: #131313;
    color: #fff;
}
`);

  // src/index.js
  (async () => {
    if (CURRENT_SITE_INFO) {
      const imdbId = getImdbId();
      if (!imdbId) {
        return;
      }
      try {
        const savedIds = GM_getValue("ids") || {};
        if (!savedIds[imdbId]) {
          let doubanId = "";
          const movieData = await getDoubanId(imdbId);
          if (!movieData) {
            throw new Error("\u6CA1\u6709\u627E\u5230\u8C46\u74E3\u6761\u76EE");
          }
          const {id = "", season = ""} = movieData;
          doubanId = id;
          if (season) {
            const tvData = await getTvSeasonData(movieData);
            doubanId = tvData.id;
          }
          if (CURRENT_SITE_NAME === "PTP") {
            getDoubanInfo(doubanId, imdbId).then((doubanData) => {
              addToPtpPage(doubanData);
            });
          } else {
            createDoubanDom(doubanId, imdbId);
          }
        } else {
          const savedData = savedIds[imdbId];
          if (CURRENT_SITE_NAME === "PTP") {
            addToPtpPage(savedData);
          } else {
            createDoubanDom(savedData.doubanId, imdbId, savedData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  })();
})();
