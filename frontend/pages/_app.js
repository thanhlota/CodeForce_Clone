import "@/styles/globals.css";
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { wrapper } from "@/redux/store";
import AppHeader from "@/components/common/AppHeader";

const App = ({ Component, pageProps }) => {

  return (
    <AppCacheProvider {...pageProps}>
      <AppHeader />
      <Component {...pageProps} />
    </AppCacheProvider>
  )
}

export default wrapper.withRedux(App);
