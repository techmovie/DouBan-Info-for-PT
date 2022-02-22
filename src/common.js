import {
  CURRENT_SITE_INFO, PIC_URLS,
  DOUBAN_API_URL, DOUBAN_SEARCH_API, CURRENT_SITE_NAME,
} from './const';
const isChinese = (title) => {
  return /[\u4e00-\u9fa5]+/.test(title);
};
const addToPtpPage = (data) => {
  console.log(data);
  $('.page__title').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
  if (data.summary) {
    const synopsisDom = `
    <div class="panel" id="douban-synopsis">
    <div class="panel__heading"><span class="panel__heading__title">中文简介</span></div>
    <div class="panel__body">
          <div id="synopsis">${data.summary}</div>
    </div>
    </div>`;
    $('#synopsis-and-trailer,#request-table').after(synopsisDom);
  }
  $('#movieinfo').before(`
    <div class="panel">
    <div class="panel__heading"><span class="panel__heading__title">电影信息</span></div>
    <div class="panel__body">
    <div><strong>导演:</strong> ${data.director}</div>
    <div><strong>类型:</strong> ${data.genre}</div>
    <div><strong>制片国家/地区:</strong> ${data.region}</div>
    <div><strong>语言:</strong> ${data.language}</div>
    <div><strong>时长:</strong> ${data.runtime}</div>
    <div><strong>又名:</strong>  ${data.aka}</div
    <div><strong>获奖情况:</strong> <br> ${data.awards}</div
    </div>`);
  if (data.average) {
    $('#movie-ratings-table tr').prepend(
    `<td colspan="1" style="width: 152px;">
    <center>
    <a target="_blank" class="rating" href="${data.link}" rel="noreferrer">
    <div style="font-size: 0;min-width: 105px;">
        <span class="icon-pt1">豆</span>
        <span class="icon-pt2">豆瓣评分</span>
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
const getImdbId = () => {
  let imdbLink = '';
  const imdbConfig = CURRENT_SITE_INFO.imdb;
  if (typeof imdbConfig === 'object') {
    try {
      Object.keys(imdbConfig).forEach(key => {
        if ($(`${imdbConfig[key]}`)[0]) {
          imdbLink = $(imdbConfig[key]).attr('href');
          throw new Error('end loop');
        }
      });
    } catch (error) {
      if (error.message !== 'end loop') {
        console.log(error);
      }
    }
  } else {
    imdbLink = $(imdbConfig).attr('href');
  }
  console.log(imdbLink);
  return /tt\d+/.exec(imdbLink)?.[0] ?? '';
};
const getDoubanId = async (imdbId) => {
  try {
    const url = DOUBAN_SEARCH_API.replace('{query}', imdbId);
    const res = await fetch(url, {
      responseType: 'json',
    });
    if (res && res.length > 0 && res[0].id) {
      const { id, title, episode } = res[0];
      return {
        id,
        season: episode,
        title,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
const getTvSeasonData = (data) => {
  const torrentTitle = getTorrentTitle();
  return new Promise((resolve, reject) => {
    const { season = '', title } = data;
    if (season) {
      const seasonNumber = torrentTitle.match(/S(?!eason)?0?(\d+)\.?(EP?\d+)?/i)?.[1] ?? 1;
      if (parseInt(seasonNumber) === 1) {
        resolve(data);
      } else {
        const query = title.replace(/第.+?季/, `第${seasonNumber}季`);
        getDoubanId(query).then(data => {
          resolve(data);
        });
      }
    }
  });
};
const getDoubanInfo = async (doubanId, imdbId) => {
  try {
    const url = DOUBAN_API_URL.replace('{doubanId}', doubanId);
    const data = await fetch(url, {
      responseType: 'text',
    });
    if (data) {
      const doubanInfo = await formatDoubanInfo(data);
      const savedIds = GM_getValue('ids') || {};
      savedIds[imdbId] = {
        doubanId,
        ...doubanInfo,
      };
      GM_setValue('ids', savedIds);
      return doubanInfo;
    } else {
      console.log('豆瓣数据获取失败');
    }
  } catch (error) {
    console.log(error);
  }
};
const formatDoubanInfo = async (domString) => {
  const dom = new DOMParser().parseFromString(domString, 'text/html');
  const chineseTitle = $('title', dom).text().replace('(豆瓣)', '').trim();
  const jsonData = JSON.parse($('head > script[type="application/ld+json"]', dom).html().replace(/(\r\n|\n|\r|\t)/gm, ''));
  const fetchAnchor = function (anchor) {
    return anchor?.[0]?.nextSibling?.nodeValue?.trim() ?? '';
  };
  const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
  const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
  const director = jsonData.director ? jsonData.director : [];
  const poster = jsonData.image
    .replace(/s(_ratio_poster|pic)/g, 'l$1')
    .replace(/img\d/, 'img9');
  const link = `https://movie.douban.com${jsonData.url}`;
  const introductionDom = $('#link-report > span.all.hidden, #link-report > [property="v:summary"]', dom);
  const summary = (
    introductionDom.length > 0 ? introductionDom.text() : '暂无相关剧情介绍'
  ).split('\n').map(a => a.trim()).filter(a => a.length > 0).join('\n'); // 处理简介缩进
  const genre = $('#info span[property="v:genre"]', dom).map(function () { // 类别
    return $(this).text().trim();
  }).toArray(); // 类别
  const language = fetchAnchor($('#info span.pl:contains("语言")', dom));
  const region = fetchAnchor($('#info span.pl:contains("制片国家/地区")', dom)); // 产地
  const runtimeAnchor = $('#info span.pl:contains("单集片长")', dom);
  const runtime = runtimeAnchor[0] ? fetchAnchor(runtimeAnchor) : $('#info span[property="v:runtime"]', dom).text().trim();
  const akaAnchor = $('#info span.pl:contains("又名")', dom);
  let aka = [];
  if (akaAnchor.length > 0) {
    aka = fetchAnchor(akaAnchor).split(' / ').sort(function (a, b) { // 首字(母)排序
      return a.localeCompare(b);
    }).join('/');
    aka = aka.split('/');
  }
  const awardsPage = await fetch(`${link}/awards`, {
    responseType: 'text',
  });
  const awardsDoc = new DOMParser().parseFromString(awardsPage, 'text/html');
  const awards = $('#content > div > div.article', awardsDoc).html()
    .replace(/[ \n]/g, '')
    .replace(/<\/li><li>/g, '</li> <li>')
    .replace(/<\/a><span/g, '</a> <span')
    .replace(/<(div|ul)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim();
  return {
    director: director.map(item => item.name),
    runtime,
    language,
    genre: genre?.join(' / ') ?? '',
    aka: aka?.join(' / ') ?? '',
    region,
    link,
    poster,
    summary,
    chineseTitle,
    votes,
    average: rating,
    awards: awards?.replace(/\n/g, '<br>') ?? '',
  };
};
const getTorrentTitle = () => {
  let { titleDom } = CURRENT_SITE_INFO;
  if (!titleDom) {
    if (CURRENT_SITE_NAME === 'BHD') {
      titleDom = $('.dotborder').find('td:contains(Name)').next('td');
    } else if (CURRENT_SITE_NAME.match(/ACM|BLU/)) {
      const keyMap = {
        Name: 'Name',
        名称: 'Name',
        名稱: 'Name',
      };
      $('#vue+.panel table tr').each((index, element) => {
        const key = $(element).find('td:first').text().replace(/\s|\n/g, '');
        if (keyMap[key]) {
          titleDom = $(element).find('td:last');
        }
      });
    } else if (CURRENT_SITE_NAME === 'UHD') {
      const torrentId = getUrlParam('torrentid');
      const torrentFilePathDom = $(`#files_${torrentId} .filelist_path`);
      const torrentFileDom = $(`#files_${torrentId} .filelist_table>tbody>tr:nth-child(2) td`).eq(0);
      titleDom = torrentFilePathDom || torrentFileDom;
    } else if (CURRENT_SITE_NAME === 'HDT') {
      return document.title.replace(/HD-Torrents.org\s*-/ig, '').trim();
    }
  }
  return $(titleDom).text();
};
const getUrlParam = (key) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  const regArray = location.search.substr(1).match(reg);
  if (regArray) {
    return unescape(regArray[2]);
  }
  return '';
};
const createDoubanDom = async (doubanId, imdbId, doubanInfo) => {
  const div = document.createElement('div');
  let { doubanContainerDom, insertDomSelector, siteName } = CURRENT_SITE_INFO;
  if (siteName.match(/(HDT|RARBG)$/)) {
    insertDomSelector = $(insertDomSelector).parent();
  }
  $(insertDomSelector).before(doubanContainerDom);
  const doubanLink = `https://movie.douban.com/subject/${doubanId}`;

  let htmlData = await fetch(`${doubanLink}/output_card`, {
    responseType: 'text',
  });
  htmlData = htmlData.replace(/wrapper/g, 'douban-wrapper').replace(/<script.+?script>/g, '');
  htmlData = htmlData.replace(/(html,)body,/, '$1');// HDB body样式覆盖
  htmlData = htmlData.replace(/url\(.+?output_card\/border.png\)/g, `url(${PIC_URLS.border})`);
  htmlData = htmlData.replace(/src=.+?output_card\/line\.png/g, `src="${PIC_URLS.line}`);
  htmlData = htmlData.replace(/url\(.+?output_card\/ic_rating_m\.png\)/g, `url(${PIC_URLS.icon})`);
  htmlData = htmlData.replace(/(1x,\s+)url\(.+?output_card\/ic_rating_m@2x\.png\)/g, `$1url(${PIC_URLS.icon2x})`);
  let headDom = htmlData.match(/<head>((.|\n)+)<\/head>/)[1];
  headDom = headDom.replace(/<link.+?>/g, '');
  const bodyDom = htmlData.match(/<body>((.|\n)+)<\/body>/)[1];
  div.insertAdjacentHTML('beforeend', headDom);
  div.insertAdjacentHTML('beforeend', bodyDom);
  $('.douban-dom').append(div).attr('douban-link', doubanLink);
  $('.douban-dom .grid-col4').after(`
  <div class="fix-col grid-col3">
  <div class="line-wrap">
    <img src="https://ptpimg.me/e11hb1.png">
  </div>
  </div>
  <div class="fix-col grid-col5"></div>`);
  const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
  $('.douban-dom .grid-col5').html(`<div class="summary">${doubanData.summary || '暂无简介'}</div>`);
  let posterStyle = $('.picture-douban-wrapper').attr('style');
  posterStyle = posterStyle?.replace(/\(.+\)/, `(${doubanData.poster})`);
  $('.picture-douban-wrapper').attr('style', posterStyle);
  $('.douban-dom').click(() => {
    GM_openInTab(doubanLink);
  });
};
function fetch (url, options = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'json',
      ...options,
      onload: (res) => {
        const { statusText, status, response } = res;
        if (status !== 200) {
          reject(new Error(statusText || status));
        } else {
          resolve(response);
        }
      },
      ontimeout: () => {
        reject(new Error('timeout'));
      },
      onerror: (error) => {
        reject(error);
      },
    });
  });
}
export {
  isChinese,
  getImdbId,
  getDoubanInfo,
  addToPtpPage,
  getDoubanId,
  createDoubanDom,
  getTvSeasonData,
};
