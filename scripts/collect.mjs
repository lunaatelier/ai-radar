// Daily AI news collector.
// Fetches RSS sources, enriches each item via NVIDIA API (Korean translation,
// 3-line summary, tags, importance), picks TOP5, and writes date-keyed JSON
// under public/data/. Run with --dry-run to skip the LLM (no API key needed).
import Parser from "rss-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const DRY_RUN = process.argv.includes("--dry-run");

const API_KEY = process.env.NVIDIA_API_KEY;
const MODEL = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const WINDOW_HOURS = 26;
const MAX_PER_SOURCE = 8;
const MAX_TOTAL = 36;
const CONCURRENCY = 3;

const AI_KEYWORDS = /\b(ai|a\.i\.|llm|gpt|chatgpt|openai|anthropic|claude|gemini|midjourney|stable diffusion|diffusion|copilot|deepseek|mistral|llama|hugging ?face|machine learning|neural|생성형|인공지능|딥러닝|머신러닝)\b/i;

const TAG_HINT = "디자인, 이미지생성, 영상, 음성, 3D, Figma, 폰트, 생산성, 에이전트, Claude, ChatGPT, Gemini, 구글, 오픈소스, 연구, 규제, 저작권, 투자, 인프라, 국내, 기업";

// ─── helpers ──────────────────────────────────────────────
const kstNow = () => new Date(Date.now() + 9 * 3600 * 1000);
const kstDateStr = () => kstNow().toISOString().slice(0, 10);

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}
const stripHtml = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const cleanGoogleNewsTitle = (t = "") => t.replace(/\s+-\s+[^-]+$/, "").trim();

// ─── RSS collection ───────────────────────────────────────
async function collectFeeds(sources) {
  const parser = new Parser({
    timeout: 20000,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ai-radar/1.0)" },
  });
  const cutoff = Date.now() - WINDOW_HOURS * 3600 * 1000;
  const seen = new Set();
  const items = [];

  for (const src of sources.filter((s) => s.on)) {
    try {
      const feed = await parser.parseURL(src.url);
      let count = 0;
      for (const e of feed.items || []) {
        if (count >= MAX_PER_SOURCE) break;
        const pub = e.isoDate || e.pubDate;
        const ts = pub ? Date.parse(pub) : NaN;
        if (Number.isNaN(ts) || ts < cutoff) continue;

        const title = cleanGoogleNewsTitle(stripHtml(e.title || ""));
        if (!title) continue;
        const key = title.toLowerCase().slice(0, 80);
        if (seen.has(key)) continue;

        const excerpt = stripHtml(e.contentSnippet || e.content || e.summary || "").slice(0, 800);
        if (src.filter && !AI_KEYWORDS.test(title + " " + excerpt)) continue;

        seen.add(key);
        count++;
        items.push({
          title, excerpt,
          url: e.link || "",
          source: src.name,
          publishedAt: new Date(ts).toISOString(),
        });
      }
      console.log(`[feed] ${src.name}: ${count} items`);
    } catch (err) {
      console.warn(`[feed] ${src.name} FAILED: ${err.message}`);
    }
  }
  items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return items.slice(0, MAX_TOTAL);
}

// ─── NVIDIA API ───────────────────────────────────────────
async function chat(messages, maxTokens = 700) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.3, max_tokens: maxTokens }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, attempt * 5000));
      continue;
    }
    if (!res.ok) throw new Error(`NVIDIA API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  }
  throw new Error("NVIDIA API: retries exhausted");
}

function parseJsonBlock(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no JSON in LLM response");
  return JSON.parse(m[0]);
}

async function enrich(raw) {
  if (DRY_RUN) {
    return {
      title: raw.title,
      lines: [raw.excerpt.slice(0, 90) || "(요약 없음)"],
      tags: ["미분류"], cat: "etc",
      importance: AI_KEYWORDS.test(raw.title) ? 60 : 40,
    };
  }
  const content = await chat([
    { role: "system",
      content: "너는 한국어 AI 뉴스 에디터다. 주어진 기사를 분석해 반드시 JSON 하나만 출력한다. 다른 텍스트 금지." },
    { role: "user",
      content: `기사를 분석해 아래 형식의 JSON만 출력해.
{
  "title": "자연스러운 한국어 제목 (40자 이내, 번역투 금지)",
  "lines": ["핵심 요점 1", "핵심 요점 2", "핵심 요점 3"],
  "tags": ["태그1", "태그2"],
  "cat": "tool | update | issue | etc 중 하나",
  "importance": 0에서 100 사이 정수
}
규칙:
- lines: 한국어 요점 정리 2~3개, 각 45자 이내, 명사형 종결
- tags: 1~3개, 가능하면 이 목록에서 선택: ${TAG_HINT}
- cat: 새 툴/서비스 출시=tool, 기존 서비스 기능 업데이트=update, 규제/소송/사회적 논쟁=issue, 나머지=etc
- importance: 업계 파급력과 실무 활용도 기준. 대형 모델·주요 서비스 출시=80+, 일반 소식=40~60

기사:
제목: ${raw.title}
출처: ${raw.source}
내용: ${raw.excerpt || "(본문 없음)"}` },
  ]);
  const p = parseJsonBlock(content);
  return {
    title: String(p.title || raw.title).slice(0, 60),
    lines: (Array.isArray(p.lines) ? p.lines : []).slice(0, 3).map((l) => String(l).slice(0, 80)),
    tags: (Array.isArray(p.tags) ? p.tags : []).slice(0, 3).map(String),
    cat: ["tool", "update", "issue", "etc"].includes(p.cat) ? p.cat : "etc",
    importance: Math.max(0, Math.min(100, Number(p.importance) || 50)),
  };
}

async function enrichAll(rawItems) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < rawItems.length) {
      const idx = i++;
      const raw = rawItems[idx];
      try {
        const e = await enrich(raw);
        out[idx] = { ...raw, ...e };
        console.log(`[llm] ${idx + 1}/${rawItems.length} ok: ${e.title}`);
      } catch (err) {
        console.warn(`[llm] ${idx + 1}/${rawItems.length} FAILED (${err.message}), skipping`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out.filter(Boolean);
}

async function makeBriefing(topItems, totalCount) {
  if (DRY_RUN || topItems.length === 0) {
    return { highlight: topItems[0]?.title || "오늘의 소식", rest: ` 외 ${Math.max(totalCount - 1, 0)}건의 소식을 확인해 보세요.` };
  }
  try {
    const content = await chat([
      { role: "system", content: "너는 한국어 AI 뉴스 에디터다. 반드시 JSON 하나만 출력한다." },
      { role: "user",
        content: `오늘의 주요 뉴스로 한 문장 브리핑을 만들어 JSON만 출력해.
{"highlight": "가장 중요한 소식 핵심 구절 (15자 이내, 명사형)", "rest": "highlight 바로 뒤에 이어붙였을 때 자연스러운 나머지 문장 ('~을/를 확인해 보세요' 형태의 안내형 종결)"}
예시: {"highlight": "Claude 화면 공유 기능", "rest": "과 디자인 관련 새 툴 4건을 확인해 보세요."}

주요 뉴스:
${topItems.map((t, n) => `${n + 1}. ${t.title}`).join("\n")}` },
    ], 200);
    const p = parseJsonBlock(content);
    return { highlight: String(p.highlight || ""), rest: String(p.rest || "") };
  } catch {
    return { highlight: topItems[0].title, rest: ` 등 오늘의 소식 ${totalCount}건을 확인해 보세요.` };
  }
}

// ─── tracker ──────────────────────────────────────────────
function updateTracker(items, date) {
  const file = path.join(DATA_DIR, "tracker.json");
  const tracker = readJson(file, { services: { Claude: [], ChatGPT: [], Gemini: [] } });
  const mmdd = date.slice(5).replace("-", ".");
  for (const name of Object.keys(tracker.services)) {
    const hit = items.find((i) => i.cat === "update" &&
      (i.title.includes(name) || i.tags.includes(name)));
    if (hit) {
      const entry = [mmdd, hit.title.replace(new RegExp(`^${name}[,:]?\\s*`), "").slice(0, 30)];
      const list = tracker.services[name];
      if (!list.some(([d]) => d === mmdd)) {
        list.unshift(entry);
        tracker.services[name] = list.slice(0, 6);
      }
    }
  }
  writeJson(file, tracker);
}

// ─── main ─────────────────────────────────────────────────
async function main() {
  if (!DRY_RUN && !API_KEY) {
    console.error("NVIDIA_API_KEY is not set. Use --dry-run to test without the API.");
    process.exit(1);
  }
  const date = kstDateStr();
  console.log(`[collect] date=${date} model=${MODEL} dryRun=${DRY_RUN}`);

  const { sources } = readJson(path.join(DATA_DIR, "sources.json"), { sources: [] });
  const rawItems = await collectFeeds(sources);
  console.log(`[collect] ${rawItems.length} raw items after filtering`);
  if (rawItems.length === 0) {
    console.warn("[collect] nothing collected — keeping existing data, exiting");
    return;
  }

  const enriched = await enrichAll(rawItems);
  enriched.sort((a, b) => b.importance - a.importance);
  enriched.forEach((it, n) => { it.id = `${date}-${String(n + 1).padStart(2, "0")}`; it.top = n < 5; });

  const briefing = await makeBriefing(enriched.slice(0, 5), enriched.length);

  writeJson(path.join(DATA_DIR, `${date}.json`), {
    date,
    generatedAt: new Date().toISOString(),
    briefing,
    totalCollected: rawItems.length,
    items: enriched.map(({ excerpt, ...it }) => it),
  });

  const idxFile = path.join(DATA_DIR, "index.json");
  const idx = readJson(idxFile, { dates: [] });
  if (!idx.dates.includes(date)) idx.dates.push(date);
  idx.dates.sort().reverse();
  writeJson(idxFile, idx);

  updateTracker(enriched, date);
  console.log(`[collect] wrote public/data/${date}.json (${enriched.length} items)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
