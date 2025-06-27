import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";
// import { scan } from "react-scan"; // must be imported before React and React DOM
// scan({
//   // Options for react-scan
// enabled: true
//   // You can add more options here if needed
// });
createRoot(document.getElementById("root")!).render(
  <StrictMode>
<Router/>
  </StrictMode>,
);
