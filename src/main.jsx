import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// iOS 홈 화면 아이콘/뒤로가기로 복귀 시 예전 화면이 그대로 보이는 걸 방지 (bfcache 복원 시 강제 새로고침)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
