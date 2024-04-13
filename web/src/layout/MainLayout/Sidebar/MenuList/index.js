// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

import config from '../../../../config.json';
import { useEffect, useState } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

async function generatePlaylistMenuItems() {
  try {
    const tokenObj = JSON.parse(localStorage.getItem('token'));
    const token = tokenObj?.token;

    if (!token) {
      console.error('Token is null');
      return [];
    }

    const requestOptions = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };

    const response = await fetch(`http://${config.server_host}:${config.server_port}/api/playlists`, requestOptions);

    if (!response.ok) {
      console.error('Failed to fetch playlists:', response.statusText);
      return [];
    }

    const userPlaylists = await response.json();

    if (!Array.isArray(userPlaylists)) {
      console.error('Playlists data is not an array');
      return [];
    }

    // 使用 map 的返回值，并直接返回它
    return userPlaylists.map((playlist) => ({
      id: playlist.playlist_id,
      title: playlist.name,
      type: 'item',
      url: `/playlists/${playlist.playlist_id}`,
      target: false
    }));
  } catch (error) {
    console.error('Error during fetching playlists:', error);
    return [];
  }
}

const MenuList = () => {
  const [menuItems, setMenuItems] = useState(menuItem);

  useEffect(() => {
    const updatePlaylistItems = async () => {
      const items = await generatePlaylistMenuItems();
      // Creating a new menuItem object, updating the relevant part with fetched data
      const updatedMenuItems = {
        ...menuItems,
        items: menuItems.items.map((item) => {
          if (item.id === 'pages') {
            return {
              ...item,
              children: item.children.map((child) => {
                if (child.id === 'playlists') {
                  console.log('Updating playlists');
                  return {
                    ...child,
                    children: items
                  };
                } else {
                  return child;
                }
              })
            };
          } else {
            return item;
          }
        })
      };

      setMenuItems(updatedMenuItems); // Update state with the modified menu structure
    };

    updatePlaylistItems();
  }, []);

  // console.log(playlistItems);
  console.log(menuItems);
  // menuItem.items[1].children[0].children[1] = {
  //   id: 'login32',
  //   title: 'Login',
  //   type: 'item',
  //   url: '/pages/login/login3',
  //   target: true
  // }
  console.log(menuItems.items[1].children[0].children);

  const navItems = menuItems.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="left">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
