import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook as fabFacebook,
  faGithub as fabGithub,
  faInstagram as fabInstagram,
  faSnapchat as fabSnapchat,
  faTiktok as fabTiktok,
  faTwitch as fabTwitch,
  faTwitter as fabTwitter
} from '@fortawesome/free-brands-svg-icons';

import { faCopyright as farCopyright } from '@fortawesome/free-regular-svg-icons';

import {
  faArrowLeft as fasArrowLeft,
  faCamera as fasCamera,
  faChevronLeft as fasChevronLeft,
  faChevronRight as fasChevronRight,
  faHeart as fasHeart,
  faMoon as fasMoon,
  faSearch as fasSearch,
  faSun as fasSun
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library to use them in the app
library.add(
  fasArrowLeft,
  fasCamera,
  fasChevronLeft,
  fasChevronRight,
  farCopyright,
  fabFacebook,
  fabGithub,
  fasHeart,
  fabInstagram,
  fasMoon,
  fasSearch,
  fabSnapchat,
  fasSun,
  fabTiktok,
  fabTwitch,
  fabTwitter
);
