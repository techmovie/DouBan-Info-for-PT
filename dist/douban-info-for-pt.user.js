// ==UserScript==
// @name         douban-info-for-pt
// @namespace    https://github.com/techmovie/DouBan-Info-for-PT
// @version      1.7.5
// @description  在PT站电影详情页展示部分中文信息
// @author       birdplane
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        *://passthepopcorn.me/torrents.php?id=*
// @match        *://passthepopcorn.me/requests.php?action=view&id=*
// @match        *://anthelion.me/torrents.php?id=*
// @match        *://anthelion.me/requests.php?action=view&id=*
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
// @match        *://tgx.rs/torrent/*
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
    "anthelion.me": {
      url: "https://anthelion.me",
      host: "anthelion.me",
      siteName: "ANT",
      siteType: "gazelle",
      imdb: {
        request: '.layout a[href*="imdb.com/title"]:first',
        torrent: '.torrent_ratings a[href*="imdb.com/title"]:first'
      }
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
    "tgx.rs": {
      url: "https://tgx.rs",
      host: "tgx.rs",
      siteName: "TorrentGalaxy",
      poster: "#covercell img",
      imdb: '#imdbpage[href*="imdb.com/title"]',
      titleDom: ".torrentpagetable.limitwidth:first a.textshadow",
      insertDomSelector: ".buttonbox",
      doubanContainerDom: '<div class="douban-dom" style="display:flex;justify-content: center;"></div>'
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
  if (host && host.match(/iptorrents/i)) {
    siteInfo = PT_SITE["iptorrents.com"];
  } else {
    siteInfo = (_b2 = (_a2 = PT_SITE) == null ? void 0 : _a2[host]) != null ? _b2 : "";
  }
  var CURRENT_SITE_INFO = siteInfo;
  var _a3;
  var CURRENT_SITE_NAME = (_a3 = CURRENT_SITE_INFO == null ? void 0 : CURRENT_SITE_INFO.siteName) != null ? _a3 : "";
  var DOUBAN_SUBJECT_URL = "https://movie.douban.com/subject/{doubanId}";
  var DOUBAN_API_URL = "https://api.douban.com/v2/movie";
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
  var addToANTPage = (data) => {
    console.log(data);
    $(".header h2").prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
    if (data.summary) {
      const synopsisDom = `
    <div class="box torrent_description">
      <div class="head"><a href="#">\u2191</a>&nbsp;<strong>\u4E2D\u6587\u7B80\u4ECB</strong></div>
      <div class="body" style="text-align:justify">${data.summary}</div>
    </div>`;
      $(".torrent_description,.box_request_desc").after(synopsisDom);
    }
    $(".box_details:first").before(`
    <div class="box box_details">
      <div class="head"><strong></strong>\u7535\u5F71\u4FE1\u606F</div>
      <div class="pad">
        <ul class="stats nobullet">
          <li><strong>\u5BFC\u6F14:</strong> ${data.director}</li>
          <li><strong>\u7C7B\u578B:</strong> ${data.genre}</li>
          <li><strong>\u5236\u7247\u56FD\u5BB6/\u5730\u533A:</strong> ${data.region}</li>
          <li><strong>\u8BED\u8A00:</strong> ${data.language}</li>
          <li><strong>\u65F6\u957F:</strong> ${data.runtime}</li>
          <li><strong>\u53C8\u540D:</strong>  ${data.aka}</li
          <li><strong>\u83B7\u5956\u60C5\u51B5:</strong> <br> ${data.awards}</li
      </ul>
      </div>    
    </div>`);
    if (data.average) {
      $(".box.torrent_ratings .body tr").prepend(`<td colspan="1">
      <center>
        <a target="_blank" class="rating ant" href="${data.link}" rel="noreferrer">
          <div style="font-size: 0;">
            <span class="icon-pt1">\u8C46</span>
          </div>
        </a>
      </center>
    </td>
    <td>
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
  var getTvSeasonData = async (data) => {
    var _a4, _b3;
    const torrentTitle = getTorrentTitle();
    const {episodes = "", chineseTitle} = data;
    if (episodes) {
      const seasonNumber = (_b3 = (_a4 = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)) == null ? void 0 : _a4[1]) != null ? _b3 : 1;
      if (parseInt(seasonNumber) === 1) {
        return data;
      } else {
        const query = `${chineseTitle} \u7B2C${seasonNumber}\u5B63`;
        const params = encodeURI("apikey=0ab215a8b1977939201640fa14c66bab");
        const searchData = await fetch(`${DOUBAN_API_URL}/search?q=${query}`, {
          data: params,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        if (searchData.count > 0) {
          return {id: searchData.subjects[0].id};
        }
      }
    }
  };
  var getDoubanInfo = async (doubanId, imdbId) => {
    try {
      const url = DOUBAN_SUBJECT_URL.replace("{doubanId}", doubanId);
      const data = await fetch(url, {
        responseType: "text"
      });
      if (data) {
        const doubanInfo = await formatDoubanInfo(data);
        const savedIds = GM_getValue("ids") || {};
        savedIds[imdbId] = __assign({
          doubanId,
          updateTime: Date.now()
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
  var getDoubanInfoByIMDB = async (imdbId) => {
    var _a4, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    try {
      const params = encodeURI("apikey=0ab215a8b1977939201640fa14c66bab");
      const doubanData = await fetch(`${DOUBAN_API_URL}/imdb/${imdbId}`, {
        data: params,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const {title, attrs = {}, image, summary, rating, alt_title: altTitle, mobile_link: mobileLink} = doubanData;
      let chineseTitle = title;
      const isChineseReg = /[\u4e00-\u9fa5]+/;
      if (!isChineseReg.test(title) && !title.match(/^\d+$/)) {
        if (altTitle) {
          chineseTitle = altTitle.split("/")[0].trim();
        } else {
          chineseTitle = title;
        }
      }
      const subjectLink = mobileLink.replace("m.douban.com/movie", "movie.douban.com").replace(/\/$/, "");
      const doubanId = (_b3 = (_a4 = subjectLink.match(/subject\/(\d+)/)) == null ? void 0 : _a4[1]) != null ? _b3 : "";
      const awards = await getAwardInfo(subjectLink);
      const doubanInfo = {
        director: (_c = attrs.director) == null ? void 0 : _c.join(" / "),
        runtime: (_d = attrs.movie_duration) == null ? void 0 : _d.join(" / "),
        language: (_e = attrs.language) == null ? void 0 : _e.join(" / "),
        genre: (_g = (_f = attrs.movie_type) == null ? void 0 : _f.join(" / ")) != null ? _g : "",
        aka: altTitle || "",
        region: (_h = attrs.country) == null ? void 0 : _h.join(" / "),
        link: subjectLink,
        poster: image,
        summary,
        chineseTitle,
        votes: rating.numRaters,
        average: rating.average,
        awards,
        id: (_j = (_i = subjectLink.match(/subject\/(\d+)/)) == null ? void 0 : _i[1]) != null ? _j : "",
        episodes: (_l = (_k = attrs.episodes) == null ? void 0 : _k.join(" / ")) != null ? _l : ""
      };
      if (!attrs.episodes) {
        const savedIds = GM_getValue("ids") || {};
        savedIds[imdbId] = __assign({
          doubanId,
          updateTime: Date.now()
        }, doubanInfo);
        GM_setValue("ids", savedIds);
      }
      return doubanInfo;
    } catch (error) {
      console.log(error);
    }
  };
  var getAwardInfo = async (doubanLink) => {
    var _a4;
    const awardsPage = await fetch(`${doubanLink}/awards/`, {
      responseType: "text"
    });
    const awardsDoc = new DOMParser().parseFromString(awardsPage, "text/html");
    const awards = $("#content > div > div.article", awardsDoc).html().replace(/[ \n]/g, "").replace(/<\/li><li>/g, "</li> <li>").replace(/<\/a><span/g, "</a> <span").replace(/<(div|ul)[^>]*>/g, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/ +\n/g, "\n").trim();
    return (_a4 = awards == null ? void 0 : awards.replace(/\n/g, "<br>")) != null ? _a4 : "";
  };
  var formatDoubanInfo = async (domString) => {
    var _a4, _b3;
    const dom = new DOMParser().parseFromString(domString, "text/html");
    const chineseTitle = $("title", dom).text().replace("(\u8C46\u74E3)", "").trim();
    const jsonData = JSON.parse($('head > script[type="application/ld+json"]', dom).html().replace(/(\r\n|\n|\r|\t)/gm, ""));
    const fetchAnchor = function(anchor) {
      var _a5, _b4, _c, _d;
      return (_d = (_c = (_b4 = (_a5 = anchor == null ? void 0 : anchor[0]) == null ? void 0 : _a5.nextSibling) == null ? void 0 : _b4.nodeValue) == null ? void 0 : _c.trim()) != null ? _d : "";
    };
    const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
    const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
    const director = jsonData.director ? jsonData.director : [];
    const poster = jsonData.image.replace(/s(_ratio_poster|pic)/g, "l$1").replace(/img\d/, "img9");
    const link = `https://movie.douban.com${jsonData.url}`;
    const introductionDom = $('#link-report > span.all.hidden,#link-report-intra > [property="v:summary"], #link-report > [property="v:summary"]', dom);
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
    const awards = await getAwardInfo(link);
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
      awards
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
    if (siteName.match(/(HDT)$/)) {
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
.bigstar50,.bigstar45,.bigstar40,.bigstar35,.bigstar30,.bigstar25,.bigstar20,.bigstar15,.bigstar10,.bigstar05,.bigstar00 {
    display: inline-block;
    *display: inline;
    zoom:1;background: https://ptpimg.me/yze1gz.png) no-repeat;
    background: -webkit-image-set(https://ptpimg.me/yze1gz.png) 1x, url(https://ptpimg.me/n74cjc.png) 2x) no-repeat;
    background: -moz-image-set(https://ptpimg.me/yze1gz.png) 1x, url(https://ptpimg.me/n74cjc.png) 2x) no-repeat;
    background: -o-image-set(https://ptpimg.me/yze1gz.png) 1x, url(https://ptpimg.me/n74cjc.png) 2x) no-repeat;
    background: -ms-image-set(https://ptpimg.me/yze1gz.png) 1x, url(https://ptpimg.me/n74cjc.png) 2x) no-repeat;
    width: 75px;
    height: 15px;
    margin: 1px 0 0 0;
    overflow: hidden
}

.bigstar50+span.rating_num,.bigstar45+span.rating_num,.bigstar40+span.rating_num,.bigstar35+span.rating_num,.bigstar30+span.rating_num,.bigstar25+span.rating_num,.bigstar20+span.rating_num,.bigstar15+span.rating_num,.bigstar10+span.rating_num,.bigstar05+span.rating_num,.bigstar00+span.rating_num {
    font-size: 16px;
    line-height: 1
}

.bigstar50 {
    background-position: 0 0px
}

.bigstar45 {
    background-position: 0 -15px
}

.bigstar40 {
    background-position: 0 -30px
}

.bigstar35 {
    background-position: 0 -45px
}

.bigstar30 {
    background-position: 0 -60px
}

.bigstar25 {
    background-position: 0 -75px
}

.bigstar20 {
    background-position: 0 -90px
}

.bigstar15 {
    background-position: 0 -105px
}

.bigstar10 {
    background-position: 0 -120px
}

.bigstar05 {
    background-position: 0 -135px
}

.bigstar00 {
    background-position: 0 -150px
}

.allstar50,.allstar45,.allstar40,.allstar35,.allstar30,.allstar25,.allstar20,.allstar15,.allstar10,.allstar05,.allstar00,.rating1-t,.rating15-t,.rating2-t,.rating25-t,.rating3-t,.rating35-t,.rating4-t,.rating45-t,.rating5-t,.rating-t,.starb~.stars5,.starb~.stars4,.starb~.stars3,.starb~.stars2,.starb~.stars1,.collectors .stars5,.collectors .stars4,.collectors .stars3,.collectors .stars2,.collectors .stars1 {
    display: inline-block;
    *display: inline;
    zoom:1;background: url(/f/movie/b8f4c3672ef81106701071831e22422a745d3b74/pics/rating_icons/ic_rating_s.png) no-repeat;
    background: -webkit-image-set(url(/f/movie/b8f4c3672ef81106701071831e22422a745d3b74/pics/rating_icons/ic_rating_s.png) 1x, url(/f/movie/076dc86067c402ced53eee7c09cd45402235733c/pics/rating_icons/ic_rating_s@2x.png) 2x) no-repeat;
    background: -moz-image-set(url(/f/movie/b8f4c3672ef81106701071831e22422a745d3b74/pics/rating_icons/ic_rating_s.png) 1x, url(/f/movie/076dc86067c402ced53eee7c09cd45402235733c/pics/rating_icons/ic_rating_s@2x.png) 2x) no-repeat;
    background: -o-image-set(url(/f/movie/b8f4c3672ef81106701071831e22422a745d3b74/pics/rating_icons/ic_rating_s.png) 1x, url(/f/movie/076dc86067c402ced53eee7c09cd45402235733c/pics/rating_icons/ic_rating_s@2x.png) 2x) no-repeat;
    background: -ms-image-set(url(/f/movie/b8f4c3672ef81106701071831e22422a745d3b74/pics/rating_icons/ic_rating_s.png) 1x, url(/f/movie/076dc86067c402ced53eee7c09cd45402235733c/pics/rating_icons/ic_rating_s@2x.png) 2x) no-repeat;
    width: 55px;
    height: 11px;
    margin: 0 3px 0 0;
    overflow: hidden
}

.status-item .allstar50,.status-item .allstar45,.status-item .allstar40,.status-item .allstar35,.status-item .allstar30,.status-item .allstar25,.status-item .allstar20,.status-item .allstar15,.status-item .allstar10,.status-item .allstar05,.status-item .allstar00,.status-item .rating1-t,.status-item .rating15-t,.status-item .rating2-t,.status-item .rating25-t,.status-item .rating3-t,.status-item .rating35-t,.status-item .rating4-t,.status-item .rating45-t,.status-item .rating5-t,.status-item .rating-t,.status-item .starb~.stars5,.status-item .starb~.stars4,.status-item .starb~.stars3,.status-item .starb~.stars2,.status-item .starb~.stars1,.status-item .collectors .stars5,.status-item .collectors .stars4,.status-item .collectors .stars3,.status-item .collectors .stars2,.status-item .collectors .stars1 {
    margin: 0 0 0 4px
}

.allstar50 {
    background-position: 0 0px
}

.allstar45 {
    background-position: 0 -11px
}

.allstar40 {
    background-position: 0 -22px
}

.allstar35 {
    background-position: 0 -33px
}

.allstar30 {
    background-position: 0 -44px
}

.allstar25 {
    background-position: 0 -55px
}

.allstar20 {
    background-position: 0 -66px
}

.allstar15 {
    background-position: 0 -77px
}

.allstar10 {
    background-position: 0 -88px
}

.allstar05 {
    background-position: 0 -99px
}

.allstar00 {
    background-position: 0 -110px
}

.rating5-t,.starb~.stars5,.collectors .stars5 {
    background-position: 0 0px
}

.rating45-t {
    background-position: 0 -11px
}

.rating4-t,.starb~.stars4,.collectors .stars4 {
    background-position: 0 -22px
}

.rating35-t {
    background-position: 0 -33px
}

.rating3-t,.starb~.stars3,.collectors .stars3 {
    background-position: 0 -44px
}

.rating25-t {
    background-position: 0 -55px
}

.rating2-t,.starb~.stars2,.collectors .stars2 {
    background-position: 0 -66px
}

.rating15-t {
    background-position: 0 -77px
}

.rating1-t,.starb~.stars1,.collectors .stars1 {
    background-position: 0 -88px
}

.rating1-t,.rating15-t,.rating2-t,.rating25-t,.rating3-t,.rating35-t,.rating4-t,.rating45-t,.rating5-t,.rating-t {
    padding-left: 5px
}

#stars {
    font-size: 0;
    vertical-align: text-bottom;
    cursor: pointer
}

#stars a img {
    vertical-align: text-bottom
}

.starstop,.stars {
    margin-right: 5px
}

.starstop {
    float: left
}

.rating_nums,.rating_num {
    color: #e09015;
    font-size: 12px;
    padding: 0 3px
}

.status-item .rating_num {
    font-size: 14px
}

.rating_nums {
    padding-left: 0
}

.star .rating_num {
    color: #e09015;
    padding: 0 5px 0 0
}

#interest_sect {
    overflow: hidden;
    word-wrap: break-word
}

#interest_sectl {
    float: left;
    width: 155px;
    margin: 2px 0 0 0;
    padding: 0 0 0 15px;
    border-left: 1px solid #eaeaea;
    color: #9b9b9b
}

#interest_sectl .rating_wrap {
    padding-bottom: 15px;
    font-size: 12px;
    line-height: 14px
}

#interest_sectl .rating_wrap .rating_logo {
    line-height: 1
}

#interest_sectl .rating_self {
    padding: 0;
    line-height: 2
}

#interest_sectl .rating_self:before,#interest_sectl .rating_self:after {
    content: '';
    display: block;
    clear: both
}

#interest_sectl .rating_self .rating_sum {
    clear: both
}

#interest_sectl .rating_num {
    color: #494949;
    padding: 0;
    min-width: 30%;
    font-size: 28px
}

#interest_sectl .rating_right {
    float: left;
    padding: 10px 0 10px 6px
}

#interest_sectl .rating_right.not_showed {
    padding: 10px 0
}

#interest_sectl .power {
    height: 10px;
    float: left;
    margin: 1px 4px;
    background: #ffd596 none repeat scroll 0 0
}

#interest_sectl .power.color_gray {
    background: #ccc
}

#interest_sectl .rating_per {
    font-size: 11px
}

#interest_sectl .rating_betterthan {
    position: relative;
    padding: 15px 0;
    border-top: 1px solid #eaeaea;
    color: #9b9b9b;
    margin: 0
}

.rating_logo_wrap .content {
    display: inline-block;
    *display: inline;
    zoom:1;vertical-align: top;
    font-size: 12px;
    line-height: 20px;
    color: #9b9b9b;
    margin-right: 4px
}

.rating_helper_wrap {
    display: inline-block;
    *display: inline;
    zoom:1;vertical-align: top;
    position: relative;
    line-height: 18px
}

.rating_helper_wrap:hover .rating_helper_icon {
    background-position: 0 -12px
}

.rating_helper_wrap:hover .rating_helper_content {
    display: block
}

.rating_helper_icon {
    background: url(/f/movie/16305b59f6b69b8acde51c880de2a5b6cde0155a/pics/icon/ic_qmark.png) no-repeat;
    background: -webkit-image-set(url(/f/movie/16305b59f6b69b8acde51c880de2a5b6cde0155a/pics/icon/ic_qmark.png) 1x, url(/f/movie/1fb4f85391f82c3286d7318d840577daae1c2eee/pics/icon/ic_qmark@2x.png) 2x) no-repeat;
    background: -moz-image-set(url(/f/movie/16305b59f6b69b8acde51c880de2a5b6cde0155a/pics/icon/ic_qmark.png) 1x, url(/f/movie/1fb4f85391f82c3286d7318d840577daae1c2eee/pics/icon/ic_qmark@2x.png) 2x) no-repeat;
    background: -o-image-set(url(/f/movie/16305b59f6b69b8acde51c880de2a5b6cde0155a/pics/icon/ic_qmark.png) 1x, url(/f/movie/1fb4f85391f82c3286d7318d840577daae1c2eee/pics/icon/ic_qmark@2x.png) 2x) no-repeat;
    background: -ms-image-set(url(/f/movie/16305b59f6b69b8acde51c880de2a5b6cde0155a/pics/icon/ic_qmark.png) 1x, url(/f/movie/1fb4f85391f82c3286d7318d840577daae1c2eee/pics/icon/ic_qmark@2x.png) 2x) no-repeat;
    display: inline-block;
    *display: inline;
    zoom:1;vertical-align: middle;
    width: 12px;
    height: 12px
}

.rating_helper_content {
    z-index: 10;
    color: #494949;
    display: none;
    position: absolute;
    left: 12px;
    bottom: 3px;
    width: 96px;
    background: #fef6e9;
    border: 1px solid #e3d9ca;
    padding: 8px 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1)
}

.rating_content_wrap {
    width: 110%;
    padding-bottom: 8px
}

.rating_content_wrap .rating_avg {
    float: left;
    font-size: 16px;
    line-height: 28px;
    color: #494949;
    margin-right: 12px
}

.rating_content_wrap .friends {
    float: left;
    margin-right: 6px
}

.rating_content_wrap .avatar {
    float: left;
    margin-top: 6px;
    margin-right: 2px;
    line-height: 0;
    border-radius: 50%;
    overflow: hidden;
    cursor: default
}

.rating_content_wrap .avatar img {
    width: 16px
}

.rating_content_wrap .friends_count {
    float: left;
    line-height: 14px;
    margin-top: 7px
}

#screening .subject-rate {
    color: #e09015;
    font-size: 12px;
    margin-left: 2px
}

#screening .rating {
    display: inline-block;
    *display: inline;
    zoom:1;margin: 4px auto 2px;
    height: 19px
}

#screening .rating span {
    float: left
}

#screening .rating .rating-star {
    margin: 3px 3px 0 0;
    width: 55px
}

span.subject-rate,.rate,.subject-rating {
    color: #e09015
}

img.rating {
    vertical-align: text-bottom
}

img.rating:nth-child(1) {
    padding-left: 10px
}

.rec-list .score {
    color: #e09015
}

.album-item .star {
    line-height: 1;
    margin-top: 6px
}

.album-item .star .allstar50,.album-item .star .allstar45,.album-item .star .allstar40,.album-item .star .allstar35,.album-item .star .allstar30,.album-item .star .allstar25,.album-item .star .allstar20,.album-item .star .allstar15,.album-item .star .allstar10,.album-item .star .allstar05,.album-item .star .allstar00 {
    float: left
}

.album-item .star .score {
    color: #e09015
}

.game-ratings strong {
    margin: 0 6px;
    color: #e09015
}

.link-subject .rate-more span {
    font-size: 10px;
    color: #e09015
}

.rating-controversy-reason {
    background-color: #FFFBF4;
    color: #494949;
    line-height: 14px;
    margin: 15px 0px 0px 0px;
    padding: 6px 20px 6px 35px;
    font-size: 11px;
    position: relative
}

.rating-controversy-reason:before {
    content: '';
    display: block;
    width: 14px;
    height: 14px;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background-image: url("data:image/svg+xml, %3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M8%200a8%208%200%20110%2016A8%208%200%20018%200zm0%2010.667a1%201%200%20100%202%201%201%200%20000-2zm0-8a1.207%201.207%200%2000-1.2%201.326l.467%204.677a.737.737%200%20001.466%200l.468-4.677A1.207%201.207%200%20008%202.667z%22%20fill%3D%22%23B2B2B2%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
    background-size: contain
}

body #douban-wrapper {
    width: 770px;
    height: 345px;
    margin: 0;
    font: 12px Helvetica,Arial,sans-serif
}

#douban-wrapper .ll {
    float: left
}

#douban-wrapper .col-container .fix-col {
    float: left
}

#douban-wrapper #content {
    background-repeat: no-repeat;
    padding: 10px;
    width: 750px;
    height: 325px;
    min-height: initial
}

#douban-wrapper #content h1 {
    font-size: 20px
}

#douban-wrapper #content .grid {
    width: 750px;
    height: 325px;
    border-radius: 9px
}

#douban-wrapper #content .grid .grid-col1 {
    width: 225px
}

#douban-wrapper #content .grid .grid-col2 {
    width: 254px;
    padding: 24px 18px;
    height: 277px;
    overflow: hidden
}

#douban-wrapper #content .grid .grid-col3 {
    width: 18px
}

#douban-wrapper #content .grid .grid-col4 {
    font-size: 14px;
    padding: 27px 14px 0 12px;
    width: 190px
}

#douban-wrapper #content .picture-douban-wrapper{
    width: 225px;
    height: 325px;
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
    background-size: cover;
    background-position: center
}

#douban-wrapper #content .main-title h1,#douban-wrapper #content .sub-title h2 {
    overflow: hidden;
    word-break: break-all;
    max-height: 2.5em;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}

#douban-wrapper #content .main-title h1 {
    font-weight: 500;
    font-size: 30px;
    color: #000000
}

#douban-wrapper #content .sub-title {
    margin-top: 9px
}

#douban-wrapper #content .sub-title h2 {
    font-size: 18px;
    color: #ADADAD;
    font-weight: normal
}

#douban-wrapper #content .baseinfo {
    font-size: 16px;
    color: #000000;
    line-height: 25px;
    margin-top: 18px;
    letter-spacing: 1px;
    word-break: break-all;
    font-weight: 400;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical
}

#douban-wrapper #content .line-wrap {
    width: 18px;
    height: 100%;
    position: relative
}

#douban-wrapper #content .line-wrap img {
    width: 100%;
    height: 100%
}

#douban-wrapper #content .douban-icon {
    font-size: 0
}

#douban-wrapper #content .douban-icon>span {
    font-size: 14px;
    display: inline-block;
    text-align: center;
    border: 1px solid #41BE57
}

#douban-wrapper #content .douban-icon .icon-pt1 {
    background-color: #41BE57;
    color: white;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 24px;
    height: 24px;
    line-height: 24px
}

#douban-wrapper #content .douban-icon .icon-pt2 {
    color: #3BA94D;
    background: #FFFFFF;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 69px;
    height: 24px;
    line-height: 24px
}

#douban-wrapper #content .score-container .rating_self {
    margin-top: 15px
}

#douban-wrapper #content .score-container .rating_self .rating_num {
    font-size: 48px;
    line-height: 1;
    padding: 0;
    color: black;
    font-weight: normal
}

#douban-wrapper #content .score-container .rating_self .rating_right {
    float: left;
    padding-left: 10px;
    padding-top: 5px
}

#douban-wrapper #content .score-container .rating_self .rating_right .ll {
    float: none
}

#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum {
    color: #3B3B3B
}

#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:hover,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:visited,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:link {
    color: #3B3B3B;
    background: none
}

#douban-wrapper #content .score-container .ratings-on-weight {
    margin-top: 10px;
    min-weight: 1px
}

#douban-wrapper #content .score-container .ratings-on-weight .item {
    line-height: 1.5
}

#douban-wrapper #content .score-container .ratings-on-weight .item .starstop {
    float: none;
    margin-right: 0;
    color: #3B3B3B
}

#douban-wrapper #content .score-container .ratings-on-weight .item>span,#douban-wrapper #content .score-container .ratings-on-weight .item>div {
    display: inline-block
}

#douban-wrapper #content .score-container .ratings-on-weight .item .power {
    height: 6px;
    background: #FAA032;
    border-radius: 3px;
    vertical-align: middle
}

#douban-wrapper #content .bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between
}

#douban-wrapper #content .bottom-row .rating-betterthan {
    font-size: 14px;
    color: #1C1C1C;
    line-height: 21px;
    width: 117px
}

#douban-wrapper #content .bottom-row .rating-betterthan .number {
    font-size: 14px;
    color: #41BE57
}

#douban-wrapper #content .bottom-row .qr-code {
    width: 64px;
    height: 64px;
    overflow: hidden
}

#douban-wrapper #content .bottom-row .qr-code img {
    width: 100%;
    height: 100%
}

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
.ant .icon-pt1{
    border-radius: 4px;
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
    padding: 0;
    margin: 0
    line-height: normal;
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
        if (!savedIds[imdbId] || savedIds[imdbId] && savedIds[imdbId].updateTime && Date.now() - savedIds[imdbId].updateTime >= 30 * 24 * 60 * 60 * 1e3) {
          let doubanId = "";
          const movieData = await getDoubanInfoByIMDB(imdbId);
          if (!movieData) {
            throw new Error("\u6CA1\u6709\u627E\u5230\u8C46\u74E3\u6761\u76EE");
          }
          const {id = "", episodes = ""} = movieData;
          doubanId = id;
          if (episodes) {
            const tvData = await getTvSeasonData(movieData);
            doubanId = tvData.id;
          }
          if (CURRENT_SITE_NAME.match(/PTP/)) {
            addToPtpPage(movieData);
          } else if (CURRENT_SITE_NAME.match(/ANT/)) {
            addToANTPage(movieData);
          } else {
            createDoubanDom(doubanId, imdbId);
          }
        } else {
          const savedData = savedIds[imdbId];
          if (CURRENT_SITE_NAME.match(/PTP/)) {
            addToPtpPage(savedData);
          } else if (CURRENT_SITE_NAME.match(/ANT/)) {
            addToANTPage(savedData);
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
