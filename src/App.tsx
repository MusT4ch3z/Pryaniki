import { Provider } from "react-redux";
import "./App.css";
import { store } from "./store";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "./components/main/main";
import LoginPage from "./components/authentication/LoginPage";
import RequireAuth from "./components/authentication/RequireAuth";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path={"/"} element={<Main />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
