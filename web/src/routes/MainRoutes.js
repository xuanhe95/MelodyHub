import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
//import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const Index = Loadable(lazy(() => import('views/dashboard/Index')));
const Home = Loadable(lazy(() => import('views/pages/home')));
const Albums = Loadable(lazy(() => import('views/pages/albums')));
const Playlists = Loadable(lazy(() => import('views/pages/playlists')));
const Search = Loadable(lazy(() => import('views/pages/search')));
const Recommended = Loadable(lazy(() => import('views/pages/recommended')));
const Album = Loadable(lazy(() => import('views/pages/album')));
const Concert = Loadable(lazy(() => import('views/pages/concert')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'test',
      element: <Index />
    },
    {
      path: 'concert',
      element: <Concert />
    },
    {
      path: 'home',
      element: <Home />
    },
    {
      path: 'albums',
      element: <Albums />
    },
    {
      path: 'album',
      element: <Album />
    },
    {
      path: 'playlists',
      element: <Playlists />
    },
    {
      path: 'playlists/:id',
      element: <Playlists />
    },
    {
      path: 'search',
      element: <Search />
    },
    {
      path: 'recommended',
      element: <Recommended />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
