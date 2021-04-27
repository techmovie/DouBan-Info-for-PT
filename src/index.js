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
    const movieData = await getDoubanId(imdbId);
    let { id, episode = '' } = movieData;
    if (episode) {
      const tvData = await getTvSeasonData(movieData);
      id = tvData.id;
    }
    if (CURRENT_SITE_NAME === 'PTP') {
      getDoubanInfo(id).then(doubanData => {
        addToPtpPage(doubanData);
      });
    } else {
      createDoubanDom(id);
    }
  }
})();
