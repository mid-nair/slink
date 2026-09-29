import { useMemo, useState } from "react";
import {
  Play, Pause, BadgeCheck, Search, MapPin, X, Send, Clock, Film, Users,
  CalendarCheck, User, ExternalLink, Zap, Upload, Check,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */
const PLAYERS = [
  { id: 1, name: "Rohit Yadav", age: 19, district: "Rajkot", state: "Gujarat", tier: "District A", role: "Bowler", style: "Right-Arm Fast", tags: ["135 km/h Yorker", "Outswing"], verified: true, coach: "Coach Jayesh Bhatt, Saurashtra Cricket Academy", note: "Skiddy pace, repeats yorkers under pressure. Ready for a Saurashtra U-23 trial.", stats: { m: 34, r: 212, w: 61, econ: 5.4 }, link: "https://cricheroes.com/player-profile/rohit-yadav", clips: ["Yorker to castle the stumps", "Death over spell vs Jamnagar XI"] },
  { id: 2, name: "Imran Sheikh", age: 21, district: "Malegaon", state: "Maharashtra", tier: "District B", role: "Bowler", style: "Right-Arm Leg-Spin", tags: ["Googly", "Flipper"], verified: true, coach: "Coach Anil Deshmukh, Nashik Cricket Club", note: "Rare wrist-spinner with a disguised googly. Needs match exposure.", stats: { m: 41, r: 388, w: 78, econ: 4.9 }, link: "https://cricheroes.com/player-profile/imran-sheikh", clips: ["Googly bowls the left-hander", "4-wicket haul in league final"] },
  { id: 3, name: "Sanjana Rawat", age: 18, district: "Dehradun", state: "Uttarakhand", tier: "District A", role: "Batsman", style: "Left-Hand Opener", tags: ["Cover Drive", "Powerplay Hitter"], verified: true, coach: "Coach Meena Negi, Doon Sports Foundation", note: "Elegant timing and a strike rate above 120 in the powerplay.", stats: { m: 27, r: 1104, w: 2, econ: 7.1 }, link: "https://cricheroes.com/player-profile/sanjana-rawat", clips: ["Cover drive masterclass", "Fifty off 31 balls"] },
  { id: 4, name: "Karthik Murugan", age: 22, district: "Tirunelveli", state: "Tamil Nadu", tier: "District B", role: "All-Rounder", style: "Off-Spin All-Rounder", tags: ["Carrom Ball", "Finisher"], verified: false, coach: "", note: "", stats: { m: 52, r: 1420, w: 64, econ: 5.2 }, link: "https://cricheroes.com/player-profile/karthik-murugan", clips: ["Carrom ball dismissal", "Six over long-on to win"] },
  { id: 5, name: "Arjun Chauhan", age: 17, district: "Shimla", state: "Himachal Pradesh", tier: "District C", role: "Bowler", style: "Left-Arm Pace", tags: ["140 km/h Bouncer", "Swing"], verified: true, coach: "Coach Vikram Thakur, HP Pace Lab", note: "Natural left-arm angle. Raw pace, action needs polish.", stats: { m: 18, r: 96, w: 39, econ: 5.8 }, link: "https://cricheroes.com/player-profile/arjun-chauhan", clips: ["Bouncer beats the helmet", "Swing to bowl the opener"] },
  { id: 6, name: "Pooja Kumari", age: 20, district: "Patna", state: "Bihar", tier: "District B", role: "All-Rounder", style: "Right-Arm Medium All-Rounder", tags: ["Slog Sweep", "Yorker"], verified: true, coach: "Coach Ravi Prasad, Patna Cricket Centre", note: "Handy lower-order hitter and a reliable death bowler.", stats: { m: 30, r: 640, w: 33, econ: 5.6 }, link: "https://cricheroes.com/player-profile/pooja-kumari", clips: ["Slog sweep for six", "Two wickets in the last over"] },
  { id: 7, name: "Vishal Gowda", age: 23, district: "Mysuru", state: "Karnataka", tier: "District A", role: "Batsman", style: "Right-Hand Middle-Order", tags: ["Reverse Sweep", "Finisher"], verified: false, coach: "", note: "", stats: { m: 60, r: 2210, w: 0, econ: 0 }, link: "https://cricheroes.com/player-profile/vishal-gowda", clips: ["Reverse sweep boundary", "Chased 48 off 4 overs"] },
  { id: 8, name: "Tanmay Joshi", age: 18, district: "Indore", state: "Madhya Pradesh", tier: "District C", role: "Bowler", style: "Left-Arm Spin", tags: ["Arm Ball", "Googly"], verified: true, coach: "Coach Sunil Pawar, Holkar Cricket Nursery", note: "Tight lines and good control. Ideal for the middle overs.", stats: { m: 22, r: 140, w: 47, econ: 4.7 }, link: "https://cricheroes.com/player-profile/tanmay-joshi", clips: ["Arm ball traps the batter LBW", "5 for 19 in district semi"] },
];
const ME = { id: 99, name: "You (Demo Profile)", age: 20, district: "Ahmedabad", state: "Gujarat", tier: "District B", role: "All-Rounder", style: "Right-Hand Bat, Medium Pace", tags: ["Straight Drive"], verified: false, coach: "", note: "", stats: { m: 12, r: 310, w: 9, econ: 6.1 }, link: "https://cricheroes.com/", clips: ["Upload your first clip"] };

const TURFS = [
  { id: 1, name: "GreenZone Nets", area: "Satellite, Ahmedabad", rate: 600, type: "Turf wickets, 4 lanes", slots: ["6:00 AM", "7:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"] },
  { id: 2, name: "Sardar Patel Practice Arena", area: "Motera, Ahmedabad", rate: 800, type: "Bowling machine, 6 lanes", slots: ["6:00 AM", "8:00 AM", "4:00 PM", "6:00 PM"] },
  { id: 3, name: "Rajkot Cricket Box", area: "Kalawad Road, Rajkot", rate: 450, type: "Box cricket net, 2 lanes", slots: ["7:00 AM", "5:00 PM", "8:00 PM"] },
  { id: 4, name: "Sunrise Turf Academy", area: "Vastrapur, Ahmedabad", rate: 700, type: "Matting and turf, 5 lanes", slots: ["5:30 AM", "6:30 AM", "5:30 PM", "7:30 PM"] },
  { id: 5, name: "Surat Strikers Nets", area: "Adajan, Surat", rate: 500, type: "Turf wickets, 3 lanes", slots: ["6:00 AM", "9:00 AM", "6:00 PM"] },
  { id: 6, name: "Vadodara Pace Lab", area: "Alkapuri, Vadodara", rate: 650, type: "Pace-bowling nets, 4 lanes", slots: ["6:00 AM", "7:00 AM", "6:00 PM", "7:00 PM"] },
];

const GRADS = ["from-emerald-900 to-slate-900", "from-sky-900 to-slate-900", "from-indigo-900 to-slate-900", "from-teal-900 to-slate-900"];
const TABS = [
  { id: "feed", label: "Talent Feed", icon: Film },
  { id: "scout", label: "Scout Discovery", icon: Users },
  { id: "turf", label: "Turf Booking", icon: CalendarCheck },
  { id: "me", label: "My Profile", icon: User },
];

/* ---------------- SMALL PIECES ---------------- */
const Verified = ({ ok }) =>
  ok ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-lime-400/15 px-2 py-0.5 text-xs font-medium text-lime-300">
      <BadgeCheck size={14} /> Coach verified
    </span>
  ) : (
    <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300">Not yet verified</span>
  );

const Tag = ({ children }) => (
  <span className="rounded-md bg-amber-400/15 px-2 py-0.5 text-xs font-medium text-amber-300">{children}</span>
);

const Stat = ({ label, value }) => (
  <div className="rounded-lg bg-slate-800/70 px-3 py-2 text-center">
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-xs text-slate-400">{label}</div>
  </div>
);

function Clip({ player, i = 0, title }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative flex aspect-video items-end overflow-hidden rounded-xl bg-gradient-to-br ${GRADS[(player.id + i) % 4]}`}>
      <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(90deg,transparent,transparent_38px,#fff_39px)]" />
      <button
        onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
        aria-label={playing ? "Pause clip" : "Play clip"}
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime-400 text-slate-950 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-300/50"
      >
        {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
      </button>
      <div className="relative w-full bg-gradient-to-t from-slate-950/90 to-transparent p-3 text-sm text-white">
        {playing ? "Playing (demo): " : ""}{title || player.clips[0]}
        {playing && <div className="mt-2 h-1 overflow-hidden rounded bg-white/20"><div className="h-full w-1/3 animate-pulse bg-lime-400" /></div>}
      </div>
    </div>
  );
}

/* ---------------- TALENT FEED ---------------- */
function FeedCard({ p, onOpen, onInquire }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
      <Clip player={p} />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <button onClick={() => onOpen(p)} className="text-left text-lg font-bold text-white hover:text-lime-300">{p.name}</button>
          <div className="flex items-center gap-1 text-sm text-slate-400"><MapPin size={14} /> {p.district}, {p.state} · {p.tier}</div>
        </div>
        <Verified ok={p.verified} />
      </div>
      <p className="mt-1 text-sm text-slate-300">{p.style}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onInquire(p)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-lime-400 py-2 font-semibold text-slate-950 hover:bg-lime-300">
          <Send size={16} /> Scout Inquiry
        </button>
        <button onClick={() => onOpen(p)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-lime-400">View profile</button>
      </div>
    </article>
  );
}

function Feed({ onOpen, onInquire }) {
  return (
    <div className="mx-auto flex max-w-xl snap-y flex-col gap-5">
      {PLAYERS.map((p) => <FeedCard key={p.id} p={p} onOpen={onOpen} onInquire={onInquire} />)}
    </div>
  );
}

/* ---------------- SCOUT DISCOVERY ---------------- */
const ALL_TAGS = [...new Set(PLAYERS.flatMap((p) => p.tags))].sort();
const DISTRICTS = [...new Set(PLAYERS.map((p) => p.district))].sort();

function Select({ label, value, onChange, options }) {
  return (
    <label className="text-sm text-slate-400">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-lime-400 focus:outline-none">
        <option value="">All</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Scout({ onOpen, onInquire }) {
  const [f, setF] = useState({ q: "", district: "", role: "", tier: "", tag: "", coach: false });
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const list = useMemo(() => PLAYERS.filter((p) =>
    (!f.q || `${p.name} ${p.district} ${p.style}`.toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.district || p.district === f.district) && (!f.role || p.role === f.role) &&
    (!f.tier || p.tier === f.tier) && (!f.tag || p.tags.includes(f.tag)) && (!f.coach || p.verified)
  ), [f]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-500" size={18} />
        <input value={f.q} onChange={(e) => set("q")(e.target.value)} placeholder="Search by name, district or bowling style"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-slate-100 placeholder-slate-500 focus:border-lime-400 focus:outline-none" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 md:grid-cols-5">
        <Select label="District" value={f.district} onChange={set("district")} options={DISTRICTS} />
        <Select label="Specialty" value={f.role} onChange={set("role")} options={["Batsman", "Bowler", "All-Rounder"]} />
        <Select label="Division tier" value={f.tier} onChange={set("tier")} options={["District A", "District B", "District C"]} />
        <Select label="Technical tag" value={f.tag} onChange={set("tag")} options={ALL_TAGS} />
        <label className="col-span-2 flex cursor-pointer items-end gap-2 pb-2 text-sm text-slate-200 md:col-span-1">
          <input type="checkbox" checked={f.coach} onChange={(e) => set("coach")(e.target.checked)} className="peer sr-only" />
          <span className="relative h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-lime-400 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
          Coach endorsed only
        </label>
      </div>
      <p className="my-3 text-sm text-slate-400">{list.length} player{list.length !== 1 && "s"} found</p>
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No players match these filters. Clear a filter or widen the district.
          <button onClick={() => setF({ q: "", district: "", role: "", tier: "", tag: "", coach: false })} className="ml-2 text-lime-300 underline">Reset filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button onClick={() => onOpen(p)} className="text-left font-bold text-white hover:text-lime-300">{p.name}</button>
                  <div className="text-sm text-slate-400">{p.style} · {p.district} · {p.tier}</div>
                </div>
                {p.verified && <BadgeCheck className="shrink-0 text-lime-400" size={20} />}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                <Stat label="Matches" value={p.stats.m} /><Stat label="Runs" value={p.stats.r} />
                <Stat label="Wickets" value={p.stats.w} /><Stat label="Econ" value={p.stats.econ || "-"} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              <div className="mt-auto flex gap-2 pt-4">
                <button onClick={() => onOpen(p)} className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-200 hover:border-lime-400">View profile</button>
                <button onClick={() => onInquire(p)} className="flex-1 rounded-lg bg-lime-400 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300">Scout Inquiry</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- TURF BOOKING ---------------- */
function Turfs({ toast }) {
  const [pick, setPick] = useState({});
  const [booked, setBooked] = useState({});
  const book = (t) => {
    const s = pick[t.id];
    setBooked((b) => ({ ...b, [`${t.id}-${s}`]: true }));
    setPick((x) => ({ ...x, [t.id]: null }));
    toast(`Booked ${t.name} at ${s} for ₹${t.rate}`);
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TURFS.map((t) => (
        <div key={t.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white">{t.name}</h3>
            <div className="text-right"><span className="text-xl font-bold text-amber-300">₹{t.rate}</span><span className="text-xs text-slate-400">/hour</span></div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-400"><MapPin size={14} /> {t.area}</div>
          <p className="mt-1 text-sm text-slate-300">{t.type}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {t.slots.map((s) => {
              const taken = booked[`${t.id}-${s}`], on = pick[t.id] === s;
              return (
                <button key={s} disabled={taken} onClick={() => setPick((x) => ({ ...x, [t.id]: s }))}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-sm ${taken ? "cursor-not-allowed border-slate-800 text-slate-600 line-through" : on ? "border-lime-400 bg-lime-400 text-slate-950" : "border-slate-700 text-slate-200 hover:border-lime-400"}`}>
                  <Clock size={12} /> {s}
                </button>
              );
            })}
          </div>
          <button disabled={!pick[t.id]} onClick={() => book(t)}
            className="mt-4 w-full rounded-lg bg-lime-400 py-2 font-semibold text-slate-950 hover:bg-lime-300 disabled:bg-slate-800 disabled:text-slate-500">
            {pick[t.id] ? `Book Slot · ${pick[t.id]}` : "Pick a time slot"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- PROFILE (used in modal and My Profile tab) ---------------- */
function Profile({ p, onInquire, isMe, toast }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">{p.name}</h2>
        <p className="text-slate-400">{p.style} · {p.age} yrs · {p.district}, {p.state} · {p.tier}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2"><Verified ok={p.verified} />{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </div>
      <section>
        <h3 className="mb-2 font-semibold text-white">Highlight videos</h3>
        <div className="grid gap-3 sm:grid-cols-2">{p.clips.map((c, i) => <Clip key={c} player={p} i={i} title={c} />)}</div>
        {isMe && (
          <button onClick={() => toast("Upload is a demo in V1. Video storage comes next.")} className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-lime-400 px-4 py-2 text-lime-300 hover:bg-lime-400/10">
            <Upload size={16} /> Upload a clip
          </button>
        )}
      </section>
      <section>
        <h3 className="mb-2 font-semibold text-white">Career stats</h3>
        <div className="grid grid-cols-4 gap-2"><Stat label="Matches" value={p.stats.m} /><Stat label="Runs" value={p.stats.r} /><Stat label="Wickets" value={p.stats.w} /><Stat label="Economy" value={p.stats.econ || "-"} /></div>
        <a href={p.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-lime-300 hover:underline"><ExternalLink size={14} /> Scorecards on CricHeroes</a>
      </section>
      <section>
        <h3 className="mb-2 font-semibold text-white">Coach endorsement</h3>
        {p.coach ? (
          <blockquote className="rounded-xl border-l-4 border-amber-400 bg-slate-800/70 p-3 text-slate-200">
            {p.note}<footer className="mt-1 text-sm text-slate-400">{p.coach}</footer>
          </blockquote>
        ) : <p className="text-sm text-slate-400">No endorsement yet. Ask your academy coach to verify your stats.</p>}
      </section>
      {!isMe && (
        <button onClick={() => onInquire(p)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-lime-400 py-2.5 font-semibold text-slate-950 hover:bg-lime-300"><Send size={16} /> Scout Inquiry</button>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/80 p-0 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-700 bg-slate-900 p-5 sm:rounded-3xl">
        <button onClick={onClose} aria-label="Close" className="float-right rounded-full bg-slate-800 p-2 text-slate-300 hover:text-white"><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  const [tab, setTab] = useState("feed");
  const [open, setOpen] = useState(null);
  const [inquiry, setInquiry] = useState(null);
  const [msg, setMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(""), 3000); };
  const sendInquiry = () => { toast(`Inquiry sent to ${inquiry.name}`); setInquiry(null); setMsg(""); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-6">
          <div className="flex items-center gap-2 text-3xl font-black tracking-tight text-white">
            <Zap className="text-lime-400" fill="currentColor" /> Slink
          </div>
          <h1 className="mt-2 max-w-2xl text-xl font-semibold text-slate-200 sm:text-2xl">
            Connecting grassroots talent to <span className="text-amber-300">opportunities.</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">Upload clips and verified stats. Get found by selectors, scouts and academy coaches.</p>
        </div>
        <nav className="sticky top-0 z-30 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl overflow-x-auto px-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${tab === id ? "border-lime-400 text-lime-300" : "border-transparent text-slate-400 hover:text-white"}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "feed" && <Feed onOpen={setOpen} onInquire={setInquiry} />}
        {tab === "scout" && <Scout onOpen={setOpen} onInquire={setInquiry} />}
        {tab === "turf" && <Turfs toast={toast} />}
        {tab === "me" && <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-5"><Profile p={ME} isMe toast={toast} /></div>}
      </main>

      {open && <Modal onClose={() => setOpen(null)}><Profile p={open} onInquire={(p) => { setOpen(null); setInquiry(p); }} /></Modal>}
      {inquiry && (
        <Modal onClose={() => setInquiry(null)}>
          <h2 className="text-xl font-bold text-white">Message {inquiry.name}</h2>
          <p className="mb-3 text-sm text-slate-400">Introduce your academy or team and what you are looking for.</p>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Hi, I'm a selector for... We'd like to invite you for a trial on..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-100 focus:border-lime-400 focus:outline-none" />
          <button onClick={sendInquiry} disabled={!msg.trim()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-lime-400 py-2.5 font-semibold text-slate-950 disabled:bg-slate-800 disabled:text-slate-500"><Send size={16} /> Send inquiry</button>
        </Modal>
      )}
      {toastMsg && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-lime-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-xl"><Check size={16} /> {toastMsg}</div>}
    </div>
  );
}
