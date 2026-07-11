import { useState } from "react";

// ─── 디자인 토큰 ───────────────────────────────────────────
const T = {
  bg: "#F4F7F6", surface: "#FFFFFF", ink: "#101E28",
  sub: "#5B6B75", faint: "#93A2AB", line: "#E3EAE8", star: "#F5B301",
  field: "#C24A14", fieldTint: "#FFF1E8",
};

const CATS = {
  tool:   { label: "새 툴",    color: "#0B9E6E", tint: "#E6F6F0" },
  update: { label: "업데이트", color: "#2D66E0", tint: "#EAF0FC" },
  issue:  { label: "이슈",     color: "#D97706", tint: "#FDF1E0" },
  etc:    { label: "기타",     color: "#7A6FD0", tint: "#F0EEFA" },
};

// ─── SVG 아이콘 (스트로크 기반, 이모지 대체) ─────────────────
const Icon = {
  tool: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z"/></svg>),
  update: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z"/></svg>),
  issue: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1 3-1 4-2 6-1.5 3 0 5 2 5s3.5-2 2-5c2 1 3 3 3 5a5 5 0 0 1-10 0c0-4 3-6 5-11z"/></svg>),
  etc: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11V6a2 2 0 0 0-2-2h-5L9 9H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9l3-3"/><path d="M13 13l6-6 3 3-6 6z"/></svg>),
  chevronLeft: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>),
  chevronRight: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>),
  chevronDown: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>),
  calendar: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>),
  external: (p) => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 17 17 7M8 7h9v9"/></svg>),
  gear: (p) => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>),
  plus: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>),
  x: (p) => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>),
  star: ({ on }) => (<svg width="19" height="19" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2.5l3 6.5 7 .8-5.2 4.8 1.4 6.9L12 17.8l-6.2 3.7 1.4-6.9L2 9.8l7-.8z"/></svg>),
};
const CatIcon = { tool: Icon.tool, update: Icon.update, issue: Icon.issue, etc: Icon.etc };

// ─── 샘플 데이터 ───────────────────────────────────────────
const ITEMS = [
  { id: "t1", top: true, cat: "update", title: "Claude, 대화 중 화면 공유 기능 출시",
    lines: ["데스크톱 앱에서 화면을 실시간으로 보여주며 질문 가능", "코드 리뷰·디자인 피드백 용도로 활용도 높음", "Pro 플랜부터 순차 적용 중"],
    source: "Anthropic Blog", time: "3시간 전", tags: ["Claude", "생산성"], isNew: true },
  { id: "t2", top: true, cat: "tool", title: "무드보드 자동 생성 AI 'Palettra' 공개",
    lines: ["키워드 몇 개로 컬러·이미지 무드보드 생성", "Figma 플러그인 동시 출시", "무료 플랜: 월 10회"],
    source: "Product Hunt", time: "6시간 전", tags: ["디자인", "무드보드", "Figma"], isNew: true },
  { id: "t3", top: true, cat: "issue", title: "EU, 생성형 AI 워터마크 의무화 초안 통과",
    lines: ["AI 생성 이미지·영상에 식별 표시 의무", "2027년 시행 예정, 국내 영향 주목"],
    source: "The Verge", time: "9시간 전", tags: ["규제", "이미지생성"] },
  { id: "t4", top: true, cat: "tool", title: "구글, 영상 편집 AI 'Vids Pro' 베타",
    lines: ["텍스트 프롬프트로 컷 편집·자막 자동화", "유튜브 쇼츠 포맷 자동 변환 지원"],
    source: "Google Blog", time: "12시간 전", tags: ["영상", "구글"] },
  { id: "t5", top: true, cat: "update", title: "ChatGPT, 프로젝트 폴더에 팀 공유 추가",
    lines: ["폴더 단위로 대화·파일을 팀원과 공유", "무료 플랜은 읽기 전용"],
    source: "OpenAI Blog", time: "14시간 전", tags: ["ChatGPT", "생산성"] },

  { id: "r1", cat: "tool", title: "손글씨를 폰트로 바꿔주는 'Inkify' 출시",
    lines: ["손글씨 사진 한 장으로 한글 폰트 생성", "상업용 라이선스는 유료"],
    source: "GeekNews", time: "5시간 전", tags: ["디자인", "폰트"], isNew: true },
  { id: "r2", cat: "tool", title: "회의록 요약 AI 'MinuteMate' 한국어 지원 시작",
    lines: ["줌·구글밋 녹음을 자동 요약", "액션 아이템 추출 기능 포함"],
    source: "AI타임스", time: "8시간 전", tags: ["생산성", "음성"] },
  { id: "r3", cat: "tool", title: "3D 에셋 생성 툴 'Meshy' 4.0 업데이트",
    lines: ["텍스처 품질 대폭 개선", "블렌더 플러그인 정식 지원"],
    source: "TechCrunch", time: "10시간 전", tags: ["디자인", "3D"] },
  { id: "r4", cat: "tool", title: "오픈소스 이미지 업스케일러 신규 릴리즈",
    lines: ["저해상도 이미지를 4배 확대", "로컬 PC에서 무료 실행 가능"],
    source: "Hacker News", time: "11시간 전", tags: ["이미지생성", "오픈소스"] },
  { id: "r5", cat: "update", title: "Gemini, 캘린더 연동 일정 제안 기능",
    lines: ["메일 내용을 읽고 일정 자동 제안", "국내 계정은 순차 적용"],
    source: "Google Blog", time: "7시간 전", tags: ["구글", "생산성"] },
  { id: "r6", cat: "update", title: "Notion AI 데이터베이스 자동 분류 개선",
    lines: ["항목 추가 시 태그 자동 지정", "정확도 개선이 핵심"],
    source: "GeekNews", time: "13시간 전", tags: ["생산성"] },
  { id: "r7", cat: "update", title: "Midjourney 스타일 레퍼런스 v3 적용",
    lines: ["참조 이미지 스타일 유지력 향상", "여러 이미지 혼합 참조 가능"],
    source: "Product Hunt", time: "15시간 전", tags: ["디자인", "이미지생성"] },
  { id: "r8", cat: "issue", title: "미국 AI 저작권 소송 1심 판결 나와",
    lines: ["학습 데이터 사용은 공정 이용으로 판단", "생성물 유사성은 별도 쟁점으로 남음"],
    source: "The Verge", time: "6시간 전", tags: ["저작권", "규제"] },
  { id: "r9", cat: "issue", title: "국내 대기업 3곳, 사내 AI 도입 전면 확대",
    lines: ["문서 작성·번역 업무부터 적용", "내년 전 직군 확대 계획"],
    source: "AI타임스", time: "9시간 전", tags: ["국내", "기업"] },
  { id: "r10", cat: "issue", title: "AI 데이터센터 전력 소비 논쟁 재점화",
    lines: ["신규 데이터센터 전력 수요 급증", "재생에너지 전환 압박 커져"],
    source: "TechCrunch", time: "12시간 전", tags: ["인프라"] },
  { id: "r11", cat: "etc", title: "주간 AI 논문 하이라이트 5편",
    lines: ["영상 생성·경량화 모델 연구가 다수", "링크 모음 제공"],
    source: "Hacker News", time: "16시간 전", tags: ["연구"] },
  { id: "r12", cat: "etc", title: "AI 스타트업 투자 동향 6월 결산",
    lines: ["영상·에이전트 분야에 투자 집중", "국내 투자도 회복세"],
    source: "TechCrunch", time: "18시간 전", tags: ["투자"] },
];

const TRACKER = [
  { name: "Claude", items: [["7.10", "화면 공유 기능 출시"], ["7.02", "메모리 검색 개선"], ["6.24", "모바일 음성 모드 확대"]] },
  { name: "ChatGPT", items: [["7.09", "프로젝트 팀 공유"], ["6.30", "이미지 편집 브러시 추가"]] },
  { name: "Gemini", items: [["7.08", "캘린더 일정 제안"], ["6.27", "Docs 요약 개선"]] },
];

const DEFAULT_SOURCES = [
  { name: "Anthropic Blog", type: "공식 블로그", on: true },
  { name: "OpenAI Blog", type: "공식 블로그", on: true },
  { name: "Google Blog", type: "공식 블로그", on: true },
  { name: "TechCrunch AI", type: "해외 뉴스", on: true },
  { name: "The Verge AI", type: "해외 뉴스", on: true },
  { name: "Product Hunt", type: "신규 툴", on: true },
  { name: "Hacker News", type: "커뮤니티", on: true },
  { name: "GeekNews", type: "커뮤니티 (국내)", on: true },
  { name: "AI타임스", type: "국내 뉴스", on: true },
];

// ─── 작은 부품들 ───────────────────────────────────────────
const Badge = ({ cat }) => {
  const c = CATS[cat], I = CatIcon[cat];
  return (
    <span style={{ background: c.tint, color: c.color }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
      <I />{c.label}
    </span>
  );
};

const NewDot = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold" style={{ color: "#D97706" }}>
    <span style={{ background: "#D97706" }} className="h-1.5 w-1.5 rounded-full" />NEW
  </span>
);

// 태그: 배경은 항상 중립색. 관심 분야로 등록된 태그만 작은 점으로 구분(선택 상태처럼 보이지 않게)
const Tag = ({ name, onTag, isField }) => (
  <button onClick={(e) => { e.stopPropagation(); onTag(name); }}
    style={{ background: "#EEF3F2", color: T.sub }}
    className="rounded-full pl-2.5 pr-3 py-0.5 text-xs font-semibold hover:opacity-70 transition-opacity inline-flex items-center gap-1">
    {isField && <span style={{ background: T.field }} className="h-1.5 w-1.5 rounded-full shrink-0" />}
    #{name}
  </button>
);

const StarBtn = ({ on, onClick, size = 19 }) => (
  <button onClick={(e) => { e.stopPropagation(); onClick(); }}
    aria-label={on ? "저장 해제" : "저장하기"}
    style={{ color: on ? T.star : "#C6D0D6" }}
    className="leading-none transition-transform hover:scale-110 shrink-0">
    <span style={{ display: "inline-block", width: size, height: size }}><Icon.star on={on} /></span>
  </button>
);

const SourceLink = () => (
  <button style={{ color: "#2D66E0" }} className="inline-flex items-center gap-1 text-xs font-bold hover:opacity-70"
    onClick={(e) => e.stopPropagation()}>
    원문 보기<Icon.external />
  </button>
);

// 카드/행 하단 — 구분선 + 좌우 배치 (출처 좌측, 원문 링크 우측)
const MetaLine = ({ source, time }) => (
  <div style={{ borderTop: `1px solid ${T.line}` }} className="pt-2.5 flex items-center justify-between">
    <span style={{ color: T.faint }} className="text-xs font-medium">{source}{time ? ` · ${time}` : ""}</span>
    <SourceLink />
  </div>
);

function Row({ item, expanded, onExpand, saved, toggle, onTag, fields }) {
  return (
    <li>
      <button onClick={onExpand} className="w-full flex items-center justify-between px-5 py-3 gap-3 text-left">
        <span className="flex items-center gap-2.5 min-w-0">
          <span style={{ color: CATS[item.cat].color }} className="shrink-0"><CatIcon.tool /></span>
          <span style={{ color: T.ink }} className="text-sm font-semibold truncate">{item.title}</span>
          {item.isNew && <NewDot />}
        </span>
        <span className="flex items-center gap-3 shrink-0">
          <span style={{ color: T.faint }} className="text-xs hidden md:inline">{item.source}</span>
          <StarBtn on={saved} onClick={toggle} size={16} />
          <span style={{ color: T.faint, display: "inline-flex", transform: expanded ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
            <Icon.chevronDown />
          </span>
        </span>
      </button>
      {expanded && (
        <div className="px-5 pb-4 pl-10 flex flex-col gap-3">
          <ul className="flex flex-col gap-1.5">
            {item.lines.map((l, i) => (
              <li key={i} style={{ color: T.sub }} className="text-sm leading-relaxed flex gap-2">
                <span className="font-bold">·</span>{l}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 flex-wrap">
            {item.tags.map((t) => <Tag key={t} name={t} onTag={onTag} isField={fields.includes(t)} />)}
          </div>
          <MetaLine source={item.source} time={item.time} />
        </div>
      )}
    </li>
  );
}

function Card({ item, hero, saved, toggle, onTag, fields }) {
  const c = CATS[item.cat];
  return (
    <article style={{ background: T.surface, border: `1px solid ${T.line}` }}
      className={`rounded-2xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${hero ? "md:p-7" : ""}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge cat={item.cat} />
        {item.isNew && <NewDot />}
        <span className="ml-auto"><StarBtn on={saved} onClick={toggle} /></span>
      </div>
      <h3 style={{ color: T.ink, letterSpacing: "-0.02em" }}
        className="font-extrabold leading-snug text-xl md:text-2xl">
        {item.title}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {item.lines.map((l, i) => (
          <li key={i} style={{ color: T.sub }} className="text-sm leading-relaxed flex gap-2">
            <span className="font-bold">·</span>{l}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 flex-wrap">
        {item.tags.map((t) => <Tag key={t} name={t} onTag={onTag} isField={fields.includes(t)} />)}
      </div>
      <MetaLine source={item.source} time={item.time} />
    </article>
  );
}

const ListBox = ({ children }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl overflow-hidden">
    {children}
  </div>
);

const SectionTitle = ({ children, note }) => (
  <h2 style={{ color: T.ink }} className="text-sm font-extrabold tracking-wide mb-3">
    {children}{note && <span style={{ color: T.faint }} className="font-semibold"> · {note}</span>}
  </h2>
);

// 통계: 문장이 아닌 독립된 칩
const StatChip = ({ label, value, color }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-xl px-4 py-2.5 flex-1 min-w-[110px]">
    <div style={{ color: color || T.ink }} className="text-lg font-extrabold leading-none">{value}</div>
    <div style={{ color: T.faint }} className="text-xs font-semibold mt-1">{label}</div>
  </div>
);

// ─── 메인 ─────────────────────────────────────────────────
export default function AIRadar() {
  const [view, setView] = useState("today");
  const [tag, setTag] = useState(null);
  const [day, setDay] = useState(0);
  const [showCal, setShowCal] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set(["t2"]));
  const [fields, setFields] = useState(["디자인"]);
  const [showAllField, setShowAllField] = useState(false);
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [newSource, setNewSource] = useState("");

  const toggle = (id) => setSavedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const goTag = (t) => { setTag(t); setView("today"); setExpandedId(null); window.scrollTo(0, 0); };
  const expand = (id) => setExpandedId(expandedId === id ? null : id);
  const toggleField = (t) => setFields((p) => p.includes(t) ? p.filter((f) => f !== t) : [...p, t]);
  const toggleSource = (name) => setSources((p) => p.map((s) => s.name === name ? { ...s, on: !s.on } : s));
  const addSource = () => {
    const name = newSource.trim();
    if (!name || sources.some((s) => s.name === name)) return;
    setSources((p) => [...p, { name, type: "사용자 추가", on: true }]);
    setNewSource("");
  };

  const top5 = ITEMS.filter((i) => i.top);
  const rest = ITEMS.filter((i) => !i.top && !i.tags.some((t) => fields.includes(t)));
  const restByCat = Object.keys(CATS).map((k) => [k, rest.filter((i) => i.cat === k)]).filter(([, l]) => l.length);
  const savedItems = ITEMS.filter((i) => savedIds.has(i.id));
  const tagItems = tag ? ITEMS.filter((i) => i.tags.includes(tag)) : [];
  const allTags = [...new Set(ITEMS.flatMap((i) => i.tags))];

  const rowProps = (it) => ({
    item: it, expanded: expandedId === it.id, onExpand: () => expand(it.id),
    saved: savedIds.has(it.id), toggle: () => toggle(it.id), onTag: goTag, fields,
  });

  return (
    <div style={{ background: T.bg, fontFamily: `'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif`, minHeight: "100vh" }}>
      <style>{`html{scrollbar-gutter:stable;} body{overflow-y:scroll;}`}</style>
      <div className="mx-auto max-w-5xl px-4 md:px-8 pb-16">

        {/* 헤더 */}
        <header className="flex items-center justify-between py-6 gap-3">
          <button onClick={() => { setView("today"); setTag(null); }} style={{ color: T.ink }}
            className="font-extrabold tracking-tight text-lg">
            AI&nbsp;<span style={{ color: "#0B9E6E" }}>RADAR</span>
          </button>
          <nav style={{ background: T.surface, border: `1px solid ${T.line}` }} className="flex rounded-full p-1 text-sm font-bold">
            <button onClick={() => { setView("today"); setTag(null); }}
              style={view === "today" && !tag ? { background: T.ink, color: "#fff" } : { color: T.sub }}
              className="rounded-full px-4 py-1.5 transition-colors">오늘</button>
            <button onClick={() => { setView("saved"); setTag(null); }}
              style={view === "saved" ? { background: T.ink, color: "#fff" } : { color: T.sub }}
              className="rounded-full px-4 py-1.5 transition-colors inline-flex items-center gap-1.5">
              저장한 소식
              <span style={{ background: view === "saved" ? "rgba(255,255,255,.2)" : T.line, color: view === "saved" ? "#fff" : T.sub }}
                className="rounded-full px-1.5 text-[11px] font-extrabold">{savedIds.size}</span>
            </button>
          </nav>
          <button onClick={() => { setView("settings"); setTag(null); }} aria-label="설정"
            style={{ background: view === "settings" ? T.ink : T.surface, color: view === "settings" ? "#fff" : T.sub, border: `1px solid ${view === "settings" ? T.ink : T.line}` }}
            className="rounded-full h-9 w-9 flex items-center justify-center">
            <Icon.gear />
          </button>
        </header>

        {/* ───────── 설정 ───────── */}
        {view === "settings" ? (
          <section className="pt-2">
            <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold mb-6">설정</h1>

            <SectionTitle note="이 분야의 글은 중요도와 상관없이 메인에 모두 표시돼요">관심 분야</SectionTitle>
            <ListBox>
              <div className="p-5">
                <div className="flex gap-2 flex-wrap mb-4">
                  {fields.length === 0 && <span style={{ color: T.faint }} className="text-sm">등록된 관심 분야가 없어요.</span>}
                  {fields.map((f) => (
                    <span key={f} style={{ background: T.fieldTint, color: T.field }}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold">
                      #{f}
                      <button onClick={() => toggleField(f)} className="hover:opacity-60 inline-flex" aria-label={`${f} 제거`}><Icon.x /></button>
                    </span>
                  ))}
                </div>
                <p style={{ color: T.faint }} className="text-xs font-bold mb-2">자동 생성된 태그에서 추가하기</p>
                <div className="flex gap-1.5 flex-wrap">
                  {allTags.filter((t) => !fields.includes(t)).map((t) => (
                    <button key={t} onClick={() => toggleField(t)}
                      style={{ border: `1px dashed ${T.faint}`, color: T.sub }}
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold hover:opacity-70 inline-flex items-center gap-1">
                      <Icon.plus />{t}</button>
                  ))}
                </div>
              </div>
            </ListBox>

            <div className="mt-8">
              <SectionTitle note="끄면 해당 소스에서 수집하지 않아요">정보 소스</SectionTitle>
              <ListBox>
                <ul className="divide-y" style={{ borderColor: T.line }}>
                  {sources.map((s) => (
                    <li key={s.name} className="flex items-center justify-between px-5 py-3.5">
                      <span>
                        <span style={{ color: s.on ? T.ink : T.faint }} className="text-sm font-semibold">{s.name}</span>
                        <span style={{ color: T.faint }} className="text-xs ml-2">{s.type}</span>
                      </span>
                      <button onClick={() => toggleSource(s.name)} aria-label={`${s.name} ${s.on ? "끄기" : "켜기"}`}
                        style={{ background: s.on ? "#0B9E6E" : "#D3DCDA" }}
                        className="relative h-6 w-11 rounded-full transition-colors">
                        <span style={{ left: s.on ? "22px" : "2px" }}
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all shadow-sm" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: `1px solid ${T.line}` }} className="p-4 flex gap-2">
                  <input value={newSource} onChange={(e) => setNewSource(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSource()}
                    placeholder="RSS 소스 이름이나 URL 입력"
                    style={{ border: `1px solid ${T.line}`, color: T.ink }}
                    className="flex-1 rounded-lg px-3 py-2 text-sm outline-none focus:border-current" />
                  <button onClick={addSource} style={{ background: T.ink, color: "#fff" }}
                    className="rounded-lg px-4 text-sm font-bold inline-flex items-center gap-1.5 shrink-0">
                    <Icon.plus />추가
                  </button>
                </div>
              </ListBox>
            </div>

            <div className="mt-8">
              <SectionTitle>자동 갱신</SectionTitle>
              <ListBox>
                <div className="p-5 flex items-center justify-between">
                  <span style={{ color: T.ink }} className="text-sm font-semibold">매일 오전 7시에 새 소식 수집·요약</span>
                  <span style={{ color: T.faint }} className="text-xs">GitHub Actions에서 자동 실행</span>
                </div>
              </ListBox>
            </div>
          </section>

        ) : tag ? (
          /* ───────── 태그별 모아보기 ───────── */
          <section className="pt-2">
            <button onClick={() => setTag(null)} style={{ color: T.sub }} className="text-sm font-bold mb-4">← 오늘로 돌아가기</button>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold">#{tag}</h1>
              <button onClick={() => toggleField(tag)}
                style={fields.includes(tag) ? { background: T.fieldTint, color: T.field } : { border: `1px dashed ${T.faint}`, color: T.sub }}
                className="rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1">
                {fields.includes(tag) ? <><Icon.x />관심 분야에서 제거</> : <><Icon.plus />관심 분야로 추가</>}
              </button>
            </div>
            <p style={{ color: T.sub }} className="text-sm mb-5">'{tag}' 태그가 붙은 글 {tagItems.length}건 · 태그는 AI가 기사 내용을 읽고 자동으로 붙여요</p>
            <ListBox>
              <ul className="divide-y" style={{ borderColor: T.line }}>
                {tagItems.map((it) => <Row key={it.id} {...rowProps(it)} />)}
              </ul>
            </ListBox>
            <div className="mt-6">
              <p style={{ color: T.faint }} className="text-xs font-bold mb-2">다른 태그 둘러보기</p>
              <div className="flex gap-1.5 flex-wrap">
                {allTags.filter((t) => t !== tag).map((t) => <Tag key={t} name={t} onTag={goTag} isField={fields.includes(t)} />)}
              </div>
            </div>
          </section>

        ) : view === "saved" ? (
          /* ───────── 저장한 소식 ───────── */
          <section className="pt-2">
            <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold mb-1">저장한 소식</h1>
            <p style={{ color: T.sub }} className="text-sm mb-6">별표한 글이 날짜와 상관없이 모여요. 눌러서 요점을 다시 볼 수 있어요.</p>
            {savedItems.length === 0 ? (
              <div style={{ background: T.surface, border: `1px dashed ${T.line}`, color: T.faint }}
                className="rounded-2xl p-10 text-center text-sm">아직 저장한 글이 없어요. 별표를 눌러 저장해보세요.</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {savedItems.map((it) => (
                  <Card key={it.id} item={it} saved={savedIds.has(it.id)} toggle={() => toggle(it.id)} onTag={goTag} fields={fields} />
                ))}
              </div>
            )}
          </section>

        ) : (
          /* ───────── 오늘 뷰 ───────── */
          <>
            <section className="pt-2 pb-8">
              {/* 통합 날짜 네비게이션 */}
              <div className="relative flex items-center gap-1 mb-5">
                <div style={{ border: `1px solid ${T.line}`, background: T.surface }} className="inline-flex items-center rounded-full overflow-hidden">
                  <button onClick={() => setDay(1)} disabled={day === 1} aria-label="이전 날짜"
                    style={{ color: day === 1 ? "#D3DCDA" : T.sub }} className="h-9 w-9 flex items-center justify-center">
                    <Icon.chevronLeft />
                  </button>
                  <button onClick={() => setShowCal((v) => !v)}
                    style={{ color: T.ink, borderLeft: `1px solid ${T.line}`, borderRight: `1px solid ${T.line}` }}
                    className="h-9 px-4 text-sm font-extrabold inline-flex items-center gap-1.5">
                    <Icon.calendar />{day === 0 ? "7월 11일 (오늘)" : "7월 10일"}
                  </button>
                  <button onClick={() => setDay(0)} disabled={day === 0} aria-label="다음 날짜"
                    style={{ color: day === 0 ? "#D3DCDA" : T.sub }} className="h-9 w-9 flex items-center justify-center">
                    <Icon.chevronRight />
                  </button>
                </div>
                {day !== 0 && (
                  <button onClick={() => setDay(0)} style={{ color: T.field, border: `1px solid #F3D9C6`, background: T.fieldTint }}
                    className="h-9 rounded-full px-3 text-xs font-bold">오늘로 이동</button>
                )}
                {showCal && (
                  <>
                    <div className="fixed inset-0 z-[9]" onClick={() => setShowCal(false)} />
                    <div style={{ background: T.surface, border: `1px solid ${T.line}` }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-11 left-0 z-10 rounded-2xl p-4 shadow-lg w-72">
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ color: T.faint }} className="opacity-40"><Icon.chevronLeft /></span>
                      <span style={{ color: T.ink }} className="text-sm font-extrabold">2026년 7월</span>
                      <span style={{ color: T.faint }} className="opacity-40"><Icon.chevronRight /></span>
                    </div>
                    <div className="grid grid-cols-7 mb-1">
                      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                        <span key={d} style={{ color: T.faint }} className="text-center text-[11px] font-bold py-1">{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                      {Array.from({ length: 3 }).map((_, i) => <span key={"blank" + i} />)}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const date = i + 1;
                        const hasData = date === 10 || date === 11;
                        const selected = (date === 11 && day === 0) || (date === 10 && day === 1);
                        return (
                          <button key={date} disabled={!hasData}
                            onClick={() => { setDay(date === 11 ? 0 : 1); setShowCal(false); }}
                            style={selected
                              ? { background: T.ink, color: "#fff" }
                              : hasData ? { color: T.ink } : { color: "#D3DCDA" }}
                            className="h-8 w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center">
                            {date}
                          </button>
                        );
                      })}
                    </div>
                    <p style={{ borderTop: `1px solid ${T.line}`, color: T.faint }} className="text-xs mt-3 pt-3">
                      옅은 날짜는 아직 수집 데이터가 없어요 (프로토타입)
                    </p>
                  </div>
                  </>
                )}
              </div>

              {day === 1 ? (
                <div style={{ background: T.surface, border: `1px dashed ${T.line}` }} className="rounded-2xl p-8 text-center">
                  <p style={{ color: T.ink }} className="font-bold mb-1">7월 10일의 소식이 여기에 그대로 보여요</p>
                  <p style={{ color: T.faint }} className="text-sm">모든 날짜의 뉴스는 삭제되지 않고 날짜별로 저장돼요. (프로토타입에는 오늘 데이터만 있음)</p>
                </div>
              ) : (
                <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl p-5 md:p-6">
                  <p style={{ color: T.field }} className="text-xs font-extrabold tracking-wide mb-2">오늘의 브리핑</p>
                  <h1 style={{ color: T.ink, letterSpacing: "-0.02em" }} className="text-xl md:text-2xl font-bold leading-snug mb-4">
                    <span style={{ color: T.field }}>Claude 화면 공유 출시</span>, 디자인 관련 새 툴 4건이 공개됐어요.
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    <StatChip label="총 수집" value="52건" />
                    <StatChip label="오늘의 핫이슈" value="5건" />
                    {fields.map((f) => (
                      <StatChip key={f} label={f} value={`${ITEMS.filter((i) => i.tags.includes(f)).length}건`} color={T.field} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {day === 0 && (
              <>
                <section>
                  <SectionTitle note="가장 화제가 된 소식">오늘의 TOP 5</SectionTitle>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Card item={top5[0]} hero saved={savedIds.has(top5[0].id)} toggle={() => toggle(top5[0].id)} onTag={goTag} fields={fields} />
                    </div>
                    {top5.slice(1).map((it) => (
                      <Card key={it.id} item={it} saved={savedIds.has(it.id)} toggle={() => toggle(it.id)} onTag={goTag} fields={fields} />
                    ))}
                  </div>
                </section>

                {fields.length > 0 && (() => {
                  const fieldItems = ITEMS.filter((i) => i.tags.some((t) => fields.includes(t)));
                  if (!fieldItems.length) return null;
                  const visible = showAllField ? fieldItems : fieldItems.slice(0, 5);
                  return (
                    <section className="mt-10">
                      <SectionTitle note={`중요도와 상관없이 ${fields.join(", ")} 관련 글은 모두 여기 모여요`}>내 관심분야</SectionTitle>
                      <ListBox>
                        <ul className="divide-y" style={{ borderColor: T.line }}>
                          {visible.map((it) => <Row key={it.id} {...rowProps(it)} />)}
                        </ul>
                        {fieldItems.length > 5 && (
                          <button onClick={() => setShowAllField((v) => !v)}
                            style={{ borderTop: `1px solid ${T.line}`, color: T.sub }}
                            className="w-full py-3 text-sm font-bold hover:bg-black/5">
                            {showAllField ? "접기" : `더보기 (${fieldItems.length - 5}건 더)`}
                          </button>
                        )}
                      </ListBox>
                    </section>
                  );
                })()}

                <section className="mt-10">
                  <SectionTitle note="관심 분야로 이미 올라간 글은 제외돼요">그 외 오늘 소식</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {restByCat.map(([key, list]) => {
                      const c = CATS[key], I = CatIcon[key];
                      const isOpen = openCat === key;
                      return (
                        <ListBox key={key}>
                          <button onClick={() => setOpenCat(isOpen ? null : key)}
                            className="w-full flex items-center justify-between px-5 py-4">
                            <span className="flex items-center gap-2.5">
                              <span style={{ color: c.color }}><I /></span>
                              <span style={{ color: T.ink }} className="font-bold text-sm">{c.label}</span>
                              <span style={{ background: c.tint, color: c.color }} className="rounded-full px-2 py-0.5 text-xs font-bold">{list.length}</span>
                            </span>
                            <span style={{ color: T.faint, display: "inline-flex", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                              <Icon.chevronDown />
                            </span>
                          </button>
                          {isOpen && (
                            <ul style={{ borderTop: `1px solid ${T.line}` }} className="divide-y">
                              {list.map((it) => <Row key={it.id} {...rowProps(it)} />)}
                            </ul>
                          )}
                        </ListBox>
                      );
                    })}
                  </div>
                </section>

                <section className="mt-10">
                  <SectionTitle>서비스별 업데이트 트래커</SectionTitle>
                  <div className="grid gap-3 md:grid-cols-3">
                    {TRACKER.map((s) => (
                      <div key={s.name} style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl p-5">
                        <div style={{ color: T.ink }} className="font-extrabold text-sm mb-3">{s.name}</div>
                        <ul className="flex flex-col gap-2.5">
                          {s.items.map(([d, txt], i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span style={{ color: T.faint }} className="font-semibold shrink-0 tabular-nums">{d}</span>
                              <span style={{ color: T.sub }}>{txt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-10">
                  <SectionTitle note="AI가 자동으로 분류한 키워드 · 눌러서 모아보기">태그로 둘러보기</SectionTitle>
                  <div className="flex gap-1.5 flex-wrap">
                    {allTags.map((t) => <Tag key={t} name={t} onTag={goTag} isField={fields.includes(t)} />)}
                  </div>
                </section>
              </>
            )}

            <footer style={{ color: T.faint }} className="mt-12 text-xs text-center">
              매일 오전 7시 자동 갱신 · 모든 소식은 한글로 제공 · 지난 뉴스는 날짜별로 계속 보관
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
