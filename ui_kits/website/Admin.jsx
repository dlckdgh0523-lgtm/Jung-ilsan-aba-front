/* global React */
const { useState: useStateAdmin, useEffect: useEffectAdmin } = React;

/* ─────────────────────────────────────────────────────────────
   Admin CMS — operational dashboard + CRUD
   * Real-time visitor stats (simulated; would be SSE in production)
   * Consultation notifications via BroadcastChannel + localStorage
   * CRUD modals for Gallery / About / Therapists / Notices / Hero
   ───────────────────────────────────────────────────────────── */

const ADMIN_NAV = [
  { id: "dashboard",  label: "대시보드",       icon: "layout-dashboard" },
  { id: "hero",       label: "Hero 슬라이드",   icon: "image" },
  { id: "about",      label: "센터 소개",       icon: "info" },
  { id: "director",   label: "센터장",           icon: "user-circle" },
  { id: "programs",   label: "프로그램",         icon: "graduation-cap" },
  { id: "therapists", label: "치료사 소개",     icon: "users" },
  { id: "notices",    label: "공지사항",         icon: "megaphone" },
  { id: "gallery",    label: "갤러리",           icon: "images" },
  { id: "popups",     label: "팝업 관리",        icon: "message-square" },
  { id: "consultations", label: "상담 신청",   icon: "inbox" },
  { id: "menus",      label: "메뉴 관리",        icon: "menu" },
  { id: "sections",   label: "섹션 ON / OFF",  icon: "sliders" },
];

/* ─── ROOT WRAPPER ─────────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById("root")).render(<AdminGate />);

function AdminGate() {
  const [authed, setAuthed] = useStateAdmin(() => sessionStorage.getItem("aba-admin") === "ok");
  if (!authed) return <Login onSuccess={() => { sessionStorage.setItem("aba-admin", "ok"); setAuthed(true); }} />;
  return <AdminApp onLogout={() => { sessionStorage.removeItem("aba-admin"); setAuthed(false); }} />;
}

/* ─── LOGIN ────────────────────────────────────────────────── */
function Login({ onSuccess }) {
  const [id, setId]   = useStateAdmin("");
  const [pw, setPw]   = useStateAdmin("");
  const [err, setErr] = useStateAdmin("");
  const [show, setShow] = useStateAdmin(false);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  const submit = (e) => {
    e.preventDefault();
    if (id === "admin" && pw === "aba1234") onSuccess();
    else setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
  };
  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <img src="../../assets/logo-aba.png" alt="정지은 일산 ABA" className="login__logo"/>
        <h1>관리자 로그인</h1>
        <p>정지은 일산 ABA · 홈페이지 관리자 콘솔입니다.</p>
        <label>
          <span>아이디</span>
          <input type="text" value={id} onChange={(e)=>{setId(e.target.value); setErr("");}} autoFocus required />
        </label>
        <label>
          <span>비밀번호</span>
          <div className="login__pw">
            <input type={show ? "text" : "password"} value={pw} onChange={(e)=>{setPw(e.target.value); setErr("");}} required />
            <button type="button" className="icon-btn" onClick={()=>setShow(!show)} aria-label="toggle"><i data-lucide={show ? "eye-off" : "eye"} style={{width:16,height:16}}/></button>
          </div>
        </label>
        {err && <div className="login__err"><i data-lucide="alert-circle" style={{width:14,height:14}}/> {err}</div>}
        <button type="submit" className="btn btn-primary btn-lg login__submit">로그인 <i data-lucide="arrow-right" style={{width:16,height:16}}/></button>
        <div className="login__hint">
          <div><strong>데모 계정</strong></div>
          <div>아이디 <code>admin</code> · 비밀번호 <code>aba1234</code></div>
        </div>
        <a className="login__back" href="index.html" target="_top"><i data-lucide="arrow-left" style={{width:14,height:14}}/> 사이트로 돌아가기</a>
      </form>
    </div>
  );
}

/* ─── ADMIN APP SHELL ──────────────────────────────────────── */
function AdminApp({ onLogout }) {
  const [view, setView] = useStateAdmin("dashboard");
  const data = window.SITE_DATA;

  /* Consultations + notification badge */
  const { consultations, unread, markAllRead, markRead, removeOne, toast } = useConsultations();

  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <div className="cms">
      <aside className="cms__sidebar">
        <div className="cms__brand">
          <img src="../../assets/logo-aba.png" alt="정지은 ABA"/>
        </div>
        <nav>
          {ADMIN_NAV.map((n) => (
            <button
              key={n.id}
              className={"cms__nav-item" + (view === n.id ? " is-active" : "")}
              onClick={() => { setView(n.id); if (n.id === "consultations") markAllRead(); }}
            >
              <i data-lucide={n.icon} style={{ width: 18, height: 18 }} />
              <span>{n.label}</span>
              {n.id === "consultations" && unread > 0 && (
                <span className="cms__nav-badge">{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="cms__sidebar-foot">
          <div className="cms__user">
            <div className="cms__avatar">정</div>
            <div>
              <strong>정지은</strong>
              <span>원장 · BCBA</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm cms__logout" onClick={onLogout}>
            <i data-lucide="log-out" style={{width:14,height:14}}/> 로그아웃
          </button>
        </div>
      </aside>

      <main className="cms__main">
        <header className="cms__topbar">
          <div>
            <span className="cms__crumb">관리자</span>
            <h2>{ADMIN_NAV.find(n => n.id === view).label}</h2>
          </div>
          <div className="cms__top-actions">
            <button
              className={"icon-btn cms__bell" + (unread > 0 ? " is-active" : "")}
              onClick={() => { setView("consultations"); markAllRead(); }}
              aria-label="알림"
            >
              <i data-lucide="bell" style={{width:18,height:18}}/>
              {unread > 0 && <span className="cms__bell-badge">{unread > 9 ? "9+" : unread}</span>}
            </button>
            <a className="btn btn-secondary btn-sm" href="index.html" target="_top"><i data-lucide="external-link" style={{width:14,height:14}}/> 사이트 보기</a>
          </div>
        </header>

        <div className="cms__view">
          {view === "dashboard"     && <DashboardView data={data} consultations={consultations} setView={setView} />}
          {view === "hero"          && <HeroAdminView slides={data.hero} />}
          {view === "about"         && <AboutAdminView about={data.about} brand={data.brand} />}
          {view === "director"      && <DirectorAdminView profile={data.directorProfile} />}
          {view === "programs"      && <ProgramsAdminView programs={data.programs} />}
          {view === "therapists"    && <TherapistsAdminView therapists={data.therapists} />}
          {view === "notices"       && <NoticesAdminView notices={data.notices} />}
          {view === "gallery"       && <GalleryAdminView gallery={data.gallery} />}
          {view === "popups"        && <PopupAdminView popups={data.popups || []} />}
          {view === "consultations" && <ConsultationsView items={consultations} onRead={markRead} onRemove={removeOne} />}
          {view === "menus"         && <MenuAdminView nav={data.nav} />}
          {view === "sections"      && <SectionsAdminView />}
        </div>

        {toast && <div className="cms-toast"><i data-lucide="bell" style={{width:18,height:18}}/> <div><strong>새 상담 신청</strong><span>{toast.parent || "익명"} · {toast.topic || "분야 미지정"}</span></div></div>}
      </main>
    </div>
  );
}

/* ─── REAL-TIME CONSULTATIONS HOOK (BroadcastChannel + storage) ─ */
function useConsultations() {
  const [list, setList] = useStateAdmin(() => {
    try { return JSON.parse(localStorage.getItem("aba-consultations") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useStateAdmin(null);

  useEffectAdmin(() => {
    let bc;
    try { bc = new BroadcastChannel("aba-consult"); } catch { bc = null; }
    const refresh = () => {
      try { setList(JSON.parse(localStorage.getItem("aba-consultations") || "[]")); } catch {}
    };
    const onMsg = (e) => {
      if (e.data?.kind === "new") {
        refresh();
        setToast(e.data.payload);
        setTimeout(() => setToast(null), 4200);
      }
    };
    if (bc) bc.addEventListener("message", onMsg);
    const onStorage = (e) => { if (e.key === "aba-consultations") refresh(); };
    window.addEventListener("storage", onStorage);
    return () => {
      bc?.removeEventListener("message", onMsg);
      bc?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const unread = list.filter(c => !c.read).length;

  const markAllRead = () => {
    const next = list.map(c => ({ ...c, read: true }));
    setList(next);
    localStorage.setItem("aba-consultations", JSON.stringify(next));
  };
  const markRead = (id) => {
    const next = list.map(c => c.id === id ? { ...c, read: true } : c);
    setList(next);
    localStorage.setItem("aba-consultations", JSON.stringify(next));
  };
  const removeOne = (id) => {
    const next = list.filter(c => c.id !== id);
    setList(next);
    localStorage.setItem("aba-consultations", JSON.stringify(next));
  };

  return { consultations: list, unread, markAllRead, markRead, removeOne, toast };
}

/* ─── DASHBOARD ────────────────────────────────────────────── */
function DashboardView({ data, consultations, setView }) {
  // Simulated real-time stats. In production these come from an analytics SSE feed.
  const [online, setOnline] = useStateAdmin(() => 3 + Math.floor(Math.random() * 7));
  const [todayVisits, setTodayVisits] = useStateAdmin(() => {
    const v = parseInt(sessionStorage.getItem("aba-today-base") || "0", 10);
    return v || (124 + Math.floor(Math.random() * 60));
  });
  const [totalVisits, setTotalVisits] = useStateAdmin(() => 18742 + Math.floor(Math.random() * 250));

  useEffectAdmin(() => {
    sessionStorage.setItem("aba-today-base", String(todayVisits));
    const t = setInterval(() => {
      setOnline(o => Math.max(1, Math.min(24, o + (Math.random() < 0.5 ? -1 : 1))));
      if (Math.random() < 0.5) setTodayVisits(v => v + 1);
      setTotalVisits(v => v + 1);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); }, [online, todayVisits, totalVisits]);

  const newReqs = consultations.filter(c => !c.read).length;
  const recent  = consultations.slice(0, 5);

  const stats = [
    { label: "실시간 접속자", value: online,        delta: "LIVE", icon: "activity",  live: true },
    { label: "오늘 방문자",  value: todayVisits,   delta: "+12%", icon: "user-plus" },
    { label: "전체 방문자",  value: totalVisits.toLocaleString(), delta: "+1.2k", icon: "users" },
    { label: "신규 상담",   value: newReqs,       delta: newReqs > 0 ? "신규" : "없음", icon: "inbox" },
  ];

  return (
    <>
      <div className="cms__stats">
        {stats.map((s) => (
          <div key={s.label} className="cms__stat">
            <div className="cms__stat-head">
              <span>{s.label}</span>
              <i data-lucide={s.icon} style={{width:18,height:18}}/>
            </div>
            <div className="cms__stat-row">
              <strong>{s.value}</strong>
              <span className={"cms__stat-delta" + (s.live ? " is-live" : "")}>
                {s.live && <span className="cms__live-dot"/>}{s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="cms__grid-2">
        <section className="cms__card">
          <header><h3>최근 상담 신청</h3><button className="btn btn-ghost btn-sm" onClick={()=>setView("consultations")}>전체보기</button></header>
          {recent.length === 0 ? (
            <div className="cms__empty">
              <i data-lucide="inbox" style={{width:32,height:32}}/>
              <p>아직 접수된 상담이 없습니다. 사이트의 상담 폼을 통해 신청이 들어오면 여기에 실시간으로 표시됩니다.</p>
            </div>
          ) : (
            <ul className="cms__list">
              {recent.map((c) => (
                <li key={c.id}>
                  <span>{c.parent || "익명"}</span>
                  <span className="muted">{c.topic || "미지정"} · {c.phone || "-"}</span>
                  <span className={"cms__pill " + (c.read ? "cms__pill--neutral" : "cms__pill--orange")}>{c.read ? "확인" : "신규"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="cms__card">
          <header><h3>빠른 작업</h3></header>
          <div className="cms__quick">
            <button onClick={() => setView("hero")}><i data-lucide="image" style={{width:18,height:18}}/><span>Hero 슬라이드 추가</span></button>
            <button onClick={() => setView("notices")}><i data-lucide="megaphone" style={{width:18,height:18}}/><span>공지사항 작성</span></button>
            <button onClick={() => setView("therapists")}><i data-lucide="user-plus" style={{width:18,height:18}}/><span>치료사 추가</span></button>
            <button onClick={() => setView("gallery")}><i data-lucide="upload" style={{width:18,height:18}}/><span>갤러리 업로드</span></button>
          </div>
        </section>
      </div>
    </>
  );
}

/* ─── CONSULTATIONS LIST ──────────────────────────────────── */
function ConsultationsView({ items, onRead, onRemove }) {
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); }, [items]);
  const seed = () => {
    const sample = { id: "c-" + Date.now(), ts: Date.now(), parent: "테스트 부모님", phone: "010-1234-5678", age: "만 4세", topic: "조기교실", note: "샘플 데이터입니다.", read: false };
    const list = JSON.parse(localStorage.getItem("aba-consultations") || "[]");
    list.unshift(sample);
    localStorage.setItem("aba-consultations", JSON.stringify(list));
    try { new BroadcastChannel("aba-consult").postMessage({ kind: "new", payload: sample }); } catch {}
  };
  return (
    <section className="cms__card">
      <header>
        <h3>상담 신청 ({items.length}) · 미확인 {items.filter(c=>!c.read).length}</h3>
        <button className="btn btn-secondary btn-sm" onClick={seed}><i data-lucide="zap" style={{width:14,height:14}}/> 데모 신청 생성</button>
      </header>
      {items.length === 0 ? (
        <div className="cms__empty">
          <i data-lucide="mail" style={{width:32,height:32}}/>
          <p>접수된 상담 신청이 없습니다.</p>
        </div>
      ) : (
        <table className="cms__table">
          <thead><tr><th></th><th>부모님</th><th>연락처</th><th>연령</th><th>분야</th><th>접수 시각</th><th>상태</th><th></th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className={c.read ? "" : "is-unread"}>
                <td>{!c.read && <span className="cms__dot"/>}</td>
                <td><strong>{c.parent || "익명"}</strong>{c.note && <div className="muted">{c.note}</div>}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.age || "-"}</td>
                <td>{c.topic || "-"}</td>
                <td>{formatTime(c.ts)}</td>
                <td>
                  {c.read
                    ? <span className="cms__pill cms__pill--neutral">확인</span>
                    : <button className="cms__pill cms__pill--orange" onClick={() => onRead(c.id)} style={{border:"none",cursor:"pointer"}}>읽음 처리</button>}
                </td>
                <td><button className="icon-btn" onClick={() => onRemove(c.id)}><i data-lucide="trash-2" style={{width:16,height:16}}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return "오늘 " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
  }
  return d.getFullYear() + "." + String(d.getMonth()+1).padStart(2,"0") + "." + String(d.getDate()).padStart(2,"0");
}

/* ─── GENERIC CRUD HELPERS ─────────────────────────────────── */
function useEditableList(initial, opts = {}) {
  const [items, setItems] = useStateAdmin(() => initial.map(x => ({ visible: true, ...x })));
  const create = (x) => setItems(p => [...p, { id: opts.idPrefix + "-" + Date.now(), visible: true, ...x }]);
  const update = (x) => setItems(p => p.map(i => i.id === x.id ? x : i));
  const remove = (id) => { if (confirm("삭제하시겠습니까?")) setItems(p => p.filter(i => i.id !== id)); };
  const toggleVisible = (id) => setItems(p => p.map(i => i.id === id ? { ...i, visible: i.visible === false ? true : false } : i));
  const move = (id, dir) => setItems(p => {
    const idx = p.findIndex(i => i.id === id);
    if (idx === -1) return p;
    const ni = idx + dir;
    if (ni < 0 || ni >= p.length) return p;
    const out = [...p];
    [out[idx], out[ni]] = [out[ni], out[idx]];
    return out;
  });
  return { items, create, update, remove, toggleVisible, move };
}

function readImageFile(file, cb) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => cb(e.target.result);
  reader.readAsDataURL(file);
}

function RowActions({ visible, onEdit, onDelete, onUp, onDown, onToggle }) {
  return (
    <div className="cms__row-actions">
      <button className="icon-btn" onClick={onUp} title="위로"><i data-lucide="chevron-up" style={{width:16,height:16}}/></button>
      <button className="icon-btn" onClick={onDown} title="아래로"><i data-lucide="chevron-down" style={{width:16,height:16}}/></button>
      <button className="icon-btn" onClick={onToggle} title={visible !== false ? "비공개로" : "공개로"}>
        <i data-lucide={visible !== false ? "eye" : "eye-off"} style={{width:16,height:16}}/>
      </button>
      <button className="icon-btn" onClick={onEdit}><i data-lucide="pencil" style={{width:16,height:16}}/></button>
      <button className="icon-btn" onClick={onDelete}><i data-lucide="trash-2" style={{width:16,height:16}}/></button>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */
function HeroAdminView({ slides }) {
  const { items, create, update, remove, toggleVisible, move } = useEditableList(slides, { idPrefix: "hero" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="cms__card">
      <header>
        <h3>Hero 슬라이드 ({items.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ _new: true, eyebrow: "", title: "", subtitle: "", image: "", buttonText: "더 알아보기", buttonLink: "about" })}>
          <i data-lucide="plus" style={{width:14,height:14}}/> 슬라이드 추가
        </button>
      </header>
      <div className="cms__slide-list">
        {items.map((s, i) => (
          <div key={s.id} className={"cms__slide-row" + (s.visible === false ? " is-hidden" : "")}>
            <span className="cms__handle"><i data-lucide="grip-vertical" style={{width:16,height:16}}/></span>
            <div className="cms__thumb" style={s.image ? { backgroundImage: `url(${s.image})` } : { background: "var(--bg-muted)" }} />
            <div className="cms__slide-info">
              <strong>{(s.title || "(제목 없음)").replace("\n", " ")}</strong>
              <span className="muted">{s.subtitle}</span>
              <div className="cms__chips">
                <span className="cms__pill cms__pill--neutral">#{i + 1}</span>
                <span className={"cms__pill " + (s.visible === false ? "cms__pill--neutral" : "cms__pill--green")}>{s.visible === false ? "비공개" : "활성"}</span>
              </div>
            </div>
            <RowActions
              visible={s.visible}
              onEdit={() => setEditing({ ...s })}
              onDelete={() => remove(s.id)}
              onUp={() => move(s.id, -1)}
              onDown={() => move(s.id, 1)}
              onToggle={() => toggleVisible(s.id)}
            />
          </div>
        ))}
      </div>
      {editing && (
        <CrudModal
          title={editing._new ? "Hero 슬라이드 추가" : "Hero 슬라이드 수정"}
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => { editing._new ? create(d) : update(d); setEditing(null); }}
          fields={[
            { key: "image", label: "배경 사진", kind: "photo" },
            { key: "eyebrow", label: "Eyebrow (작은 라벨)" },
            { key: "title", label: "제목", kind: "textarea" },
            { key: "subtitle", label: "부제목" },
            { key: "buttonText", label: "버튼 텍스트" },
            { key: "buttonLink", label: "버튼 이동 경로", placeholder: "about / programs / contact …" },
          ]}
        />
      )}
    </section>
  );
}

/* ─── ABOUT (CENTER INFO) ─────────────────────────────────── */
function AboutAdminView({ about, brand }) {
  const [draft, setDraft] = useStateAdmin({ ...about, ...brand });
  const [saved, setSaved] = useStateAdmin(false);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  const update = (k, v) => { setDraft(d => ({ ...d, [k]: v })); setSaved(false); };
  return (
    <section className="cms__card">
      <header><h3>센터 소개</h3><button className="btn btn-primary btn-sm" onClick={() => setSaved(true)}><i data-lucide="save" style={{width:14,height:14}}/> 저장</button></header>
      <div style={{ padding: 24, display: "grid", gap: 14 }}>
        <FieldText label="센터 이름 (한글)" value={draft.nameKo} onChange={(v)=>update("nameKo", v)} />
        <FieldText label="센터 태그라인" value={draft.tagline} onChange={(v)=>update("tagline", v)} />
        <FieldText label="주소" value={draft.address} onChange={(v)=>update("address", v)} />
        <div className="cms-field-row">
          <FieldText label="전화번호" value={draft.phone} onChange={(v)=>update("phone", v)} />
          <FieldText label="카카오 ID" value={draft.kakaoId} onChange={(v)=>update("kakaoId", v)} />
        </div>
        <FieldText label="운영시간" value={draft.hours} onChange={(v)=>update("hours", v)} />
        <FieldText label="섹션 제목" value={draft.title} onChange={(v)=>update("title", v)} kind="textarea" />
        <div className="cms-field">
          <span>본문 (한 줄에 한 문단)</span>
          <textarea rows="10" value={(draft.body || []).join("\n")} onChange={(e)=>update("body", e.target.value.split("\n"))}/>
        </div>
        {saved && <div className="cms__saved-toast"><i data-lucide="check" style={{width:14,height:14}}/> 저장되었습니다. (데모에서는 실제 반영되지 않습니다.)</div>}
      </div>
    </section>
  );
}

function FieldText({ label, value, onChange, kind = "text", placeholder }) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {kind === "textarea"
        ? <textarea rows="3" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>
        : <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>}
    </label>
  );
}

/* ─── DIRECTOR (CENTER HEAD PROFILE) ──────────────────────── */
function DirectorAdminView({ profile }) {
  const [d, setD] = useStateAdmin({ ...profile });
  const [saved, setSaved] = useStateAdmin(false);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  const update = (k, v) => { setD(o => ({ ...o, [k]: v })); setSaved(false); };
  const onPhotoFile = (file) => readImageFile(file, (data) => update("photo", data));

  return (
    <section className="cms__card">
      <header>
        <h3>센터장 프로필</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setSaved(true)}>
          <i data-lucide="save" style={{width:14,height:14}}/> 저장
        </button>
      </header>
      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        <label className="cms-field cms-field--photo">
          <span>센터장 사진</span>
          <div className="cms-photo-input">
            <div className="cms-photo-input__preview" style={d.photo ? { backgroundImage: `url(${d.photo})` } : undefined}>
              {!d.photo && <i data-lucide="image" style={{width:32,height:32}}/>}
            </div>
            <div className="cms-photo-input__actions">
              <label className="btn btn-secondary btn-sm">
                <i data-lucide="upload" style={{width:14,height:14}}/> 파일 선택
                <input type="file" accept="image/*" hidden onChange={(e) => onPhotoFile(e.target.files?.[0])}/>
              </label>
              {d.photo && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update("photo", "")}>
                  <i data-lucide="trash-2" style={{width:14,height:14}}/> 제거
                </button>
              )}
              <div className="muted" style={{fontSize:12, lineHeight:1.5, marginTop:4}}>비워두면 기본 등록된 사진이 사용됩니다.</div>
            </div>
          </div>
        </label>

        <div className="cms-field-row">
          <FieldText label="성함" value={d.name} onChange={(v)=>update("name", v)} />
          <FieldText label="역할" value={d.role} onChange={(v)=>update("role", v)} placeholder="예) 원장 · BCBA"/>
        </div>
        <FieldText label="부제 (서브 타이틀)" value={d.sub} onChange={(v)=>update("sub", v)} />

        <div className="cms-field">
          <span>자격 및 인증 (코드 · 설명)</span>
          <div className="cms-sections">
            {(d.certifications || []).map((c, idx) => (
              <div key={idx} className="cms-section-row">
                <div className="cms-section-row__head">
                  <span className="cms-section-row__num">{String(idx + 1).padStart(2, "0")}</span>
                  <input type="text" value={c.code || ""} placeholder="코드 (예: BCBA)"
                    onChange={(e)=>update("certifications", (d.certifications||[]).map((it,i)=>i===idx?{...it,code:e.target.value}:it))}/>
                  <button type="button" className="icon-btn" onClick={()=>update("certifications", (d.certifications||[]).filter((_,i)=>i!==idx))}>
                    <i data-lucide="trash-2" style={{width:14,height:14}}/>
                  </button>
                </div>
                <textarea rows="2" value={c.desc || ""} placeholder="설명"
                  onChange={(e)=>update("certifications", (d.certifications||[]).map((it,i)=>i===idx?{...it,desc:e.target.value}:it))}/>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>update("certifications", [...(d.certifications||[]), { code: "", desc: "" }])}>
              <i data-lucide="plus" style={{width:14,height:14}}/> 자격 추가
            </button>
          </div>
        </div>

        <div className="cms-field">
          <span>학력 (한 줄에 하나)</span>
          <textarea rows="5" value={(d.education || []).join("\n")} onChange={(e)=>update("education", e.target.value.split("\n"))}/>
        </div>

        <div className="cms-field">
          <span>학회 · 협회 (한 줄에 하나)</span>
          <textarea rows="4" value={(d.organizations || []).join("\n")} onChange={(e)=>update("organizations", e.target.value.split("\n"))}/>
        </div>

        <div className="cms-field">
          <span>경력 (한 줄에 하나, "현|텍스트" 또는 "전|텍스트")</span>
          <textarea rows="6" value={(d.career || []).map(c => (c.period || "현") + "|" + (c.text || "")).join("\n")}
            onChange={(e)=>update("career", e.target.value.split("\n").map(line => { const [p, ...rest] = line.split("|"); return { period: (p || "현").trim(), text: rest.join("|").trim() }; }))}/>
        </div>

        <div className="cms-field">
          <span>수상 · 표창 (한 줄에 하나)</span>
          <textarea rows="3" value={(d.awards || []).join("\n")} onChange={(e)=>update("awards", e.target.value.split("\n"))}/>
        </div>

        <div className="cms-field">
          <span>추가 수련 · 이수 과정 (한 줄에 하나)</span>
          <textarea rows="4" value={(d.training || []).join("\n")} onChange={(e)=>update("training", e.target.value.split("\n"))}/>
        </div>

        {saved && <div className="cms__saved-toast"><i data-lucide="check" style={{width:14,height:14}}/> 저장되었습니다. (데모에서는 실제 반영되지 않습니다.)</div>}
      </div>
    </section>
  );
}

/* ─── PROGRAMS ─────────────────────────────────────────────── */
function ProgramsAdminView({ programs }) {
  const { items, create, update, remove, toggleVisible, move } = useEditableList(programs, { idPrefix: "p" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="cms__card">
      <header>
        <h3>프로그램 ({items.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ _new: true, title: "", desc: "", ageRange: "AGES 3-5", icon: "sparkles", tone: "orange", tags: [], meta: "", photo: "", detail: { intro: "", sections: [{ heading: "프로그램 목적", body: "" }, { heading: "운영 방식", body: "" }, { heading: "기대 효과", body: "" }] } })}>
          <i data-lucide="plus" style={{width:14,height:14}}/> 프로그램 추가
        </button>
      </header>
      <table className="cms__table">
        <thead><tr><th></th><th>프로그램</th><th>연령</th><th>회기 · 시간</th><th>태그</th><th>상태</th><th></th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="cms__thumb-sm" style={p.photo
                  ? { backgroundImage: `url(${p.photo})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: `linear-gradient(135deg, ${p.tone === "orange" ? "#F8AD46,#FFC857" : p.tone === "green" ? "#7DBE32,#C8E5A0" : p.tone === "yellow" ? "#FFC857,#FCD79A" : "#C8E5A0,#FFEDC4"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!p.photo && <i data-lucide={p.icon} style={{width:20,height:20,color:"#fff"}}/>}
                </div>
              </td>
              <td><strong>{p.title || <span className="muted">(이름 없음)</span>}</strong><div className="muted">{p.desc}</div></td>
              <td>{p.ageRange}</td>
              <td>{p.meta}</td>
              <td><div className="cms__chips">{(p.tags || []).map(t => <span key={t} className="cms__pill cms__pill--neutral">#{t}</span>)}</div></td>
              <td><span className={"cms__pill " + (p.visible === false ? "cms__pill--neutral" : "cms__pill--green")}>{p.visible === false ? "비공개" : "노출"}</span></td>
              <td>
                <RowActions
                  visible={p.visible}
                  onEdit={() => setEditing({ ...p })}
                  onDelete={() => remove(p.id)}
                  onUp={() => move(p.id, -1)}
                  onDown={() => move(p.id, 1)}
                  onToggle={() => toggleVisible(p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <CrudModal
          title={editing._new ? "프로그램 추가" : "프로그램 수정"}
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => { editing._new ? create(d) : update(d); setEditing(null); }}
          fields={[
            { key: "photo", label: "대표 사진", kind: "photo" },
            { key: "title", label: "프로그램 이름" },
            { key: "ageRange", label: "연령대", placeholder: "예) AGES 3–5 / PARENTS / 전 연령" },
            { key: "desc", label: "요약 설명 (카드)", kind: "textarea" },
            { key: "meta", label: "회기 · 시간", placeholder: "예) 1:1 · 주 2회 · 각 40분" },
            { key: "tags", label: "태그 (쉼표로 구분)", kind: "tags" },
            { key: "icon", label: "아이콘 (Lucide 이름)", placeholder: "예) sparkles / users / heart" },
            { key: "tone", label: "컬러 톤", kind: "select", options: ["orange", "green", "yellow", "green-soft"] },
            { key: "detail.intro", label: "상세 페이지 인트로", kind: "textarea", placeholder: "프로그램 첫 인사 한두 문장" },
            { key: "detail.sections", label: "상세 페이지 본문 섹션", kind: "sections" },
          ]}
        />
      )}
    </section>
  );
}

/* ─── THERAPISTS ───────────────────────────────────────────── */
function TherapistsAdminView({ therapists }) {
  const { items, create, update, remove, toggleVisible, move } = useEditableList(therapists, { idPrefix: "t" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="cms__card">
      <header>
        <h3>치료사 소개 ({items.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ _new: true, name: "", role: "치료사", photo: "", summary: "", education: [], career: [], certifications: [], completion: "" })}>
          <i data-lucide="plus" style={{width:14,height:14}}/> 치료사 추가
        </button>
      </header>
      <div className="cms__teacher-grid">
        {items.map((t) => (
          <div key={t.id} className="cms__teacher">
            <div className="cms__teacher-avatar" style={t.photo
              ? { backgroundImage: `url(${t.photo})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg,#F8AD46,#7DBE32)" }}>
              {!t.photo && (t.initial || (t.name || "").slice(0,1))}
            </div>
            <strong>{t.name || "(이름 없음)"}</strong>
            <span className="muted">{t.role}</span>
            <div className="cms__chips">
              <span className={"cms__pill " + (t.visible === false ? "cms__pill--neutral" : "cms__pill--green")}>{t.visible === false ? "비공개" : "노출"}</span>
            </div>
            <div className="cms__teacher-actions">
              <RowActions
                visible={t.visible}
                onEdit={() => setEditing({ ...t })}
                onDelete={() => remove(t.id)}
                onUp={() => move(t.id, -1)}
                onDown={() => move(t.id, 1)}
                onToggle={() => toggleVisible(t.id)}
              />
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <CrudModal
          title={editing._new ? "치료사 추가" : "치료사 수정"}
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => { editing._new ? create(d) : update(d); setEditing(null); }}
          fields={[
            { key: "photo", label: "프로필 사진", kind: "photo" },
            { key: "name", label: "성함" },
            { key: "role", label: "역할" },
            { key: "summary", label: "한 줄 소개", kind: "textarea" },
            { key: "education", label: "학력 (한 줄에 하나)", kind: "list" },
            { key: "career", label: "경력 (한 줄에 하나, '현|텍스트' 또는 '전|텍스트' 형식)", kind: "career" },
            { key: "certifications", label: "자격증 (한 줄에 하나)", kind: "list" },
            { key: "completion", label: "이수 과정" },
          ]}
        />
      )}
    </section>
  );
}

/* ─── NOTICES ──────────────────────────────────────────────── */
function NoticesAdminView({ notices }) {
  const { items, create, update, remove, toggleVisible, move } = useEditableList(notices, { idPrefix: "n" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="cms__card">
      <header>
        <h3>공지사항 ({items.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ _new: true, title: "", date: new Date().toISOString().slice(0,10).replace(/-/g,"."), pinned: false, views: 0 })}>
          <i data-lucide="plus" style={{width:14,height:14}}/> 공지 작성
        </button>
      </header>
      <table className="cms__table">
        <thead><tr><th style={{width: 30}}></th><th>제목</th><th>작성일</th><th>조회수</th><th>상태</th><th></th></tr></thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.id}>
              <td>{n.pinned ? <i data-lucide="pin" style={{width:14,height:14,color:"#F8AD46"}}/> : null}</td>
              <td><strong>{n.title || "(제목 없음)"}</strong></td>
              <td>{n.date}</td>
              <td>{n.views}</td>
              <td><span className={"cms__pill " + (n.visible === false ? "cms__pill--neutral" : "cms__pill--green")}>{n.visible === false ? "비공개" : "게시중"}</span></td>
              <td>
                <RowActions
                  visible={n.visible}
                  onEdit={() => setEditing({ ...n })}
                  onDelete={() => remove(n.id)}
                  onUp={() => move(n.id, -1)}
                  onDown={() => move(n.id, 1)}
                  onToggle={() => toggleVisible(n.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <CrudModal
          title={editing._new ? "공지 작성" : "공지 수정"}
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => { editing._new ? create(d) : update(d); setEditing(null); }}
          fields={[
            { key: "title", label: "제목" },
            { key: "date", label: "작성일", placeholder: "2026.05.25" },
            { key: "pinned", label: "상단 고정", kind: "checkbox" },
            { key: "body", label: "본문", kind: "textarea" },
          ]}
        />
      )}
    </section>
  );
}

/* ─── GALLERY ──────────────────────────────────────────────── */
function GalleryAdminView({ gallery }) {
  const { items, create, update, remove, toggleVisible, move } = useEditableList(gallery, { idPrefix: "g" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  const onBulk = (files) => {
    Array.from(files || []).forEach((f) => readImageFile(f, (dataUrl) => {
      create({ src: dataUrl, title: f.name.replace(/\.[a-z]+$/i, ""), span: 1 });
    }));
  };
  return (
    <section className="cms__card">
      <header>
        <h3>갤러리 ({items.length})</h3>
        <label className="btn btn-primary btn-sm" style={{ cursor: "pointer" }}>
          <i data-lucide="upload" style={{width:14,height:14}}/> 다중 업로드
          <input type="file" accept="image/*" multiple hidden onChange={(e) => onBulk(e.target.files)}/>
        </label>
      </header>
      <div className="cms__gallery-grid">
        {items.map((g, i) => (
          <div key={g.id} className={"cms__gallery-cell" + (g.visible === false ? " is-hidden" : "")}>
            <div className="cms__gallery-img" style={{ backgroundImage: `url(${g.src})` }} />
            <div className="cms__gallery-meta">
              <span className="cms__pill cms__pill--neutral">#{i + 1}</span>
              <span>{g.title}</span>
            </div>
            <div className="cms__gallery-tools">
              <button className="icon-btn" onClick={() => move(g.id, -1)}><i data-lucide="chevron-left" style={{width:16,height:16}}/></button>
              <button className="icon-btn" onClick={() => move(g.id, 1)}><i data-lucide="chevron-right" style={{width:16,height:16}}/></button>
              <button className="icon-btn" onClick={() => toggleVisible(g.id)}><i data-lucide={g.visible === false ? "eye-off" : "eye"} style={{width:16,height:16}}/></button>
              <button className="icon-btn" onClick={() => setEditing({ ...g })}><i data-lucide="pencil" style={{width:16,height:16}}/></button>
              <button className="icon-btn" onClick={() => remove(g.id)}><i data-lucide="trash-2" style={{width:16,height:16}}/></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <CrudModal
          title="갤러리 수정"
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => { update(d); setEditing(null); }}
          fields={[
            { key: "src", label: "사진", kind: "photo" },
            { key: "title", label: "캡션" },
            { key: "span", label: "가로 너비", kind: "select", options: ["1", "2"] },
          ]}
        />
      )}
    </section>
  );
}

/* ─── POPUPS ───────────────────────────────────────────────── */
function popupStatus(p) {
  const now = Date.now();
  if (!p.isActive) return { label: "비활성", cls: "cms__pill--neutral" };
  const s = p.startAt ? new Date(p.startAt + "T00:00:00").getTime() : -Infinity;
  const e = p.endAt ? new Date(p.endAt + "T23:59:59").getTime() : Infinity;
  if (now < s) return { label: "예약중", cls: "cms__pill--orange" };
  if (now > e) return { label: "종료됨", cls: "cms__pill--neutral" };
  return { label: "노출중", cls: "cms__pill--green" };
}

function PopupAdminView({ popups }) {
  const { items, create, update } = useEditableList(popups, { idPrefix: "pop" });
  const [editing, setEditing] = useStateAdmin(null);
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });

  const today = new Date().toISOString().slice(0, 10);
  const live = items.filter(p => !p.deletedAt);

  const softDelete = (p) => {
    if (!confirm("이 팝업을 삭제하시겠습니까? (복구 가능한 소프트 삭제)")) return;
    update({ ...p, deletedAt: new Date().toISOString(), updatedAt: today });
  };

  const newPopup = () => setEditing({
    _new: true, title: "", content: "", imageUrl: "", linkUrl: "",
    startAt: today, endAt: today, isActive: true, allowHideToday: true,
    createdAt: today, updatedAt: today, deletedAt: null,
  });

  return (
    <section className="cms__card">
      <header>
        <h3>팝업 관리 ({live.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={newPopup}>
          <i data-lucide="plus" style={{width:14,height:14}}/> 팝업 생성
        </button>
      </header>
      <table className="cms__table">
        <thead><tr><th></th><th>제목</th><th>노출 기간</th><th>오늘 숨김</th><th>상태</th><th></th></tr></thead>
        <tbody>
          {live.map((p) => {
            const st = popupStatus(p);
            return (
              <tr key={p.id}>
                <td>
                  <div className="cms__thumb-sm" style={p.imageUrl
                    ? { backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: "var(--brand-gradient-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {!p.imageUrl && <i data-lucide="message-square" style={{width:18,height:18,color:"var(--brand-green-deep)"}}/>}
                  </div>
                </td>
                <td><strong>{p.title || <span className="muted">(제목 없음)</span>}</strong><div className="muted">{(p.content || "").split("\n")[0]}</div></td>
                <td className="muted">{p.startAt || "—"} ~ {p.endAt || "—"}</td>
                <td>{p.allowHideToday ? "허용" : "—"}</td>
                <td><span className={"cms__pill " + st.cls}>{st.label}</span></td>
                <td>
                  <button className="icon-btn" onClick={() => update({ ...p, isActive: !p.isActive, updatedAt: today })} title={p.isActive ? "비활성화" : "활성화"}>
                    <i data-lucide={p.isActive ? "eye" : "eye-off"} style={{width:16,height:16}}/>
                  </button>
                  <button className="icon-btn" onClick={() => setEditing({ ...p })}><i data-lucide="pencil" style={{width:16,height:16}}/></button>
                  <button className="icon-btn" onClick={() => softDelete(p)}><i data-lucide="trash-2" style={{width:16,height:16}}/></button>
                </td>
              </tr>
            );
          })}
          {live.length === 0 && (
            <tr><td colSpan="6"><div className="cms__empty"><i data-lucide="message-square" style={{width:32,height:32}}/><p>등록된 팝업이 없습니다. "팝업 생성"으로 추가해 주세요.</p></div></td></tr>
          )}
        </tbody>
      </table>
      {editing && (
        <CrudModal
          title={editing._new ? "팝업 생성" : "팝업 수정"}
          draft={editing}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            const stamped = { ...d, updatedAt: today };
            editing._new ? create(stamped) : update(stamped);
            setEditing(null);
          }}
          fields={[
            { key: "imageUrl", label: "이미지", kind: "photo" },
            { key: "title", label: "제목" },
            { key: "content", label: "내용", kind: "textarea" },
            { key: "linkUrl", label: "링크 URL", placeholder: "#contact 또는 https://…" },
            { key: "_dates", kind: "date-row", keys: ["startAt", "endAt"], labels: ["노출 시작일", "노출 종료일"] },
            { key: "isActive", label: "활성화", kind: "toggle" },
            { key: "allowHideToday", label: "오늘 하루 숨김 허용", kind: "toggle" },
          ]}
        />
      )}
    </section>
  );
}

/* ─── MENUS (TOP NAV) ──────────────────────────────────────── */
function MenuAdminView({ nav }) {
  const [items, setItems] = useStateAdmin(() => nav.map(n => ({ ...n, visible: n.visible !== false })));
  const [savedTick, setSavedTick] = useStateAdmin(false);
  const [deleteTarget, setDeleteTarget] = useStateAdmin(null);
  const [confirmText, setConfirmText] = useStateAdmin("");

  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); }, [items, deleteTarget]);

  const updateLabel = (id, label) => {
    setItems(p => p.map(n => n.id === id ? { ...n, label } : n));
    setSavedTick(false);
  };
  const toggleVisible = (id) => {
    setItems(p => p.map(n => n.id === id ? { ...n, visible: !n.visible } : n));
  };
  const move = (id, dir) => {
    setItems(p => {
      const idx = p.findIndex(n => n.id === id);
      const ni = idx + dir;
      if (idx === -1 || ni < 0 || ni >= p.length) return p;
      const out = [...p];
      [out[idx], out[ni]] = [out[ni], out[idx]];
      return out;
    });
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (confirmText.trim() !== deleteTarget.label.trim()) return;
    setItems(p => p.filter(n => n.id !== deleteTarget.id));
    setDeleteTarget(null);
    setConfirmText("");
  };
  const save = () => {
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 2400);
  };

  return (
    <>
      <div className="cms-warn">
        <i data-lucide="alert-triangle" style={{width:18,height:18}}/>
        <div>
          <strong>메뉴는 삭제하지 마시고 숨김 처리를 권장합니다.</strong>
          <p>삭제한 메뉴는 복구되지 않습니다. 잠시 보이지 않게 하고 싶다면 <i data-lucide="eye" style={{width:13,height:13,verticalAlign:"-2px"}}/> 표시/숨김 토글을 사용하세요. 이름은 언제든 자유롭게 바꿔도 사이트의 페이지 연결은 그대로 유지됩니다.</p>
        </div>
      </div>

      <section className="cms__card">
        <header>
          <h3>상단 메뉴 ({items.length})</h3>
          <div className="row" style={{gap:8}}>
            {savedTick && <span className="cms__pill cms__pill--green"><i data-lucide="check" style={{width:12,height:12}}/> 저장됨</span>}
            <button className="btn btn-primary btn-sm" onClick={save}>
              <i data-lucide="save" style={{width:14,height:14}}/> 저장
            </button>
          </div>
        </header>

        <table className="cms__table cms-menu-table">
          <thead><tr><th style={{width:36}}></th><th>메뉴 이름</th><th style={{width:160}}>연결된 페이지</th><th style={{width:120}}>상태</th><th style={{width:140}}>순서</th><th style={{width:60}}></th></tr></thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={n.id} className={n.visible ? "" : "is-hidden"}>
                <td><span className="cms__handle"><i data-lucide="grip-vertical" style={{width:14,height:14}}/></span></td>
                <td>
                  <input
                    type="text"
                    className="cms-menu-input"
                    value={n.label}
                    onChange={(e)=>updateLabel(n.id, e.target.value)}
                    placeholder="메뉴 이름"
                  />
                </td>
                <td><code className="cms-menu-code">/{n.id}</code></td>
                <td>
                  <button className={"cms__pill " + (n.visible ? "cms__pill--green" : "cms__pill--neutral")} onClick={() => toggleVisible(n.id)} style={{border:"none",cursor:"pointer"}}>
                    <i data-lucide={n.visible ? "eye" : "eye-off"} style={{width:12,height:12}}/>
                    {n.visible ? "표시" : "숨김"}
                  </button>
                </td>
                <td>
                  <div className="cms__row-actions">
                    <button className="icon-btn" onClick={()=>move(n.id, -1)} disabled={i===0}><i data-lucide="chevron-up" style={{width:16,height:16}}/></button>
                    <button className="icon-btn" onClick={()=>move(n.id, 1)} disabled={i===items.length-1}><i data-lucide="chevron-down" style={{width:16,height:16}}/></button>
                  </div>
                </td>
                <td>
                  <button className="icon-btn cms-menu-del" onClick={()=>{ setDeleteTarget(n); setConfirmText(""); }} title="삭제 (권장하지 않음)">
                    <i data-lucide="trash-2" style={{width:16,height:16}}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cms-menu-hint">
          <i data-lucide="info" style={{width:14,height:14}}/>
          <span>메뉴 이름은 사이트 상단 네비게이션과 푸터에 동시 반영됩니다. 메뉴를 숨기면 사이트에서는 보이지 않지만 직접 URL로는 접근할 수 있습니다.</span>
        </div>
      </section>

      {deleteTarget && (
        <div className="cms-modal" onClick={()=>setDeleteTarget(null)}>
          <div className="cms-modal__inner cms-modal--danger" onClick={(e)=>e.stopPropagation()}>
            <header className="cms-modal__head">
              <h3><i data-lucide="alert-triangle" style={{width:18,height:18,verticalAlign:"-3px",color:"#D9534F"}}/> 메뉴를 삭제하시겠습니까?</h3>
              <button className="icon-btn" onClick={()=>setDeleteTarget(null)}><i data-lucide="x" style={{width:18,height:18}}/></button>
            </header>
            <div className="cms-modal__body">
              <p style={{margin:0, lineHeight:1.7}}>
                <strong>"{deleteTarget.label}"</strong> 메뉴는 삭제 후 <strong style={{color:"#D9534F"}}>복구되지 않습니다.</strong> 잠시 가리고 싶은 거라면 닫고 <strong>숨김 토글</strong>을 사용해 주세요.
              </p>
              <label className="cms-field" style={{marginTop:16}}>
                <span>삭제하려면 메뉴 이름 <code>{deleteTarget.label}</code> 을 입력해 주세요</span>
                <input type="text" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} autoFocus/>
              </label>
            </div>
            <footer className="cms-modal__foot">
              <button className="btn btn-ghost" onClick={()=>setDeleteTarget(null)}>취소 (숨김 토글 사용)</button>
              <button className="btn btn-danger" disabled={confirmText.trim() !== deleteTarget.label.trim()} onClick={confirmDelete}>
                <i data-lucide="trash-2" style={{width:14,height:14}}/> 영구 삭제
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── SECTIONS ─────────────────────────────────────────────── */
function SectionsAdminView() {
  const rows = [
    { id: "hero",       label: "Hero 슬라이드", on: true },
    { id: "about",      label: "센터 소개",     on: true },
    { id: "programs",   label: "프로그램",      on: true },
    { id: "therapists", label: "치료사 소개",   on: true },
    { id: "notices",    label: "공지사항",      on: true },
    { id: "gallery",    label: "갤러리",        on: true },
    { id: "homemap",    label: "홈 — 오시는 길 지도", on: true },
    { id: "contact",    label: "상담 문의",     on: true },
  ];
  return (
    <section className="cms__card">
      <header><h3>섹션 ON / OFF</h3><p className="muted" style={{fontSize:13,margin:0}}>홈페이지에 표시할 섹션을 선택하세요.</p></header>
      <div className="cms__toggles">
        {rows.map(r => (
          <div key={r.id} className="cms__toggle-row">
            <div>
              <strong>{r.label}</strong>
              <span className="muted">/{r.id}</span>
            </div>
            <label className="cms__switch">
              <input type="checkbox" defaultChecked={r.on}/>
              <span/>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CRUD MODAL ───────────────────────────────────────────── */
function CrudModal({ title, draft, onClose, onSave, fields }) {
  const [d, setD] = useStateAdmin({ ...draft, tags: draft.tags ? [...draft.tags] : [] });
  useEffectAdmin(() => { if (window.lucide) window.lucide.createIcons(); });
  // Dot-notation get/set so fields can address nested keys like "detail.intro".
  const get = (k) => k.split(".").reduce((o, part) => (o == null ? undefined : o[part]), d);
  const setNested = (obj, path, value) => {
    if (path.length === 1) return { ...obj, [path[0]]: value };
    const head = path[0];
    return { ...obj, [head]: setNested(obj && typeof obj[head] === "object" && obj[head] !== null ? obj[head] : {}, path.slice(1), value) };
  };
  const update = (k, v) => setD(o => setNested(o, k.split("."), v));
  const handlePhoto = (key, file) => readImageFile(file, (data) => update(key, data));

  return (
    <div className="cms-modal" onClick={onClose}>
      <div className="cms-modal__inner" onClick={(e) => e.stopPropagation()}>
        <header className="cms-modal__head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><i data-lucide="x" style={{width:18,height:18}}/></button>
        </header>
        <div className="cms-modal__body">
          {fields.map((f) => {
            if (f.kind === "photo") {
              return (
                <label key={f.key} className="cms-field cms-field--photo">
                  <span>{f.label}</span>
                  <div className="cms-photo-input">
                    <div className="cms-photo-input__preview" style={get(f.key) ? { backgroundImage: `url(${get(f.key)})` } : undefined}>
                      {!get(f.key) && <i data-lucide="image" style={{width:32,height:32}}/>}
                    </div>
                    <div className="cms-photo-input__actions">
                      <label className="btn btn-secondary btn-sm">
                        <i data-lucide="upload" style={{width:14,height:14}}/> 파일 선택
                        <input type="file" accept="image/*" hidden onChange={(e) => handlePhoto(f.key, e.target.files?.[0])}/>
                      </label>
                      {get(f.key) && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => update(f.key, "")}>
                          <i data-lucide="trash-2" style={{width:14,height:14}}/> 제거
                        </button>
                      )}
                      <input type="text" placeholder="또는 이미지 URL" value={typeof get(f.key) === "string" && !get(f.key)?.startsWith("data:") ? get(f.key) : ""} onChange={(e) => update(f.key, e.target.value)} />
                    </div>
                  </div>
                </label>
              );
            }
            if (f.kind === "select") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <select value={get(f.key)} onChange={(e) => update(f.key, e.target.value)}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              );
            }
            if (f.kind === "checkbox") {
              return (
                <label key={f.key} className="cms-field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={!!get(f.key)} onChange={(e) => update(f.key, e.target.checked)} />
                  <span>{f.label}</span>
                </label>
              );
            }
            if (f.kind === "toggle") {
              return (
                <div key={f.key} className="cms-field" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span>{f.label}</span>
                  <label className="cms__switch">
                    <input type="checkbox" checked={!!get(f.key)} onChange={(e) => update(f.key, e.target.checked)} />
                    <span/>
                  </label>
                </div>
              );
            }
            if (f.kind === "date") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <input type="date" value={get(f.key) || ""} onChange={(e) => update(f.key, e.target.value)} />
                </label>
              );
            }
            if (f.kind === "date-row") {
              return (
                <div key={f.key} className="cms-field-row">
                  <label className="cms-field">
                    <span>{f.labels[0]}</span>
                    <input type="date" value={d[f.keys[0]] || ""} onChange={(e) => update(f.keys[0], e.target.value)} />
                  </label>
                  <label className="cms-field">
                    <span>{f.labels[1]}</span>
                    <input type="date" value={d[f.keys[1]] || ""} onChange={(e) => update(f.keys[1], e.target.value)} />
                  </label>
                </div>
              );
            }
            if (f.kind === "textarea") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <textarea rows="3" value={get(f.key) || ""} onChange={(e) => update(f.key, e.target.value)} placeholder={f.placeholder} />
                </label>
              );
            }
            if (f.kind === "tags") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <input type="text" value={(get(f.key) || []).join(", ")} onChange={(e) => update(f.key, e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
                </label>
              );
            }
            if (f.kind === "list") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <textarea rows="4" value={(get(f.key) || []).join("\n")} onChange={(e) => update(f.key, e.target.value.split("\n"))}/>
                </label>
              );
            }
            if (f.kind === "sections") {
              const sectionsArr = Array.isArray(get(f.key)) ? get(f.key) : [];
              const setArr = (next) => update(f.key, next);
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <div className="cms-sections">
                    {sectionsArr.map((s, idx) => (
                      <div key={idx} className="cms-section-row">
                        <div className="cms-section-row__head">
                          <span className="cms-section-row__num">{String(idx + 1).padStart(2, "0")}</span>
                          <input
                            type="text"
                            value={s.heading || ""}
                            placeholder="소제목 (예: 프로그램 목적)"
                            onChange={(e)=>setArr(sectionsArr.map((it,i)=>i===idx?{...it,heading:e.target.value}:it))}
                          />
                          <button type="button" className="icon-btn" onClick={()=>setArr(sectionsArr.filter((_,i)=>i!==idx))}>
                            <i data-lucide="trash-2" style={{width:14,height:14}}/>
                          </button>
                        </div>
                        <textarea
                          rows="3"
                          value={s.body || ""}
                          placeholder="본문"
                          onChange={(e)=>setArr(sectionsArr.map((it,i)=>i===idx?{...it,body:e.target.value}:it))}
                        />
                      </div>
                    ))}
                    <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setArr([...sectionsArr, { heading: "", body: "" }])}>
                      <i data-lucide="plus" style={{width:14,height:14}}/> 섹션 추가
                    </button>
                  </div>
                </label>
              );
            }
            if (f.kind === "career") {
              return (
                <label key={f.key} className="cms-field">
                  <span>{f.label}</span>
                  <textarea rows="6" value={(get(f.key) || []).map(c => (c.period || "현") + "|" + (c.text || "")).join("\n")} onChange={(e) => update(f.key, e.target.value.split("\n").map(line => { const [p, ...rest] = line.split("|"); return { period: (p || "현").trim(), text: rest.join("|").trim() }; }))}/>
                </label>
              );
            }
            return (
              <label key={f.key} className="cms-field">
                <span>{f.label}</span>
                <input type="text" value={get(f.key) || ""} onChange={(e) => update(f.key, e.target.value)} placeholder={f.placeholder} />
              </label>
            );
          })}
        </div>
        <footer className="cms-modal__foot">
          <button className="btn btn-ghost" onClick={onClose}>취소</button>
          <button className="btn btn-primary" onClick={() => onSave(d)}>저장</button>
        </footer>
      </div>
    </div>
  );
}
