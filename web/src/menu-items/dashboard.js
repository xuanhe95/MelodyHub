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
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'default',
      title: 'Home',
      type: 'item',
      url: '/home',
      icon: icons.IconHome,
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
      id: 'recommended',
      title: 'Surprise Me',
      type: 'item',
      url: '/recommended',
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
