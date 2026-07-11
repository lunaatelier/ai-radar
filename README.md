# AI RADAR — 배포 가이드

## 1. 압축 풀기
다운받은 `ai-radar.zip`을 원하는 위치에 풀어주세요.

## 2. GitHub에 올리기
터미널에서 압축 푼 폴더로 이동한 뒤:

```bash
cd ai-radar
git init
git add .
git commit -m "AI Radar 첫 배포"
git branch -M main
git remote add origin https://github.com/<본인계정>/ai-radar.git
git push -u origin main
```

(GitHub에서 미리 빈 저장소 `ai-radar`를 하나 만들어두세요 — Create repository, README 체크 해제)

## 3. Vercel에 연결
1. https://vercel.com 로그인 (GitHub 계정으로)
2. "Add New... → Project"
3. 방금 올린 `ai-radar` 저장소 선택 → Import
4. Framework Preset이 자동으로 "Vite"로 잡힐 거예요. 별다른 설정 없이 **Deploy** 클릭
5. 1~2분 뒤 `https://ai-radar-xxxx.vercel.app` 같은 주소가 발급돼요

이 주소를 모바일 브라우저로 열면 바로 테스트할 수 있어요.
홈 화면에 추가하면 앱처럼 아이콘으로도 쓸 수 있어요 (iOS: 공유 → 홈 화면에 추가 / Android: 메뉴 → 홈 화면에 추가).

## 4. 이후 수정 방법
로컬에서 코드 수정 후:
```bash
git add .
git commit -m "수정 내용"
git push
```
푸시하면 Vercel이 자동으로 재배포해요.

## 참고
- 지금 버전은 **샘플 데이터**로 채워진 UI 프로토타입이에요. 실제 뉴스 수집·요약(RSS + NVIDIA API)은 다음 단계예요.
- 로컬에서 미리 보려면: `npm install` 후 `npm run dev`
