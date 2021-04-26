// eslint-disable-next-line no-unused-vars
import style from './style.js';

const DOUBAN_API_URL = 'https://omit.mkrobot.org/movie/infos';
const DOUBAN_SEARCH_API = 'https://movie.douban.com/j/subject_suggest';
const SITE_LIST = {
  PTP: 'passthepopcorn.me',
  HDB: 'hdbits.org',
};
const getSiteName = () => {
  const hostName = location.host;
  let siteName = '';
  try {
    Object.keys(SITE_LIST).forEach(key => {
      const siteHost = SITE_LIST[key];
      if (siteHost && siteHost === hostName) {
        siteName = key;
      }
    });
    return siteName;
  } catch (error) {
    if (error.message !== 'end loop') {
      console.log(error);
    }
  }
};
const SITE_NAME = getSiteName();
const isHDBShow = SITE_NAME === 'HDB' && !!$('.showlinks')[0];
let imdbLink = null;
if (SITE_NAME === 'PTP') {
  imdbLink = $('#imdb-title-link').attr('href');
}
if (SITE_NAME === 'HDB' && !isHDBShow) {
  imdbLink = $('.contentlayout h1 a').attr('href');
}
if (isHDBShow) {
  imdbLink = $('#details .showlinks li').eq(1).find('a').attr('href');
}

const imdbId = /tt\d+/.exec(imdbLink)[0];
GM_xmlhttpRequest({
  method: 'GET',
  url: `${DOUBAN_SEARCH_API}?q=${imdbId}`,
  onload (res) {
    const data = JSON.parse(res.responseText);
    if (data.length > 0) {
      const doubanId = data[0].id;
      if (isHDBShow) {
        getTvInfo(doubanId);
      } else {
        getMovieInfo(doubanId);
      }
    }
  },
});
const getTvInfo = (tvId) => {
  GM_xmlhttpRequest({
    url: `${DOUBAN_API_URL}/${tvId}`,
    onload (res) {
      const data = JSON.parse(res.responseText);
      addInfoToHdbPage(data.data);
    },
  });
};
const getMovieInfo = (movieId) => {
  GM_xmlhttpRequest({
    url: `${DOUBAN_API_URL}/${movieId}`,
    onload (res) {
      const data = JSON.parse(res.responseText);
      console.log(data);
      if (SITE_NAME === 'PTP') {
        addInfoToPtpPage(data.data);
      }
      if (SITE_NAME === 'HDB') {
        addInfoToHdbPage(data.data);
      }
    },
  });
};
const addInfoToHdbPage = (data) => {
  const infoContent = `
        <tr>
            <td>
                <div id="l7829483" class="label collapsable" onclick="showHideEl(7829483);(7829483)"><span class="plusminus">- </span>豆瓣信息</div>
                <div id="c7829483" class="hideablecontent" >
                    <div class="contentlayout  douban-info">
                        <div class="poster" style="margin-right: 10px;max-width: 300px;">
                            <image src="${data.image}" style="width: 100%;">
                        </div>
                        <div class="detail">
                            <div class="title">
                                <a  target='_blank' href="${data.link}">${data.title}  (${data.year}) </a>
                            </div>
                            <div style="font-size: 0;min-width: 105px;margin-bottom: 20px;">
                                <span class="icon-pt1" >豆</span>
                                <span class="icon-pt2">豆瓣评分</span>
                                <span style="font-size: 18px;font-weight:600;margin-left:10px;">${data.average}</span>
                                <span style="font-size: 14px;">&nbsp;(${data.votes} votes)</span>
                            </div>
                            <div class="movie-detail">
                                <div class="synopsis">
                                    ${data.summary || '暂无简介'}
                                </div>
                                <div class="movieinfo">
                                    <div class="panel">
                                        <div class="panel__body">
                                            <div><strong>导演:</strong> ${data.director}</div>
                                            <div><strong>类型:</strong> ${data.genre}</div>
                                            <div><strong>制片国家/地区:</strong> ${data.region}</div>
                                            <div><strong>语言:</strong> ${data.language}</div>
                                            <div><strong>时长:</strong> ${data.runtime}</div>
                                            <div><strong>又名:</strong>  ${data.aka}</div
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>`;
  if (isHDBShow) {
    $('#details>tbody>tr').eq(2).before(infoContent);
  } else {
    $('#details>tbody>tr').eq(1).before(infoContent);
  }
};
const addInfoToPtpPage = (data) => {
  if (isChinese(data.title)) {
    $('.page__title').prepend(`<a target='_blank' href="${data.link}">[${data.title}] </a>`);
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
const isChinese = (title) => {
  return /[\u4e00-\u9fa5]+/.test(title);
};
