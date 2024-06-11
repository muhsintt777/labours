import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
// import { App } from "./App.tsx";
// import { Provider } from "react-redux";
// import { store } from "configs/store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);