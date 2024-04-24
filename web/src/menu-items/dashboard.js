// assets
import {
  IconDashboard,
  IconDisc,
  IconPlaylist,
  IconSearch,
  IconMusicQuestion,
  IconMusic,
  IconHome,
  IconMicrophone2
} from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconDisc, IconPlaylist, IconSearch, IconMusicQuestion, IconMusic, IconHome, IconMicrophone2 };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Your Library',
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      url: '/home',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: 'albums',
      title: 'Albums',
      type: 'item',
      url: '/albums',
      icon: icons.IconDisc,
      breadcrumbs: false
    },
    {
      id: 'concert',
      title: 'Concert',
      type: 'item',
      url: '/concert',
      icon: icons.IconMicrophone2,
      breadcrumbs: false
    },
    {
      id: 'charts',
      title: 'Charts',
      type: 'item',
      url: '/charts',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'Surprise me',
      title: 'Surprise me',
      type: 'item',
      url: '/Surprise me',
      icon: icons.IconMusicQuestion,
      breadcrumbs: false
    },
    {
      id: 'search',
      title: 'Search',
      type: 'item',
      url: '/search',
      icon: icons.IconSearch,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
