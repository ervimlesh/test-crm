import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";
import "../src/assets/css/vkStyle.css";

import { store, persistor } from "./redux/store.js";
import { AuthProvider } from "./context/Auth.jsx";
import { FlightDealsProvider } from "./context/FlightDealsContext.jsx";
import { HotelDealsProvider } from "./context/HotelDealsContext.jsx";
import { CtmFlightDealsProvider } from "./context/CtmFlightDealsContext.jsx";
import { AllTeamsProvider } from "./context/AllTeamsContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import "./css/global.css";
import "./css/dashboard.css";
import "./css/media.css";
// Prevent process is undefined error in browser
import process from "process";
import { ShareScreenProvider } from "./context/ShareScreenContext.jsx";
window.process = process;

const root = createRoot(document.getElementById("root"));

root.render(
  <ShareScreenProvider>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketProvider>
          <AuthProvider>
            <AllTeamsProvider>
            <CtmFlightDealsProvider>
              <FlightDealsProvider>
                <HotelDealsProvider>
                  <BrowserRouter
                    future={{
                      v7_startTransition: true,
                      v7_relativeSplatPath: true,
                    }}
                  >
                    <App />
                  </BrowserRouter>
                </HotelDealsProvider>
              </FlightDealsProvider>
            </CtmFlightDealsProvider>
            </AllTeamsProvider>
          </AuthProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </ShareScreenProvider>
);
