// ==UserScript==
// @name         douban-info-for-pt
// @namespace    https://github.com/techmovie/DouBan-Info-for-PT
// @version      1.0.0
// @description  在PT站电影详情页展示部分中文信息
// @author       birdplane
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://beyond-hd.me/torrents/*
// @match        https://blutopia.xyz/torrents/*
// @match        https://asiancinema.me/torrents/*
// @match        https://hdbits.org/details.php?id=*
// @match        https://uhdbits.org/torrents.php?id=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==
(() => {
  var __assign = Object.assign;

  // src/config.json
  var PT_SITE = {
    "beyond-hd.me": {
      url: "https://beyond-hd.me",
      host: "beyond-hd.me",
      siteName: "BHD",
      imdb: '.badge-meta a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: ".movie-wrapper",
      doubanContainerDom: '<div class="douban-dom"></div>'
    },
    "blutopia.xyz": {
      url: "https://blutopia.xyz",
      host: "blutopia.xyz",
      siteName: "BLU",
      imdb: '.badge-user a[href*="imdb.com/title"]:nth-child(1)',
      insertDomSelector: "#main-content .box:first .movie-wrapper .movie-row .movie-heading-box h1",
      doubanContainerDom: '<div class="douban-dom"></div>'
    },
    "filelist.io": {
      url: "https://filelist.io",
      host: "filelist.io",
      siteName: "FL",
      imdb: '.cblock-innercontent div a[href*="imdb.com/title"]:first',
      insertDomSelector: ".cblock-innercontent hr.separator:first",
      doubanContainerDom: '<div class="douban-dom" style="width: 100%;padding-top:20px;"></div>'
    },
    "hd-torrents.org": {
      url: "https://hd-torrents.org",
      host: "hd-torrents.org",
      siteName: "HDT",
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
    "passthepopcorn.me": {
      url: "https://passthepopcorn.me",
      host: "passthepopcorn.me",
      siteName: "PTP",
      siteType: "gazelle",
      imdb: "#imdb-title-link"
    },
    "uhdbits.org": {
      url: "https://uhdbits.org",
      host: "uhdbits.org",
      siteName: "UHD",
      imdb: ".tooltip.imdb_icon",
      insertDomSelector: ".main_column .box:nth-child(1)",
      doubanContainerDom: '<div class="box"><div class="head"><a href="#">\u2191</a>&nbsp;<strong>\u8C46\u74E3</strong></div><div class="body douban-dom"></div></div>'
    }
  };

  // src/const.js
  var _a, _b;
  var CURRENT_SITE_INFO = (_b = (_a = PT_SITE) == null ? void 0 : _a[location.host]) != null ? _b : "";
  var _a2;
  var CURRENT_SITE_NAME = (_a2 = CURRENT_SITE_INFO == null ? void 0 : CURRENT_SITE_INFO.siteName) != null ? _a2 : "";
  var DOUBAN_API_URL = "https://omit.mkrobot.org/movie/infos";
  var DOUBAN_SEARCH_API = "https://movie.douban.com/j/subject_suggest";

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
          var _a3;
          try {
            const data = JSON.parse(res.responseText);
            if (data.length > 0) {
              resolve((_a3 = data[0]) == null ? void 0 : _a3.id);
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
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
              var _a3;
              const data = JSON.parse(res.responseText);
              if (data && ((_a3 = data.data) == null ? void 0 : _a3.id)) {
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
    const iframe = document.createElement("iframe");
    iframe.id = "doubanIframe";
    iframe.width = "770";
    iframe.height = "345";
    iframe.frameborder = "0";
    iframe.scrolling = "no";
    let {doubanContainerDom, insertDomSelector, siteName} = CURRENT_SITE_INFO;
    if (siteName === "HDT") {
      insertDomSelector = $(insertDomSelector).parent();
    }
    $(insertDomSelector).before(doubanContainerDom);
    document.querySelector(".douban-dom").appendChild(iframe);
    iframe.onload = () => {
      GM_xmlhttpRequest({
        url: `https://movie.douban.com/subject/${doubanId}/output_card`,
        method: "GET",
        onload(res) {
          const iframeDocument = doubanIframe.contentWindow.document;
          const headDom = res.responseText.match(/<head>((.|\n)+)<\/head>/)[1];
          const bodyDom = res.responseText.match(/<body>((.|\n)+)<\/body>/)[1];
          iframeDocument.head.insertAdjacentHTML("beforeend", headDom);
          iframeDocument.body.insertAdjacentHTML("beforeend", bodyDom);
        }
      });
    };
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
    justify-content: center;
}
`);

  // src/index.js
  (async () => {
    if (CURRENT_SITE_INFO) {
      const imdbId = getImdbId();
      const doubanId = await getDoubanId(imdbId);
      if (CURRENT_SITE_NAME === "PTP") {
        getDoubanInfo(doubanId).then((doubanData) => {
          addToPtpPage(doubanData);
        });
      } else {
        createDoubanDom(doubanId);
      }
    }
  })();
})();
