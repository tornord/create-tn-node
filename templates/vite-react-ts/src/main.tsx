import { css, Global } from "@emotion/react";
import { App } from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <>
    <Global
      styles={css`
        :root {
          font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 16px;
          font-weight: 400;
        }

        body {
          margin: 0;
        }
      `}
    />
    <App />
  </>
);
