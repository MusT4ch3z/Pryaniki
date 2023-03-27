import { Provider } from "react-redux";
import "./App.css";
import { store } from "./store";
import { Routes, Route, HashRouter } from "react-router-dom";
import Main from "./components/main/main";
import LoginPage from "./components/authentication/LoginPage";
import RequireAuth from "./components/authentication/RequireAuth";

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path={"/login"} element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path={"/"} element={<Main />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default App;
