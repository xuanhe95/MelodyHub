// assets
import { IconKey, IconPlaylist } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconPlaylist
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

// 示例的用户播放列表数据
const userPlaylists = [
  { id: 'playlist1', title: 'Playlist 1', url: 'playlists' },
  { id: 'playlist2', title: 'Playlist 2', url: 'playlists2' }
  // 可以根据需要添加更多的播放列表项
];

// 根据用户播放列表数据生成菜单项
const generatePlaylistMenuItems = () => {
  return userPlaylists.map((playlist) => ({
    id: playlist.id,
    title: playlist.title,
    type: 'item',
    url: playlist.url,
    target: false
  }));
};

const pages = {
  id: 'pages',
  // title: 'PlayLists',
  // caption: 'All Musics',
  type: 'group',
  children: [
    {
      id: 'playlists',
      title: 'Playlists',
      type: 'collapse',
      icon: icons.IconPlaylist,
      url: '/',
      children: generatePlaylistMenuItems()
      // 使用动态生成的播放列表项
    },

    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default pages;
