import {
  CURRENT_SITE_INFO, CURRENT_SITE_NAME,
} from './const';
import {
  getImdbId, getDoubanId, createDoubanDom,
  getDoubanInfo, addToPtpPage,
} from './common';
import './style.js';
(async () => {
  if (CURRENT_SITE_INFO) {
    const imdbId = getImdbId();
    const doubanId = await getDoubanId(imdbId);
    if (CURRENT_SITE_NAME === 'PTP') {
      getDoubanInfo(doubanId).then(doubanData => {
        addToPtpPage(doubanData);
      });
    } else {
      createDoubanDom(doubanId);
    }
  }
})();
