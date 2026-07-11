import { useState, useEffect } from "react";

// ─── 디자인 토큰 ───────────────────────────────────────────
const T = {
  bg: "#F4F7F6", surface: "#FFFFFF", ink: "#101E28",
  sub: "#5B6B75", faint: "#64757F", line: "#E3EAE8", star: "#F5B301",
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
  star: ({ on }) => (<svg width="100%" height="100%" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2.5l3 6.5 7 .8-5.2 4.8 1.4 6.9L12 17.8l-6.2 3.7 1.4-6.9L2 9.8l7-.8z"/></svg>),
};
const CatIcon = { tool: Icon.tool, update: Icon.update, issue: Icon.issue, etc: Icon.etc };

// ─── 유틸 ─────────────────────────────────────────────────
const ls = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const kstToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

function timeAgo(iso) {
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return "";
  const h = Math.floor(diff / 3600e3);
  if (h < 1) return `${Math.max(Math.floor(diff / 60e3), 1)}분 전`;
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}
const isNewItem = (iso) => Date.now() - Date.parse(iso) < 6 * 3600e3;
const dateLabel = (d) => {
  const [, m, day] = d.split("-");
  return `${Number(m)}월 ${Number(day)}일${d === kstToday() ? " (오늘)" : ""}`;
};

// ─── 작은 부품들 ───────────────────────────────────────────
const Badge = ({ cat }) => {
  const c = CATS[cat] || CATS.etc, I = CatIcon[cat] || CatIcon.etc;
  return (
    <span style={{ background: c.tint, color: c.color }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 md:py-0.5 text-[13px] md:text-xs font-bold">
      <I />{c.label}
    </span>
  );
};

const NewDot = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold" style={{ color: "#D97706" }}>
    <span style={{ background: "#D97706" }} className="h-1.5 w-1.5 rounded-full" />NEW
  </span>
);

// 태그 칩: 시각 높이 36px(모바일), 버튼 상하 투명 패딩으로 터치 영역 44px 확보.
// 관심 분야 태그는 배경+테두리+글자색을 함께 바꿔 선택 상태를 표시.
const Tag = ({ name, onTag, isField }) => (
  <button onClick={(e) => { e.stopPropagation(); onTag(name); }} className="py-1 -my-1 group">
    <span
      style={isField
        ? { background: T.fieldTint, color: T.field, border: "1px solid #F3D9C6" }
        : { background: "#EEF3F2", color: T.sub, border: "1px solid transparent" }}
      className="inline-flex items-center h-9 md:h-7 rounded-full px-3 text-[13px] leading-[18px] md:text-xs font-semibold group-hover:opacity-70 transition-opacity">
      {name}
    </span>
  </button>
);

// 별 버튼: 아이콘 20px, 터치 영역 40×40px (레이아웃 점유는 -m으로 축소)
const StarBtn = ({ on, onClick, size = 20 }) => (
  <button onClick={(e) => { e.stopPropagation(); onClick(); }}
    aria-label={on ? "저장 해제" : "저장하기"}
    style={{ color: on ? T.star : "#C6D0D6" }}
    className="h-10 w-10 -m-2 flex items-center justify-center transition-transform hover:scale-110 shrink-0">
    <span style={{ width: size, height: size }}><Icon.star on={on} /></span>
  </button>
);

const SourceLink = ({ url }) => url ? (
  <a href={url} target="_blank" rel="noreferrer" style={{ color: "#2D66E0" }}
    className="inline-flex items-center gap-1 text-[13px] leading-[19px] md:text-xs font-bold hover:opacity-70 p-2 -m-2"
    onClick={(e) => e.stopPropagation()}>
    원문 보기<Icon.external />
  </a>
) : null;

// 카드/행 하단 — 구분선 + 좌우 배치 (출처 좌측, 원문 링크 우측)
const MetaLine = ({ source, publishedAt, url }) => (
  <div style={{ borderTop: `1px solid ${T.line}` }} className="pt-2.5 flex items-center justify-between">
    <span style={{ color: T.faint }} className="text-[13px] leading-[19px] md:text-xs font-medium">
      {source}{publishedAt ? ` · ${timeAgo(publishedAt)}` : ""}
    </span>
    <SourceLink url={url} />
  </div>
);

function Row({ item, expanded, onExpand, saved, toggle, onTag, fields }) {
  return (
    <li>
      <button onClick={onExpand} className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 md:py-3 gap-3 text-left">
        <span className="flex items-center gap-2.5 min-w-0">
          <span style={{ color: (CATS[item.cat] || CATS.etc).color }} className="shrink-0"><CatIcon.tool /></span>
          <span style={{ color: T.ink }} className="text-base leading-6 md:text-sm font-semibold truncate">{item.title}</span>
          {isNewItem(item.publishedAt) && <NewDot />}
        </span>
        <span className="flex items-center gap-3 shrink-0">
          <span style={{ color: T.faint }} className="text-xs hidden md:inline">{item.source}</span>
          <StarBtn on={saved} onClick={toggle} size={18} />
          <span style={{ color: T.faint, display: "inline-flex", transform: expanded ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
            <Icon.chevronDown />
          </span>
        </span>
      </button>
      {expanded && (
        <div className="px-4 md:px-5 pb-4 pl-9 md:pl-10 flex flex-col gap-3">
          <ul className="flex flex-col gap-1.5">
            {item.lines.map((l, i) => (
              <li key={i} style={{ color: T.sub }} className="text-sm leading-[21px] md:leading-relaxed flex gap-2">
                <span className="font-bold">·</span>{l}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 flex-wrap">
            {item.tags.map((t) => <Tag key={t} name={t} onTag={onTag} isField={fields.includes(t)} />)}
          </div>
          <MetaLine source={item.source} publishedAt={item.publishedAt} url={item.url} />
        </div>
      )}
    </li>
  );
}

function Card({ item, hero, saved, toggle, onTag, fields }) {
  return (
    <article style={{ background: T.surface, border: `1px solid ${T.line}` }}
      className={`rounded-2xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${hero ? "md:p-7" : ""}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge cat={item.cat} />
        {isNewItem(item.publishedAt) && <NewDot />}
        <span className="ml-auto"><StarBtn on={saved} onClick={toggle} /></span>
      </div>
      <h3 style={{ color: T.ink, letterSpacing: "-0.02em" }}
        className="font-extrabold text-lg leading-6 md:leading-snug">
        {item.title}
      </h3>
      {/* 카드 요약은 2줄 중심 — 3번째 줄부터는 데스크톱에서만 노출 */}
      <ul className="flex flex-col gap-1.5">
        {item.lines.map((l, i) => (
          <li key={i} style={{ color: T.sub }}
            className={`text-sm leading-[21px] md:leading-relaxed gap-2 ${i >= 2 ? "hidden md:flex" : "flex"}`}>
            <span className="font-bold">·</span>{l}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 flex-wrap">
        {item.tags.map((t) => <Tag key={t} name={t} onTag={onTag} isField={fields.includes(t)} />)}
      </div>
      <MetaLine source={item.source} publishedAt={item.publishedAt} url={item.url} />
    </article>
  );
}

const ListBox = ({ children }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl overflow-hidden">
    {children}
  </div>
);

// 섹션 타이틀·설명 두 줄 구조 (모바일 18px, 데스크톱 14px)
const SectionTitle = ({ children, note }) => (
  <div className="mb-3">
    <h2 style={{ color: T.ink }} className="text-lg leading-[26px] md:text-sm md:leading-normal font-extrabold tracking-wide">{children}</h2>
    {note && <p style={{ color: T.faint }} className="text-[13px] leading-[19px] md:text-xs font-semibold mt-0.5">{note}</p>}
  </div>
);

// 통계: 문장이 아닌 독립된 칩
const StatChip = ({ label, value, color }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-xl px-2.5 md:px-4 py-2.5 flex-1 min-w-0 md:min-w-[110px]">
    <div style={{ color: color || T.ink }} className="text-xl md:text-lg font-extrabold leading-none">{value}</div>
    <div style={{ color: T.faint }} className="text-[13px] md:text-xs font-semibold mt-1">{label}</div>
  </div>
);

// ─── 캘린더 ───────────────────────────────────────────────
function Calendar({ dates, selected, onSelect, onClose }) {
  const [ym, setYm] = useState(() => selected.slice(0, 7));
  const [y, m] = ym.split("-").map(Number);
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))].sort();
  const mi = months.indexOf(ym);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const nDays = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const iso = (d) => `${ym}-${String(d).padStart(2, "0")}`;
  return (
    <>
      <div className="fixed inset-0 z-[9]" onClick={onClose} />
      <div style={{ background: T.surface, border: `1px solid ${T.line}` }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 left-0 z-10 rounded-2xl p-4 shadow-lg w-72">
        <div className="flex items-center justify-between mb-3">
          <button disabled={mi <= 0} onClick={() => setYm(months[mi - 1])} aria-label="이전 달"
            style={{ color: T.faint, opacity: mi <= 0 ? 0.3 : 1 }} className="h-10 w-10 -m-2 flex items-center justify-center"><Icon.chevronLeft /></button>
          <span style={{ color: T.ink }} className="text-sm font-extrabold">{y}년 {m}월</span>
          <button disabled={mi >= months.length - 1} onClick={() => setYm(months[mi + 1])} aria-label="다음 달"
            style={{ color: T.faint, opacity: mi >= months.length - 1 ? 0.3 : 1 }} className="h-10 w-10 -m-2 flex items-center justify-center"><Icon.chevronRight /></button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <span key={d} style={{ color: T.faint }} className="text-center text-[11px] font-bold py-1">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: first }).map((_, i) => <span key={"b" + i} />)}
          {Array.from({ length: nDays }).map((_, i) => {
            const d = i + 1, dateStr = iso(d);
            const hasData = dates.includes(dateStr);
            const sel = dateStr === selected;
            return (
              <button key={d} disabled={!hasData}
                onClick={() => { onSelect(dateStr); onClose(); }}
                style={sel ? { background: T.ink, color: "#fff" } : hasData ? { color: T.ink } : { color: "#D3DCDA" }}
                className="h-9 w-9 md:h-8 md:w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center">
                {d}
              </button>
            );
          })}
        </div>
        <p style={{ borderTop: `1px solid ${T.line}`, color: T.faint }} className="text-xs mt-3 pt-3">
          옅은 날짜는 수집 데이터가 없는 날이에요
        </p>
      </div>
    </>
  );
}

// ─── 메인 ─────────────────────────────────────────────────
export default function AIRadar() {
  const [view, setView] = useState("today");
  const [tag, setTag] = useState(null);
  const [showCal, setShowCal] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // 데이터 (public/data/*.json)
  const [dates, setDates] = useState([]);
  const [selDate, setSelDate] = useState(null);
  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ok | error
  const [tracker, setTracker] = useState({});
  const [sourceList, setSourceList] = useState([]);

  // 개인 설정 (localStorage — 로그인 없는 개인용)
  const [savedMap, setSavedMap] = useState(() => ls.get("aiRadar.saved", {}));
  const [fields, setFields] = useState(() => ls.get("aiRadar.fields", ["디자인"]));
  const [hiddenSources, setHiddenSources] = useState(() => ls.get("aiRadar.hiddenSources", []));
  const [showAllField, setShowAllField] = useState(false);

  useEffect(() => { ls.set("aiRadar.saved", savedMap); }, [savedMap]);
  useEffect(() => { ls.set("aiRadar.fields", fields); }, [fields]);
  useEffect(() => { ls.set("aiRadar.hiddenSources", hiddenSources); }, [hiddenSources]);

  useEffect(() => {
    fetch("/data/index.json").then((r) => r.json())
      .then((idx) => {
        const ds = idx.dates || [];
        setDates(ds);
        setSelDate(ds[0] || null);
        if (!ds.length) setLoadState("error");
      })
      .catch(() => setLoadState("error"));
    fetch("/data/tracker.json").then((r) => r.json()).then((t) => setTracker(t.services || {})).catch(() => {});
    fetch("/data/sources.json").then((r) => r.json()).then((s) => setSourceList(s.sources || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selDate) return;
    setLoadState("loading");
    fetch(`/data/${selDate}.json`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoadState("ok"); })
      .catch(() => setLoadState("error"));
  }, [selDate]);

  const toggle = (item) => setSavedMap((p) => {
    const n = { ...p };
    n[item.id] ? delete n[item.id] : (n[item.id] = item);
    return n;
  });
  const goTag = (t) => { setTag(t); setView("today"); setExpandedId(null); window.scrollTo(0, 0); };
  const expand = (id) => setExpandedId(expandedId === id ? null : id);
  const toggleField = (t) => setFields((p) => p.includes(t) ? p.filter((f) => f !== t) : [...p, t]);
  const toggleSource = (name) => setHiddenSources((p) => p.includes(name) ? p.filter((n) => n !== name) : [...p, name]);

  const items = (data?.items || []).filter((i) => !hiddenSources.includes(i.source));
  const top5 = items.filter((i) => i.top);
  const rest = items.filter((i) => !i.top && !i.tags.some((t) => fields.includes(t)));
  const restByCat = Object.keys(CATS).map((k) => [k, rest.filter((i) => i.cat === k)]).filter(([, l]) => l.length);
  const savedItems = Object.values(savedMap).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const tagItems = tag ? items.filter((i) => i.tags.includes(tag)) : [];
  const allTags = [...new Set(items.flatMap((i) => i.tags))];
  // 관심 분야 태그를 앞으로 고정
  const sortedTags = [...allTags].sort((a, b) => (fields.includes(b) ? 1 : 0) - (fields.includes(a) ? 1 : 0));
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 10);

  const di = dates.indexOf(selDate);
  const isLatest = di === 0;

  const rowProps = (it) => ({
    item: it, expanded: expandedId === it.id, onExpand: () => expand(it.id),
    saved: !!savedMap[it.id], toggle: () => toggle(it), onTag: goTag, fields,
  });

  const tabs = [
    { key: "today", label: "오늘의 소식", active: view === "today" && !tag, go: () => { setView("today"); setTag(null); } },
    { key: "saved", label: "저장한 소식", active: view === "saved", count: savedItems.length, go: () => { setView("saved"); setTag(null); } },
  ];
  const TabBtn = ({ t, mobile }) => (
    <button onClick={t.go}
      style={t.active ? { background: T.ink, color: "#fff" } : { color: T.sub, background: T.surface }}
      className={`rounded-full transition-colors inline-flex items-center justify-center gap-1.5
        ${mobile ? "flex-1 h-11 px-4 text-[15px] font-semibold" : "px-4 py-1.5 text-sm font-bold"}`}>
      {t.label}
      {t.count !== undefined && (
        <span style={{ background: t.active ? "rgba(255,255,255,.2)" : T.line, color: t.active ? "#fff" : T.sub }}
          className="h-5 min-w-[20px] px-1 rounded-full inline-flex items-center justify-center text-[11px] font-extrabold">{t.count}</span>
      )}
    </button>
  );

  return (
    <div style={{ background: T.bg, fontFamily: `'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif`, minHeight: "100vh" }}>
      <style>{`html{scrollbar-gutter:stable;} body{overflow-y:scroll;}`}</style>
      <div className="mx-auto max-w-5xl px-4 md:px-8 pb-16">

        {/* 헤더 — 모바일: 로고+설정(56px) / 아래 50:50 풀폭 탭, 데스크톱: 한 줄 */}
        <header className="pt-1 pb-4 md:py-6">
          <div className="flex items-center justify-between gap-3 h-14 md:h-auto">
            <button onClick={tabs[0].go} style={{ color: T.ink }} className="font-extrabold tracking-tight text-2xl md:text-lg">
              AI&nbsp;<span style={{ color: "#0B9E6E" }}>RADAR</span>
            </button>
            <nav style={{ background: T.surface, border: `1px solid ${T.line}` }} className="hidden md:flex rounded-full p-1">
              {tabs.map((t) => <TabBtn key={t.key} t={t} />)}
            </nav>
            <button onClick={() => { setView("settings"); setTag(null); }} aria-label="설정"
              style={{ background: view === "settings" ? T.ink : T.surface, color: view === "settings" ? "#fff" : T.sub, border: `1px solid ${view === "settings" ? T.ink : T.line}` }}
              className="rounded-full h-11 w-11 md:h-9 md:w-9 flex items-center justify-center shrink-0">
              <Icon.gear />
            </button>
          </div>
          <nav style={{ background: T.surface, border: `1px solid ${T.line}` }} className="flex md:hidden gap-1 rounded-full p-1 mt-2">
            {tabs.map((t) => <TabBtn key={t.key} t={t} mobile />)}
          </nav>
        </header>

        {/* ───────── 설정 ───────── */}
        {view === "settings" ? (
          <section className="pt-2">
            <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold mb-6">설정</h1>

            <SectionTitle note="여러 개 등록할 수 있어요 · 이 분야의 글은 중요도와 상관없이 메인에 모두 표시돼요">관심 분야</SectionTitle>
            <ListBox>
              <div className="p-5">
                <div className="flex gap-2 flex-wrap mb-4">
                  {fields.length === 0 && <span style={{ color: T.faint }} className="text-[15px] md:text-sm">등록된 관심 분야가 없어요.</span>}
                  {fields.map((f) => (
                    <span key={f} style={{ background: T.fieldTint, color: T.field, border: "1px solid #F3D9C6" }}
                      className="inline-flex items-center gap-1.5 rounded-full h-9 px-3 text-sm font-bold">
                      {f}
                      <button onClick={() => toggleField(f)} className="hover:opacity-60 inline-flex p-2 -m-1.5" aria-label={`${f} 제거`}><Icon.x /></button>
                    </span>
                  ))}
                </div>
                <p style={{ color: T.faint }} className="text-[13px] md:text-xs font-bold mb-2">자동 생성된 태그에서 추가하기</p>
                <div className="flex gap-2 flex-wrap">
                  {allTags.filter((t) => !fields.includes(t)).map((t) => (
                    <button key={t} onClick={() => toggleField(t)} className="py-1 -my-1 group">
                      <span style={{ border: `1px dashed ${T.faint}`, color: T.sub }}
                        className="inline-flex items-center h-9 md:h-7 rounded-full px-3 text-[13px] md:text-xs font-bold group-hover:opacity-70 gap-1">
                        <Icon.plus />{t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </ListBox>

            <div className="mt-8">
              <SectionTitle note="끄면 화면에서 해당 소스의 글을 숨겨요">정보 소스</SectionTitle>
              <ListBox>
                <ul className="divide-y" style={{ borderColor: T.line }}>
                  {sourceList.map((s) => {
                    const on = !hiddenSources.includes(s.name);
                    return (
                      <li key={s.name} className="flex items-center justify-between px-5 py-3.5">
                        <span>
                          <span style={{ color: on ? T.ink : T.faint }} className="text-[15px] md:text-sm font-semibold">{s.name}</span>
                          <span style={{ color: T.faint }} className="text-[13px] md:text-xs ml-2">{s.type}</span>
                        </span>
                        <button onClick={() => toggleSource(s.name)} aria-label={`${s.name} ${on ? "끄기" : "켜기"}`}
                          style={{ background: on ? "#0B9E6E" : "#D3DCDA" }}
                          className="relative h-6 w-11 rounded-full transition-colors shrink-0">
                          <span style={{ left: on ? "22px" : "2px" }}
                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all shadow-sm" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p style={{ borderTop: `1px solid ${T.line}`, color: T.faint }} className="p-4 text-[13px] md:text-xs leading-[19px]">
                  수집 자체를 중단하거나 새 RSS 소스를 추가하려면 저장소의 <code className="font-bold">public/data/sources.json</code>을 수정하세요. 다음 자동 수집부터 반영돼요.
                </p>
              </ListBox>
            </div>

            <div className="mt-8">
              <SectionTitle>자동 갱신</SectionTitle>
              <ListBox>
                <div className="p-5 flex items-center justify-between gap-3">
                  <span style={{ color: T.ink }} className="text-[15px] md:text-sm font-semibold">매일 오전 7시에 새 소식 수집·요약</span>
                  <span style={{ color: T.faint }} className="text-[13px] md:text-xs text-right">GitHub Actions에서 자동 실행</span>
                </div>
              </ListBox>
            </div>
          </section>

        ) : tag ? (
          /* ───────── 태그별 모아보기 ───────── */
          <section className="pt-2">
            <button onClick={() => setTag(null)} style={{ color: T.sub }} className="text-sm font-bold mb-4 py-2 -my-2">← 오늘의 소식으로 돌아가기</button>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold">#{tag}</h1>
              <button onClick={() => toggleField(tag)}
                style={fields.includes(tag) ? { background: T.fieldTint, color: T.field, border: "1px solid #F3D9C6" } : { border: `1px dashed ${T.faint}`, color: T.sub }}
                className="rounded-full h-9 px-3 text-[13px] md:text-xs font-bold inline-flex items-center gap-1">
                {fields.includes(tag) ? <><Icon.x />관심 분야에서 제거</> : <><Icon.plus />관심 분야로 추가</>}
              </button>
            </div>
            <p style={{ color: T.sub }} className="text-[15px] md:text-sm mb-5">'{tag}' 태그가 붙은 글 {tagItems.length}건 · 태그는 AI가 기사 내용을 읽고 자동으로 붙여요</p>
            <ListBox>
              <ul className="divide-y" style={{ borderColor: T.line }}>
                {tagItems.map((it) => <Row key={it.id} {...rowProps(it)} />)}
              </ul>
            </ListBox>
            <div className="mt-6">
              <p style={{ color: T.faint }} className="text-[13px] md:text-xs font-bold mb-2">다른 태그 둘러보기</p>
              <div className="flex gap-2 gap-y-2.5 flex-wrap">
                {allTags.filter((t) => t !== tag).map((t) => <Tag key={t} name={t} onTag={goTag} isField={fields.includes(t)} />)}
              </div>
            </div>
          </section>

        ) : view === "saved" ? (
          /* ───────── 저장한 소식 ───────── */
          <section className="pt-2">
            <h1 style={{ color: T.ink, letterSpacing: "-0.03em" }} className="text-2xl md:text-3xl font-extrabold mb-1">저장한 소식</h1>
            <p style={{ color: T.sub }} className="text-[15px] md:text-sm mb-6">별표한 글이 날짜와 상관없이 모여요. 이 기기 브라우저에 저장돼요.</p>
            {savedItems.length === 0 ? (
              <div style={{ background: T.surface, border: `1px dashed ${T.line}`, color: T.faint }}
                className="rounded-2xl p-10 text-center text-[15px] md:text-sm">아직 저장한 글이 없어요. 별표를 눌러 저장해보세요.</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {savedItems.map((it) => (
                  <Card key={it.id} item={it} saved={!!savedMap[it.id]} toggle={() => toggle(it)} onTag={goTag} fields={fields} />
                ))}
              </div>
            )}
          </section>

        ) : (
          /* ───────── 오늘 뷰 ───────── */
          <>
            <section className="pt-0 md:pt-2 pb-8">
              {/* 통합 날짜 네비게이션 */}
              <div className="relative flex items-center gap-1 mb-5">
                <div style={{ border: `1px solid ${T.line}`, background: T.surface }} className="flex md:inline-flex items-center rounded-full overflow-hidden flex-1 md:flex-initial">
                  <button onClick={() => setSelDate(dates[di + 1])} disabled={di >= dates.length - 1} aria-label="이전 날짜"
                    style={{ color: di >= dates.length - 1 ? "#D3DCDA" : T.sub }} className="h-11 w-11 md:h-9 md:w-9 flex items-center justify-center shrink-0">
                    <Icon.chevronLeft />
                  </button>
                  <button onClick={() => setShowCal((v) => !v)}
                    style={{ color: T.ink, borderLeft: `1px solid ${T.line}`, borderRight: `1px solid ${T.line}` }}
                    className="h-11 md:h-9 px-4 text-sm font-extrabold flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5">
                    <Icon.calendar />{selDate ? dateLabel(selDate) : "…"}
                  </button>
                  <button onClick={() => setSelDate(dates[di - 1])} disabled={isLatest || di < 0} aria-label="다음 날짜"
                    style={{ color: isLatest || di < 0 ? "#D3DCDA" : T.sub }} className="h-11 w-11 md:h-9 md:w-9 flex items-center justify-center shrink-0">
                    <Icon.chevronRight />
                  </button>
                </div>
                {!isLatest && dates.length > 0 && (
                  <button onClick={() => setSelDate(dates[0])} style={{ color: T.field, border: `1px solid #F3D9C6`, background: T.fieldTint }}
                    className="h-11 md:h-9 rounded-full px-3 text-[13px] md:text-xs font-bold shrink-0">최신으로</button>
                )}
                {showCal && selDate && (
                  <Calendar dates={dates} selected={selDate} onSelect={setSelDate} onClose={() => setShowCal(false)} />
                )}
              </div>

              {loadState === "loading" ? (
                <div style={{ background: T.surface, border: `1px solid ${T.line}`, color: T.faint }}
                  className="rounded-2xl p-8 text-center text-sm">불러오는 중…</div>
              ) : loadState === "error" ? (
                <div style={{ background: T.surface, border: `1px dashed ${T.line}` }} className="rounded-2xl p-8 text-center">
                  <p style={{ color: T.ink }} className="font-bold mb-1">아직 수집된 데이터가 없어요</p>
                  <p style={{ color: T.faint }} className="text-sm">매일 오전 7시 자동 수집이 실행되면 이곳에 소식이 채워져요.</p>
                </div>
              ) : (
                <div style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl p-5 md:p-6">
                  <p style={{ color: T.field }} className="text-[13px] md:text-xs font-extrabold tracking-wide mb-2">
                    {isLatest ? "오늘의 브리핑" : `${dateLabel(selDate)} 브리핑`}
                  </p>
                  <h1 style={{ color: T.ink, letterSpacing: "-0.02em" }} className="text-xl leading-7 md:text-2xl md:leading-snug font-bold mb-4">
                    <span style={{ color: T.field }}>{data.briefing.highlight}</span>{data.briefing.rest}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    <StatChip label="수집한 소식" value={`${data.totalCollected}건`} />
                    <StatChip label="주요 이슈" value={`${top5.length}건`} />
                    {fields.map((f) => (
                      <StatChip key={f} label={`${f} 소식`} value={`${items.filter((i) => i.tags.includes(f)).length}건`} color={T.field} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {loadState === "ok" && (
              <>
                <section>
                  <SectionTitle note="가장 화제가 된 소식이에요">{isLatest ? "오늘의 주요 소식" : "주요 소식"}</SectionTitle>
                  <div className="grid gap-3 md:grid-cols-2">
                    {top5[0] && (
                      <div className="md:col-span-2">
                        <Card item={top5[0]} hero {...{ saved: !!savedMap[top5[0].id], toggle: () => toggle(top5[0]), onTag: goTag, fields }} />
                      </div>
                    )}
                    {top5.slice(1).map((it) => (
                      <Card key={it.id} item={it} saved={!!savedMap[it.id]} toggle={() => toggle(it)} onTag={goTag} fields={fields} />
                    ))}
                  </div>
                </section>

                {fields.length > 0 && (() => {
                  const fieldItems = items.filter((i) => i.tags.some((t) => fields.includes(t)));
                  if (!fieldItems.length) return null;
                  const visible = showAllField ? fieldItems : fieldItems.slice(0, 5);
                  return (
                    <section className="mt-10">
                      <SectionTitle note="중요도와 관심 분야를 기준으로 모았어요">내 관심 소식</SectionTitle>
                      <ListBox>
                        <ul className="divide-y" style={{ borderColor: T.line }}>
                          {visible.map((it) => <Row key={it.id} {...rowProps(it)} />)}
                        </ul>
                        {fieldItems.length > 5 && (
                          <button onClick={() => setShowAllField((v) => !v)}
                            style={{ borderTop: `1px solid ${T.line}`, color: T.sub }}
                            className="w-full py-3.5 md:py-3 text-sm font-bold hover:bg-black/5">
                            {showAllField ? "접기" : `더보기 (${fieldItems.length - 5}건 더)`}
                          </button>
                        )}
                      </ListBox>
                    </section>
                  );
                })()}

                <section className="mt-10">
                  <SectionTitle note="관심 분야 소식은 제외했어요">관심 분야 외 소식</SectionTitle>
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
                              <span style={{ color: T.ink }} className="font-bold text-base md:text-sm">{c.label}</span>
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

                {Object.keys(tracker).length > 0 && (
                  <section className="mt-10">
                    <SectionTitle note="주요 AI 서비스의 최근 변경 사항이에요">서비스별 업데이트</SectionTitle>
                    <div className="grid gap-3 md:grid-cols-3">
                      {Object.entries(tracker).map(([name, list]) => (
                        <div key={name} style={{ background: T.surface, border: `1px solid ${T.line}` }} className="rounded-2xl p-5">
                          <div style={{ color: T.ink }} className="font-extrabold text-base md:text-sm mb-3">{name}</div>
                          {list.length === 0 ? (
                            <p style={{ color: T.faint }} className="text-[13px] md:text-xs">아직 수집된 업데이트가 없어요</p>
                          ) : (
                            <ul className="flex flex-col gap-2.5">
                              {list.map(([d, txt], i) => (
                                <li key={i} className="flex gap-3 text-sm leading-[21px]">
                                  <span style={{ color: T.faint }} className="font-semibold shrink-0 tabular-nums">{d}</span>
                                  <span style={{ color: T.sub }}>{txt}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="mt-10">
                  <SectionTitle note="관심 있는 키워드를 선택해 보세요">태그로 둘러보기</SectionTitle>
                  <div className="flex gap-2 gap-y-2.5 flex-wrap">
                    {visibleTags.map((t) => <Tag key={t} name={t} onTag={goTag} isField={fields.includes(t)} />)}
                    {sortedTags.length > 10 && (
                      <button onClick={() => setShowAllTags((v) => !v)} className="py-1 -my-1 group">
                        <span style={{ border: `1px dashed ${T.faint}`, color: T.sub }}
                          className="inline-flex items-center h-9 md:h-7 rounded-full px-3 text-[13px] md:text-xs font-bold group-hover:opacity-70">
                          {showAllTags ? "접기" : `태그 더보기 (+${sortedTags.length - 10})`}
                        </span>
                      </button>
                    )}
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
