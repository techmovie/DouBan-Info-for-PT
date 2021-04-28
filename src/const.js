import { PT_SITE } from './config.json';

const CURRENT_SITE_INFO = PT_SITE?.[location.host] ?? '';
const CURRENT_SITE_NAME = CURRENT_SITE_INFO?.siteName ?? '';
const DOUBAN_API_URL = 'https://omit.mkrobot.org/movie/infos';
const DOUBAN_SEARCH_API = 'https://movie.douban.com/j/subject_suggest';
const PIC_URLS = {
  border: 'https://ptpimg.me/zz4632.png',
  icon2x: 'https://ptpimg.me/n74cjc.png',
  icon: 'https://ptpimg.me/yze1gz.png',
  line: 'https://ptpimg.me/e11hb1.png',
};
export {
  CURRENT_SITE_INFO,
  CURRENT_SITE_NAME,
  DOUBAN_API_URL,
  DOUBAN_SEARCH_API,
  PIC_URLS,
};
