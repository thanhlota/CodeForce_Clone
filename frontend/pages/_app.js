import "@/styles/globals.css";
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { wrapper } from "@/redux/store";
import AppHeader from "@/components/common/AppHeader";
import "katex/dist/katex.min.css";
import "@edtr-io/mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";
import "react-quill/dist/quill.snow.css";

const App = ({ Component, pageProps }) => {
  return (
    <AppCacheProvider {...pageProps}>
      <AppHeader />
      <Component {...pageProps} />
    </AppCacheProvider>
  )
}

export default wrapper.withRedux(App);

