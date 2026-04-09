import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <>
    <Toaster
      position="top-right"
      containerStyle={{
        zIndex: 99999, // Higher than your modal's 9999
      }}
    />
    <App />
  </>,
);
