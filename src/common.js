import {
  CURRENT_SITE_INFO,
  DOUBAN_API_URL, DOUBAN_SEARCH_API,
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
            resolve(data[0]?.id);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  });
};
const getDoubanInfo = (doubanId) => {
  return new Promise((resolve, reject) => {
    try {
      if (doubanId) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${DOUBAN_API_URL}/${doubanId}`,
          onload (res) {
            const data = JSON.parse(res.responseText);
            if (data && data.data?.id) {
              resolve(formatDoubanInfo(data.data));
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
  let { title, votes, average, originalTitle } = data;
  if (originalTitle !== title) {
    title = title.replace(originalTitle, '').trim();
  }
  votes = votes || '0';
  average = average || '0.0';
  return {
    ...data,
    chineseTitle: title,
    votes,
    average,
  };
};
const createDoubanDom = (doubanId) => {
  const iframe = document.createElement('iframe');
  iframe.id = 'doubanIframe';
  iframe.width = '770';
  iframe.height = '345';
  iframe.frameborder = '0';
  iframe.scrolling = 'no';
  let { doubanContainerDom, insertDomSelector, siteName } = CURRENT_SITE_INFO;
  if (siteName === 'HDT') {
    insertDomSelector = $(insertDomSelector).parent();
  }
  $(insertDomSelector).before(doubanContainerDom);
  document.querySelector('.douban-dom').appendChild(iframe);
  iframe.onload = () => {
    GM_xmlhttpRequest({
      url: `https://movie.douban.com/subject/${doubanId}/output_card`,
      method: 'GET',
      onload (res) {
        // eslint-disable-next-line no-undef
        const iframeDocument = doubanIframe.contentWindow.document;
        const headDom = res.responseText.match(/<head>((.|\n)+)<\/head>/)[1];
        const bodyDom = res.responseText.match(/<body>((.|\n)+)<\/body>/)[1];
        iframeDocument.head.insertAdjacentHTML('beforeend', headDom);
        iframeDocument.body.insertAdjacentHTML('beforeend', bodyDom);
      },
    });
  };
};

export {
  isChinese,
  getImdbId,
  getDoubanInfo,
  addToPtpPage,
  getDoubanId,
  createDoubanDom,
};
