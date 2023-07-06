import React, { useEffect } from 'react';
import { createMemoryHistory } from 'history';
import { Router as RootRouter, Routes, Route, Outlet } from 'react-router-dom';
import { reactHooks } from '@micro/hooks';
import sdk from '@micro/sdk';
import './app.less';

interface AppProps {
  app: {
    appName: string;
    path: string;
  }
}

const history = createMemoryHistory({
  initialEntries: [sdk.navigation.currentPathname]
});

const Layout = () => {
  return(
    <>
      <Outlet />
    </>
  )
}

export default function App({ app }: AppProps) {
  const { path } = app;
  const { update, onChange } = reactHooks.useRouter({
    defaultUpdate: { action: history.action, location: history.location }
  });

  useEffect(() => {
    const unbindParent = sdk.navigation.on(({ location }) => {
      if (history.location.pathname !== location.pathname) {
        history.push(location.pathname);
      }
    })
    const unbind = history.listen((update) => {
      const { location } = update;
      onChange(update);
      if (location.pathname !== sdk.navigation.currentPathname) {
        sdk.navigation.push(location.pathname);
      }
    });
    return () => {
      unbindParent();
      unbind();
    };
  }, [onChange]);

  return(
    <RootRouter location={update.location} navigationType={update.action} navigator={history}>
      <Routes>
        <Route path={path} element={<Layout />}>
          <Route path={path} element={<div className="app" onClick={() => history.push(`${path}/app2`)}>home app app1</div>} />
          <Route path={`${path}/app2`} element={<div className="app">home app app2</div>} />
        </Route>
      </Routes>
    </RootRouter>
  )
}
