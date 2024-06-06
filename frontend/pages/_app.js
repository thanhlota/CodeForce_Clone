import "@/styles/globals.css";
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { Provider } from 'react-redux';
import { store } from "@/redux/store"

export default function App({ Component, pageProps }) {
  return (
    <AppCacheProvider {...pageProps}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AppCacheProvider>
  )
}
