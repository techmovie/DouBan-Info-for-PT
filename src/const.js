import { PT_SITE } from './config.json';

const CURRENT_SITE_INFO = PT_SITE?.[location.host] ?? '';
const CURRENT_SITE_NAME = CURRENT_SITE_INFO?.siteName ?? '';
const DOUBAN_API_URL = 'https://omit.mkrobot.org/movie/infos';
const DOUBAN_SEARCH_API = 'https://movie.douban.com/j/subject_suggest';

export {
  CURRENT_SITE_INFO,
  CURRENT_SITE_NAME,
  DOUBAN_API_URL,
  DOUBAN_SEARCH_API,
};
