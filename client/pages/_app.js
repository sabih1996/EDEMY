import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "../store/index";
import { PersistGate } from "redux-persist/integration/react";
import { selectCurrentRoute } from "../store/route/selector";
import "bootstrap/dist/css/bootstrap.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer position="top-center" />
          <TopNav />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
