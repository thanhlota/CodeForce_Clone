import "@/styles/globals.css";
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { Provider } from 'react-redux';
import { store } from "@/redux/store";
import { useEffect } from "react";
import AppHeader from "@/components/common/AppHeader";
import storageHelper from "@/utils/localStorage";
import { initUser } from "@/redux/reducers/user.reducer";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const user = storageHelper.getUser();
    if (user) {
      store.dispatch(initUser(user));
    }
  }, []);

  return (
    <AppCacheProvider {...pageProps}>
      <Provider store={store}>
        <AppHeader />
        <Component {...pageProps} />
      </Provider>
    </AppCacheProvider>
  )
}
