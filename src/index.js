import {
  CURRENT_SITE_INFO, CURRENT_SITE_NAME,
} from './const';
import {
  getImdbId, getDoubanId, getTvSeasonData, createDoubanDom,
  getDoubanInfo, addToPtpPage,
} from './common';
import './style.js';
(async () => {
  if (CURRENT_SITE_INFO) {
    const imdbId = getImdbId();
    if (!imdbId) {
      return;
    }
    try {
      const savedIds = GM_getValue('ids') || {};
      if (!savedIds[imdbId] ||
        (savedIds[imdbId] && savedIds[imdbId].updateTime && Date.now() - savedIds[imdbId].updateTime >= 30 * 24 * 60 * 60 * 1000)) {
        let doubanId = '';
        const movieData = await getDoubanId(imdbId);
        if (!movieData) {
          throw new Error('没有找到豆瓣条目');
        }
        const { id = '', season = '' } = movieData;
        doubanId = id;
        if (season) {
          const tvData = await getTvSeasonData(movieData);
          doubanId = tvData.id;
        }
        if (CURRENT_SITE_NAME === 'PTP') {
          getDoubanInfo(doubanId, imdbId).then(doubanData => {
            addToPtpPage(doubanData);
          });
        } else {
          createDoubanDom(doubanId, imdbId);
        }
      } else {
        const savedData = savedIds[imdbId];
        if (CURRENT_SITE_NAME === 'PTP') {
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
