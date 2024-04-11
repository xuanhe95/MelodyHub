// assets
import { IconDashboard, IconDisc, IconPlaylist, IconSearch, IconMusicQuestion, IconMusic } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconDisc, IconPlaylist, IconSearch, IconMusicQuestion, IconMusic };

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
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'albums',
      title: 'Albums',
      type: 'item',
      url: '/album',
      icon: icons.IconDisc,
      breadcrumbs: false
    },
    {
      id: 'music',
      title: 'Music',
      type: 'item',
      url: '/albums',
      icon: icons.IconMusic,
      breadcrumbs: false
    },
    {
      id: 'recommanded',
      title: 'Surprise Me',
      type: 'item',
      url: '/recommanded',
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
    },

  ]
};

export default dashboard;
