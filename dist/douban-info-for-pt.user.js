// ==UserScript==
// @name         douban-info-for-pt
// @namespace    https://github.com/techmovie/DouBan-Info-for-PT
// @version      1.1.2
// @description  在PT站电影详情页展示部分中文信息
// @author       birdplane
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://beyond-hd.me/torrents/*
// @match        https://blutopia.xyz/torrents/*
// @match        https://asiancinema.me/torrents/*
// @match        https://hdbits.org/details.php?id=*
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
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      MIT
// ==/UserScript==
(() => {
  var __assign = Object.assign;

  // src/config.json
  var PT_SITE = {
    "asiancinema.me": {
      url: "https://asiancinema.me",
      host: "asiancinema.me",
      siteName: "ACM",
      poster: "img.movie-poster",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: "#main-content .box:first .movie-wrapper .movie-row .movie-heading-box h1",
      doubanContainerDom: '<div class="douban-dom"></div>'
    },
    "beyond-hd.me": {
      url: "https://beyond-hd.me",
      host: "beyond-hd.me",
      siteName: "BHD",
      imdb: '.badge-meta a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: ".movie-wrapper .movie-heading",
      doubanContainerDom: '<div class="douban-dom"></div>'
    },
    "blutopia.xyz": {
      url: "https://blutopia.xyz",
      host: "blutopia.xyz",
      siteName: "BLU",
      poster: "img.movie-poster",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: "#main-content .box:first .movie-wrapper .movie-row .movie-heading-box h1",
      doubanContainerDom: '<div class="douban-dom"></div>'
    },
    "filelist.io": {
      url: "https://filelist.io",
      host: "filelist.io",
      siteName: "FL",
      imdb: '.cblock-innercontent div a[href*="imdb.com/title"]:first',
      poster: 'img[width="300px"][src*="image.tmdb.org"]',
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
      doubanContainerDom: '<tr><td align="left" class="detailsleft">\u8C46\u74E3</td><td valign="top" align="left" class="detailshash douban-dom"></td></tr>'
    },
    "hdbits.org": {
      url: "https://hdbits.org",
      host: "hdbits.org",
      siteName: "HDB",
      imdb: {
        movie: ".contentlayout h1 a",
        tv: "#details .showlinks li:nth-child(2) a"
      },
      insertDomSelector: "#details>tbody>tr:nth-child(2)",
      doubanContainerDom: '<tr><td><div id="l7829483" class="label collapsable" onclick="showHideEl(7829483);(7829483)"><span class="plusminus">- </span>\u8C46\u74E3\u4FE1\u606F</div><div id="c7829483" class="hideablecontent" ><div class="contentlayout douban-dom"></div></td></tr>'
    },
    "karagarga.in": {
      url: "https://karagarga.in",
      host: "karagarga.in",
      siteName: "KG",
      imdb: 'td a[href*="imdb.com/title"]:first',
      insertDomSelector: ".outer h1~table:first",
      doubanContainerDom: '<div class="douban-dom kg" style="width:770px;padding-top:20px;"></div>'
    },
    "passthepopcorn.me": {
      url: "https://passthepopcorn.me",
      host: "passthepopcorn.me",
      siteName: "PTP",
      siteType: "gazelle",
      imdb: "#imdb-title-link"
    },
    "privatehd.to": {
      url: "https://privatehd.to",
      host: "privatehd.to'",
      siteName: "PHD",
      imdb: '.movie-details .badge-extra a[href*="imdb.com/title"]:first',
      poster: ".movie-poster img",
      insertDomSelector: ".movie-title",
      doubanContainerDom: '<div class="douban-dom" style="justify-content: flex-start;"></div>'
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
    "www.rarbgmirror.com": {
      url: "https://www.rarbgmirror.com",
      host: "www.rarbgmirror.com",
      siteName: "RARBG",
      poster: "td.header2:contains(Poster) ~ td img",
      imdb: '.lista a[href*="imdb.com/title"]:first',
      insertDomSelector: "td.header2:contains(Poster)",
      doubanContainerDom: '<tr><td align="right" class="header2" valign="top">\u8C46\u74E3</td><td class="lisaa douban-dom"></td></tr>'
    }
  };

  // src/const.js
  var host = location.host;
  var _a, _b;
  var siteInfo = (_b = (_a = PT_SITE) == null ? void 0 : _a[host]) != null ? _b : "";
  var _a2, _b2;
  if (host && host.match(/rarbg/i)) {
    siteInfo = PT_SITE["www.rarbgmirror.com"];
  } else {
    siteInfo = (_b2 = (_a2 = PT_SITE) == null ? void 0 : _a2[host]) != null ? _b2 : "";
  }
  var CURRENT_SITE_INFO = siteInfo;
  var _a3;
  var CURRENT_SITE_NAME = (_a3 = CURRENT_SITE_INFO == null ? void 0 : CURRENT_SITE_INFO.siteName) != null ? _a3 : "";
  var DOUBAN_API_URL = "https://omit.mkrobot.org/movie/infos";
  var DOUBAN_SEARCH_API = "https://movie.douban.com/j/subject_suggest";
  var PIC_URLS = {
    border: "https://ptpimg.me/zz4632.png",
    icon2x: "https://ptpimg.me/n74cjc.png",
    icon: "https://ptpimg.me/yze1gz.png",
    line: "https://ptpimg.me/e11hb1.png"
  };

  // src/common.js
  var isChinese = (title) => {
    return /[\u4e00-\u9fa5]+/.test(title);
  };
  var addToPtpPage = (data) => {
    console.log(data);
    if (isChinese(data.chineseTitle)) {
      $(".page__title").prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
    }
    if (data.summary) {
      const synopsisDom = $("#synopsis-and-trailer").clone().attr("id", "");
      synopsisDom.find("#toggletrailer").empty();
      synopsisDom.find(".panel__heading__title").text("\u4E2D\u6587\u7B80\u4ECB");
      synopsisDom.find("#synopsis").text(data.summary).attr("id", "");
      $("#synopsis-and-trailer").after(synopsisDom);
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
    return /tt\d+/.exec(imdbLink)[0];
  };
  var getDoubanId = (imdbId) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${DOUBAN_SEARCH_API}?q=${imdbId}`,
        onload(res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data.length > 0) {
              resolve(data[0]);
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
  };
  var getTvSeasonData = (data) => {
    const {titleDom} = CURRENT_SITE_INFO;
    const torrentTitle = $(titleDom).text();
    return new Promise((resolve, reject) => {
      var _a4, _b3;
      const {episode = "", title} = data;
      if (episode) {
        const seasonNumber = (_b3 = (_a4 = torrentTitle.match(/S(?!eason)?0?(\d+)\.?(EP?\d+)?/i)) == null ? void 0 : _a4[1]) != null ? _b3 : 1;
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
  var getDoubanInfo = (doubanId) => {
    return new Promise((resolve, reject) => {
      try {
        if (doubanId) {
          GM_xmlhttpRequest({
            method: "GET",
            url: `${DOUBAN_API_URL}/${doubanId}`,
            onload(res) {
              var _a4;
              const data = JSON.parse(res.responseText);
              if (data && ((_a4 = data.data) == null ? void 0 : _a4.id)) {
                resolve(formatDoubanInfo(data.data));
              } else {
                console.log("\u8C46\u74E3\u6570\u636E\u83B7\u53D6\u5931\u8D25");
              }
            }
          });
        } else {
          reject(new Error("\u8C46\u74E3\u94FE\u63A5\u83B7\u53D6\u5931\u8D25"));
        }
      } catch (error) {
        console.log(error);
        reject(new Error(error.message));
      }
    });
  };
  var formatDoubanInfo = (data) => {
    let {title, votes, average, originalTitle} = data;
    if (originalTitle !== title) {
      title = title.replace(originalTitle, "").trim();
    }
    votes = votes || "0";
    average = average || "0.0";
    return __assign(__assign({}, data), {
      chineseTitle: title,
      votes,
      average
    });
  };
  var createDoubanDom = (doubanId) => {
    const div = document.createElement("div");
    let {doubanContainerDom, insertDomSelector, siteName, poster} = CURRENT_SITE_INFO;
    if (siteName.match(/(HDT|RARBG)$/)) {
      insertDomSelector = $(insertDomSelector).parent();
    }
    $(insertDomSelector).before(doubanContainerDom);
    const doubanLink = `https://movie.douban.com/subject/${doubanId}`;
    GM_xmlhttpRequest({
      url: `${doubanLink}/output_card`,
      method: "GET",
      onload(res) {
        let htmlData = res.responseText.replace(/wrapper/g, "douban-wrapper").replace(/<script.+?script>/g, "");
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
        if ($(poster).attr("src")) {
          let posterStyle = $(".picture-douban-wrapper").attr("style");
          posterStyle = posterStyle.replace(/\(.+\)/, `(${$(poster).attr("src")})`);
          $(".picture-douban-wrapper").attr("style", posterStyle);
        }
        $(".douban-dom").click(() => {
          GM_openInTab(doubanLink);
        });
      }
    });
  };

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
#douban-wrapper h2{
    border:none;
    background-image: none;
}
`);

  // src/index.js
  (async () => {
    if (CURRENT_SITE_INFO) {
      const imdbId = getImdbId();
      const movieData = await getDoubanId(imdbId);
      let {id, episode = ""} = movieData;
      if (episode) {
        const tvData = await getTvSeasonData(movieData);
        id = tvData.id;
      }
      if (CURRENT_SITE_NAME === "PTP") {
        getDoubanInfo(id).then((doubanData) => {
          addToPtpPage(doubanData);
        });
      } else {
        createDoubanDom(id);
      }
    }
  })();
})();
