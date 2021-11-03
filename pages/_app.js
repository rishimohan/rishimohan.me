import "styles/app.scss";
import "styles/blog.scss";
import MainLayout from "layouts/main";

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
