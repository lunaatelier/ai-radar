import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 뒤로가기로 복귀 시 예전 화면이 그대로 보이는 걸 방지 (bfcache 복원 시 강제 새로고침)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.location.reload();
});

// 홈 화면에 추가된 standalone 앱은 새로고침 수단이 없고, 백그라운드에서 돌아와도
// 네트워크 재요청 없이 메모리에 있던 화면을 그대로 보여줌 → 다시 보일 때 강제 새로고침
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
if (isStandalone) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
