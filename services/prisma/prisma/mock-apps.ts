import { Prisma } from './client'

const apps: Prisma.appCreateInput[] = [
  {
    name: 'home',
    path: '/home',
    mode: 'APPLICATION',
    frame: 'REACT',
    status: 'ACTIVE',
    metadata: {
      development: {
        remoteModule: {
          url: 'http://localhost:3334/home_app/v0.0.1/remoteEntry.js',
          appName: 'home_app',
          remotePath: './App',
        },
      },
    },
  },
  {
    name: 'login',
    path: '/login',
    mode: 'APPLICATION',
    frame: 'VUE',
    status: 'ACTIVE',
    metadata: {
      development: {
        remoteModule: {
          url: 'http://localhost:3335/login_app/v0.0.1/remoteEntry.js',
          appName: 'login_app',
          remotePath: './App',
        },
      },
    },
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    mode: 'APPLICATION',
    frame: 'REACT',
    status: 'ACTIVE',
    metadata: {
      development: {
        remoteModule: {
          url: 'http://localhost:3336/dashboard_app/v0.0.1/remoteEntry.js',
          appName: 'dashboard_app',
          remotePath: './App',
        },
      },
    },
  },
  {
    name: 'dashboard-panel',
    mode: 'COMPONENT',
    frame: 'REACT',
    status: 'ACTIVE',
    metadata: {
      development: {
        remoteModule: {
          url: 'http://localhost:3337/dashboard_panel_app/v0.0.1/remoteEntry.js',
          appName: 'dashboard_panel_app',
          remotePath: './App',
        },
      },
    },
  },
  {
    name: 'dashboard-container',
    mode: 'COMPONENT',
    frame: 'VUE',
    status: 'ACTIVE',
    metadata: {
      development: {
        remoteModule: {
          url: 'http://localhost:3338/dashboard_container_app/v0.0.1/remoteEntry.js',
          appName: 'dashboard_container_app',
          remotePath: './App',
        },
      },
    },
  },
]

export default apps
