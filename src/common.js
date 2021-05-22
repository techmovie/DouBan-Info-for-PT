import {
  CURRENT_SITE_INFO, PIC_URLS,
  DOUBAN_API_URL, DOUBAN_SEARCH_API, CURRENT_SITE_NAME,
} from './const';
const isChinese = (title) => {
  return /[\u4e00-\u9fa5]+/.test(title);
};
const addToPtpPage = (data) => {
  console.log(data);
  if (isChinese(data.chineseTitle)) {
    $('.page__title').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
  }
  if (data.summary) {
    const synopsisDom = $('#synopsis-and-trailer').clone().attr('id', '');
    synopsisDom.find('#toggletrailer').empty();
    synopsisDom.find('.panel__heading__title').text('中文简介');
    synopsisDom.find('#synopsis').text(data.summary).attr('id', '');
    $('#synopsis-and-trailer').after(synopsisDom);
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
  return /tt\d+/.exec(imdbLink)[0];
};
const getDoubanId = (imdbId) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${DOUBAN_SEARCH_API}?q=${imdbId}`,
      onload (res) {
        try {
          const data = JSON.parse(res.responseText);
          if (data.length > 0) {
            resolve(data[0]);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  });
};
const getTvSeasonData = (data) => {
  const torrentTitle = getTorrentTitle();
  return new Promise((resolve, reject) => {
    const { episode = '', title } = data;
    if (episode) {
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
const getDoubanInfo = (doubanId) => {
  return new Promise((resolve, reject) => {
    try {
      if (doubanId) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${DOUBAN_API_URL}/?sid=${doubanId}&site=douban_movie`,
          onload (res) {
            const data = JSON.parse(res.responseText);
            if (data && data.success) {
              resolve(formatDoubanInfo(data));
            } else {
              console.log('豆瓣数据获取失败');
            }
          },
        });
      } else {
        reject(new Error('豆瓣链接获取失败'));
      }
    } catch (error) {
      console.log(error);
      reject(new Error(error.message));
    }
  });
};

const formatDoubanInfo = (data) => {
  let {
    douban_votes: votes, introduction: summary,
    sid, douban_rating_average: average, chinese_title: title,
    director, genre, region, language, aka, duration: runtime, awards,
  } = data;
  votes = votes || '0';
  average = average || '0.0';
  const link = `https://movie.douban.com/subject/${sid}`;
  return {
    director: director.map(item => item.name),
    runtime,
    language: language ? language?.join(' / ') : '',
    genre: genre?.join(' / ') ?? '',
    aka: aka?.join(' / ') ?? '',
    region: region?.join(' / ') ?? '',
    link,
    summary,
    chineseTitle: title,
    votes,
    average,
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
const createDoubanDom = (doubanId) => {
  const div = document.createElement('div');
  let { doubanContainerDom, insertDomSelector, siteName, poster } = CURRENT_SITE_INFO;
  if (siteName.match(/(HDT|RARBG)$/)) {
    insertDomSelector = $(insertDomSelector).parent();
  }
  $(insertDomSelector).before(doubanContainerDom);
  const doubanLink = `https://movie.douban.com/subject/${doubanId}`;
  GM_xmlhttpRequest({
    url: `${doubanLink}/output_card`,
    method: 'GET',
    onload (res) {
      let htmlData = res.responseText.replace(/wrapper/g, 'douban-wrapper').replace(/<script.+?script>/g, '');
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
      if ($(poster).attr('src')) {
        let posterStyle = $('.picture-douban-wrapper').attr('style');
        posterStyle = posterStyle.replace(/\(.+\)/, `(${$(poster).attr('src')})`);
        $('.picture-douban-wrapper').attr('style', posterStyle);
      }
      $('.douban-dom').click(() => {
        GM_openInTab(doubanLink);
      });
    },
  });
};

export {
  isChinese,
  getImdbId,
  getDoubanInfo,
  addToPtpPage,
  getDoubanId,
  createDoubanDom,
  getTvSeasonData,
};
