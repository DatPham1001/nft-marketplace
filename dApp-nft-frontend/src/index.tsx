import React from "react";
import "./styles/color.css";
import "./styles/font.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/tailwind.css";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
ReactDOM.render(
  <React.StrictMode>
    <MetaMaskUIProvider
      sdkOptions={{
        dappMetadata: {
          name: " Demo "
        },
      }}
    >
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
