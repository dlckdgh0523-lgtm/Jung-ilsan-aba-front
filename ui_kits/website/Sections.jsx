/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

/* Reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, as: As = "div", className = "" }) {
  const ref = useRefS(null);
  useEffectS(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <As ref={ref} className={"reveal " + className}>{children}</As>;
}

/* ── About ─────────────────────────────────────────────────── */
function AboutSection({ data, asPage }) {
  const profile = window.SITE_DATA && window.SITE_DATA.directorProfile;
  const centerInfo = window.SITE_DATA && window.SITE_DATA.centerInfo;
  return (
    <section id="about" className={"section" + (asPage ? "" : " alt-bg")} data-screen-label="About">
      <div className="container">
        <div className="about__grid">
          <Reveal className="about__copy">
            {!asPage && <span className="eyebrow">{data.eyebrow}</span>}
            {!asPage && <h2 className="display-2">{data.title.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}</h2>}
            {asPage && <h2 className="display-2">아이에 대해 혼자 고민하지 않으셔도 됩니다.</h2>}
            <div className="about__body">
              {data.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="about__sig">— 센터장 정지은</div>
          </Reveal>
          <Reveal className="about__media" delay={160}>
            <div className="about__photo" style={{ backgroundImage: `url(${(profile && profile.photo) || (window.ASSETS && window.ASSETS["director"]) || "../../assets/photo-director.jpg"})` }} />
          </Reveal>
        </div>
      </div>

      {asPage && profile && <DirectorProfile profile={profile} />}
    </section>
  );
}

function DirectorProfile({ profile }) {
  return (
    <div className="director-profile">
      <div className="container">
        <Reveal className="director-profile__head">
          <span className="eyebrow">DIRECTOR PROFILE</span>
          <h2 className="h1">센터장 프로필</h2>
          <p>{profile.sub}</p>
        </Reveal>

        <div className="director-profile__grid">
          {/* LEFT COLUMN */}
          <div className="director-profile__col">
            <Reveal className="profile-card">
              <h3 className="profile-card__title"><Icon name="award" size={18}/> 자격 및 인증</h3>
              <ul className="profile-card__list profile-card__list--code">
                {profile.certifications.map((c, i) => (
                  <li key={i}>
                    <strong>{c.code}</strong>
                    <span>{c.desc}</span>
                  </li>
                ))}
              </ul>
              <div className="profile-card__marks" aria-label="QABA 공인">
                <img src="../../assets/qaba-training.png" alt="QABA Approved Training Program" />
                <img src="../../assets/qaba-ce.png" alt="QABA Continuing Education Approved Provider" />
              </div>
            </Reveal>

            <Reveal className="profile-card" delay={60}>
              <h3 className="profile-card__title"><Icon name="graduation-cap" size={18}/> 학력</h3>
              <ul className="profile-card__list profile-card__list--bullet">
                {profile.education.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </Reveal>

            <Reveal className="profile-card" delay={120}>
              <h3 className="profile-card__title"><Icon name="users" size={18}/> 학회 및 협회</h3>
              <ul className="profile-card__list profile-card__list--bullet">
                {profile.societies.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Reveal>

            <Reveal className="profile-card" delay={180}>
              <h3 className="profile-card__title"><Icon name="trophy" size={18}/> 수상</h3>
              <ul className="profile-card__list profile-card__list--bullet">
                {profile.awards.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </Reveal>
          </div>

          {/* RIGHT COLUMN */}
          <div className="director-profile__col">
            <Reveal className="profile-card">
              <h3 className="profile-card__title"><Icon name="briefcase" size={18}/> 경력</h3>
              <ul className="profile-card__timeline">
                {profile.career.map((c, i) => (
                  <li key={i}>
                    <span className={"timeline__pin" + (c.period === "현" ? " is-current" : "")}>{c.period}</span>
                    <span className="timeline__text">{c.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="profile-card" delay={60}>
              <h3 className="profile-card__title"><Icon name="file-text" size={18}/> 논문</h3>
              <ul className="profile-card__papers">
                {profile.papers.map((p, i) => (
                  <li key={i}>
                    <span className="paper__year">{p.year}</span>
                    <span className="paper__title">{p.title}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="profile-card" delay={120}>
              <h3 className="profile-card__title"><Icon name="book-open" size={18}/> 추가 수련 및 자격증</h3>
              <div className="profile-card__chips">
                {profile.training.map((t, i) => (
                  <span key={i} className="profile-chip">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function CenterInfoBlock({ info }) {
  return (
    <div className="center-info">
      <div className="container">
        <Reveal className="center-info__head">
          <span className="eyebrow">{info.eyebrow}</span>
          <h2 className="h1">{info.title}</h2>
          <p>{info.sub}</p>
        </Reveal>

        <div className="center-info__highlights">
          {info.highlights.map((h, i) => (
            <Reveal key={i} className="highlight-card" delay={i * 70}>
              <div className="highlight-card__icon"><Icon name={h.icon} size={22}/></div>
              <h4>{h.title}</h4>
              <p>{h.desc}</p>
            </Reveal>
          ))}
        </div>

        <div className="center-info__schedule">
          <Reveal className="schedule-card">
            <div className="schedule-card__head">
              <Icon name="sun" size={18}/>
              <h3>조기교실</h3>
              <span className="muted">매일 진행 · 10분 부모 상담 포함</span>
            </div>
            <div className="schedule-card__rows">
              {info.earlyClasses.map((c, i) => (
                <div key={i} className="schedule-row">
                  <div className="schedule-row__name">{c.name}</div>
                  <div className="schedule-row__time">{c.time}</div>
                  <div className="schedule-row__note">{c.consult}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="schedule-card" delay={80}>
            <div className="schedule-card__head">
              <Icon name="user" size={18}/>
              <h3>개별 치료</h3>
              <span className="muted">아동 중재 + 부모 교육 10분</span>
            </div>
            <div className="schedule-card__rows">
              {info.individualSessions.map((c, i) => (
                <div key={i} className="schedule-row">
                  <div className="schedule-row__name">{c.name}</div>
                  <div className="schedule-row__time">{c.time}</div>
                  <div className="schedule-row__note">{c.consult}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="center-info__note">
          <Icon name="message-square-heart" size={18}/>
          <p>{info.closingNote}</p>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Programs ──────────────────────────────────────────────── */
const PROGRAM_TONES = {
  "orange":      { from: "#F8AD46", to: "#FFC857", text: "#7C4A0E" },
  "green":       { from: "#7DBE32", to: "#C8E5A0", text: "#2E5A0F" },
  "yellow":      { from: "#FFC857", to: "#FCD79A", text: "#7C4A0E" },
  "green-soft":  { from: "#C8E5A0", to: "#FFEDC4", text: "#2E5A0F" },
};

function ProgramsSection({ programs, asPage }) {
  return (
    <section id="programs" className="section" data-screen-label="Programs">
      <div className="container">
        {!asPage && (
          <div className="section-head">
            <span className="eyebrow">PROGRAMS</span>
            <h2 className="display-2">아이에게 꼭 맞는 길</h2>
            <p>관찰부터 시작해, 부모님과 함께 목표를 설계하고, 매주 진척을 공유합니다.</p>
          </div>
        )}
        <div className="programs__grid">
          {programs.map((p, i) => {
            const tone = PROGRAM_TONES[p.tone] || PROGRAM_TONES.orange;
            const hasPhoto = !!p.photo;
            return (
              <Reveal key={p.id} delay={i * 80}>
                <article
                  className="card-surface card-hover program-card program-card--clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => window.location.hash = "program-" + p.id}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.hash = "program-" + p.id; } }}
                >
                  {hasPhoto ? (
                    <div className="program-card__media">
                      <div className="program-card__img img-zoom" style={{ backgroundImage: `url(${p.photo})` }} />
                    </div>
                  ) : (
                    <div className="program-tile" style={{ background: `linear-gradient(135deg, ${tone.from} 0%, ${tone.to} 100%)` }}>
                      <div className="program-tile__icon"><Icon name={p.icon} size={56} strokeWidth={1.5} /></div>
                      <div className="program-tile__deco" aria-hidden="true">
                        <span className="program-tile__dot" style={{ left: "12%", top: "70%" }}/>
                        <span className="program-tile__dot" style={{ left: "82%", top: "22%", width: 14, height: 14 }}/>
                        <span className="program-tile__dot" style={{ left: "70%", top: "78%", width: 6, height: 6 }}/>
                      </div>
                    </div>
                  )}
                  <div className="program-card__body">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="program-card__meta">{p.meta}</div>
                    <div className="program-card__tags">
                      {p.tags.map((t) => <span key={t} className="hash-tag">#{t}</span>)}
                    </div>
                    <div className="program-card__arrow">
                      자세히 보기 <Icon name="arrow-right" size={14}/>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Therapists ────────────────────────────────────────────── */
const TONE_MAP = {
  "orange-green":  "linear-gradient(135deg, #F8AD46, #7DBE32)",
  "green-yellow":  "linear-gradient(135deg, #7DBE32, #FFC857)",
  "yellow-green":  "linear-gradient(135deg, #FFC857, #C8E5A0)",
  "orange-yellow": "linear-gradient(135deg, #F8AD46, #FFC857)",
};

function TherapistsSection({ therapists, asPage }) {
  return (
    <section id="therapists" className={"section" + (asPage ? "" : " alt-bg")} data-screen-label="Therapists">
      <div className="container">
        {!asPage && (
          <div className="section-head">
            <span className="eyebrow">OUR THERAPISTS</span>
            <h2 className="display-2">한 아이를 위한,<br/>한 사람의 전문성</h2>
            <p>BCBA 자격을 갖춘 원장과, 풍부한 임상 경험의 치료사들이 함께합니다.</p>
          </div>
        )}
        <div className="therapists__list">
          {therapists.map((t, i) => (
            <Reveal key={t.id} delay={i * 70}>
              <article
                className="therapist-row card-surface card-hover"
                role="button"
                tabIndex={0}
                onClick={() => window.location.hash = "therapist-" + t.id}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.hash = "therapist-" + t.id; } }}
              >
                <div className="therapist-row__photo" style={{ backgroundImage: `url(${t.photo})` }} />
                <div className="therapist-row__body">
                  <span className="therapist-row__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t.name} <span>{t.role}</span></h3>
                  <p>{t.summary}</p>
                  <div className="therapist-row__more">
                    프로필 보기 <Icon name="arrow-right" size={14}/>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TherapistDetail({ therapist, onBack }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <article className="therapist-detail">
      <div className="container">
        <button className="therapist-detail__back" onClick={onBack}>
          <Icon name="arrow-left" size={16} /> 치료사 전체보기
        </button>
        <div className="therapist-detail__head">
          <div className="therapist-detail__photo" style={{ backgroundImage: `url(${therapist.photo})` }} />
          <div className="therapist-detail__head-text">
            <span className="eyebrow">OUR THERAPISTS</span>
            <h1>{therapist.name}<span>{therapist.role}</span></h1>
            <p>{therapist.summary}</p>
          </div>
        </div>

        <div className="therapist-detail__body">
          {therapist.education?.length > 0 && (
            <Reveal className="therapist-detail__block">
              <h3><Icon name="graduation-cap" size={18}/> 학력</h3>
              <ul>{therapist.education.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </Reveal>
          )}

          {therapist.career?.length > 0 && (
            <Reveal className="therapist-detail__block" delay={60}>
              <h3><Icon name="briefcase" size={18}/> 경력</h3>
              <ul className="therapist-detail__timeline">
                {therapist.career.map((c, i) => (
                  <li key={i}>
                    <span className={"timeline__pin" + (c.period === "현" ? " is-current" : "")}>{c.period}</span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {therapist.certifications?.length > 0 && (
            <Reveal className="therapist-detail__block" delay={120}>
              <h3><Icon name="award" size={18}/> 자격증</h3>
              <ul>{therapist.certifications.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </Reveal>
          )}

          {therapist.teaching?.length > 0 && (
            <Reveal className="therapist-detail__block" delay={180}>
              <h3><Icon name="megaphone" size={18}/> 강의</h3>
              <ul>{therapist.teaching.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </Reveal>
          )}

          {therapist.completion && (
            <Reveal className="therapist-detail__completion" delay={240}>
              <Icon name="badge-check" size={20}/> {therapist.completion}
            </Reveal>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Notices ───────────────────────────────────────────────── */
function NoticesSection({ notices, asPage }) {
  return (
    <section id="notices" className="section" data-screen-label="Notices">
      <div className="container">
        {!asPage && (
          <div className="section-head row" style={{ justifyContent: "space-between", alignItems: "flex-end", maxWidth: "none" }}>
            <div style={{ maxWidth: 720 }}>
              <span className="eyebrow">NOTICES</span>
              <h2 className="display-2">공지사항</h2>
            </div>
            <a className="btn btn-secondary btn-sm" href="#notices" onClick={(e)=>e.preventDefault()}>
              전체보기 <Icon name="arrow-right" size={14}/>
            </a>
          </div>
        )}
        <Reveal>
          <div className="notice-board card-surface">
            {notices.map((n) => (
              <a key={n.id} href={"#notice-" + n.id} onClick={(e)=>{e.preventDefault(); window.location.hash = "notice-" + n.id;}} className="notice-row">
                <span className={"notice-row__pin" + (n.pinned ? " is-pinned" : "")} />
                <span className="notice-row__title">
                  {n.pinned && <span className="notice-row__chip">고정</span>}
                  {n.title}
                </span>
                <span className="notice-row__meta">{n.date}</span>
                <span className="notice-row__meta">조회 {n.views}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Gallery (masonry) ─────────────────────────────────────── */
function GallerySection({ gallery, asPage }) {
  const [lightbox, setLightbox] = useStateS(null);
  return (
    <section id="gallery" className={"section" + (asPage ? "" : " alt-bg")} data-screen-label="Gallery">
      <div className="container">
        {!asPage && (
          <div className="section-head">
            <span className="eyebrow">GALLERY</span>
            <h2 className="display-2">우리 공간의 결</h2>
            <p>아이가 편안함을 느낄 수 있도록, 공간의 작은 부분까지 함께 고민했습니다.</p>
          </div>
        )}
        <div className="gallery__grid">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={i * 50}>
              <button className={"gallery__item span-" + g.span} onClick={() => setLightbox(g)}>
                <div className="gallery__img img-zoom" style={{ backgroundImage: `url(${g.src})` }} />
                <div className="gallery__caption"><Icon name="maximize-2" size={14}/> {g.title}</div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" aria-label="Close"><Icon name="x" size={22}/></button>
          <img src={lightbox.src} alt={lightbox.title} onClick={(e)=>e.stopPropagation()} />
          <div className="lightbox__caption">{lightbox.title}</div>
        </div>
      )}
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────────── */
function ContactSection({ brand, asPage }) {
  const [sent, setSent] = useStateS(false);
  const [consent, setConsent] = useStateS(false);
  const [showPrivacy, setShowPrivacy] = useStateS(false);
  const submit = (e) => {
    e.preventDefault();
    if (!consent) { alert("개인정보 수집 및 이용에 동의해 주세요."); return; }
    // Persist as a new consultation request — admin SSE picks it up
    try {
      const form = e.target;
      const payload = {
        id: "c-" + Date.now(),
        ts: Date.now(),
        parent: form.querySelector('input[name="parent"]')?.value || "",
        phone: form.querySelector('input[name="phone"]')?.value || "",
        age: form.querySelector('select[name="age"]')?.value || "",
        topic: form.querySelector('select[name="topic"]')?.selectedOptions?.[0]?.text || "",
        note: form.querySelector('textarea[name="note"]')?.value || "",
        read: false,
      };
      const list = JSON.parse(localStorage.getItem("aba-consultations") || "[]");
      list.unshift(payload);
      localStorage.setItem("aba-consultations", JSON.stringify(list.slice(0, 50)));
      try { new BroadcastChannel("aba-consult").postMessage({ kind: "new", payload }); } catch {}
    } catch {}
    setSent(true);
  };
  return (
    <section id="contact" className="section" data-screen-label="Contact">
      <div className="container">
        <div className="contact__grid">
          <Reveal className="contact__intro">
            <span className="eyebrow">CONTACT</span>
            <h2 className="display-2">지금, 부모님의<br/>첫 상담을 도와드릴게요.</h2>
            <p>전화·카카오톡·문의 폼 어느 쪽이든 편하신 방법으로 알려주세요.</p>
            <div className="contact__meta">
              <div className="contact__meta-row"><Icon name="map-pin" size={18}/> {brand.address}</div>
              <div className="contact__meta-row"><Icon name="phone"   size={18}/> {brand.phone}</div>
              <div className="contact__meta-row"><Icon name="clock"   size={18}/> {brand.hours}</div>
              <div className="contact__meta-row"><Icon name="message-circle" size={18}/> 카카오톡 · {brand.kakaoId}</div>
            </div>
            <KakaoMap brand={brand} height={300} />
          </Reveal>
          <Reveal className="contact__form-wrap" delay={120}>
            <form className="contact__form card-surface" onSubmit={submit}>
              <h3>무료 상담 예약</h3>
              <div className="form-grid">
                <label><span>부모님 성함</span><input name="parent" type="text" placeholder="홍길동" required/></label>
                <label><span>연락처</span><input name="phone" type="tel"  placeholder="010-1234-5678" required/></label>
                <label className="span2"><span>아이 연령</span>
                  <select name="age" defaultValue="만 3세">
                    <option>만 2세</option><option>만 3세</option><option>만 4세</option><option>만 5세</option><option>만 6세 이상</option>
                  </select>
                </label>
                <label className="span2"><span>상담 분야</span>
                  <select name="topic" defaultValue="">
                    <option value="" disabled>프로그램을 선택해주세요</option>
                    {(window.SITE_DATA && window.SITE_DATA.programs || []).map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                    <option value="undecided">아직 잘 모르겠어요</option>
                  </select>
                </label>
                <label className="span2"><span>상담 내용 (선택)</span><textarea name="note" rows="4" placeholder="구체적인 상담 내용을 적어주세요."></textarea></label>
                <label className="span2 check">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required/>
                  <span><strong>(필수)</strong> <a href="#privacy-consent" onClick={(e)=>{e.preventDefault(); setShowPrivacy(true);}} style={{color:"var(--brand-green-deep)", textDecoration:"underline"}}>개인정보 수집 및 이용</a>에 동의합니다.</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} disabled={!consent && !sent}>
                {sent ? "신청이 접수되었습니다 ✓" : <>상담 신청 보내기 <Icon name="arrow-right" size={16}/></>}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </section>
  );
}

function PrivacyModal({ onClose }) {
  return (
    <div className="cms-modal" onClick={onClose}>
      <div className="cms-modal__inner" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <header className="cms-modal__head">
          <h3>개인정보 수집 및 이용 동의</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18}/></button>
        </header>
        <div className="cms-modal__body" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fg-2)" }}>
          <p><strong>1. 수집 항목</strong><br/>부모님 성함, 연락처, 아이 연령, 상담 내용</p>
          <p><strong>2. 수집 및 이용 목적</strong><br/>상담 예약 접수 및 회신, 프로그램 안내</p>
          <p><strong>3. 보유 및 이용 기간</strong><br/>상담 종료 후 12개월 이내 파기. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관</p>
          <p><strong>4. 동의 거부 권리</strong><br/>본 동의를 거부할 권리가 있으며, 거부 시 상담 예약이 제한될 수 있습니다.</p>
        </div>
        <footer className="cms-modal__foot">
          <button className="btn btn-primary" onClick={onClose}>확인</button>
        </footer>
      </div>
    </div>
  );
}

function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <span className="eyebrow">PRIVACY POLICY</span>
        <h1>개인정보처리방침</h1>
        <p className="legal-page__meta">시행일자 2026.05.25</p>

        <section>
          <h2>제1조 (수집하는 개인정보 항목 및 수집 방법)</h2>
          <p>정지은 일산 ABA(이하 "센터")는 상담 신청, 회신, 프로그램 안내를 위해 아래의 개인정보를 수집합니다.</p>
          <ul>
            <li>필수항목: 부모님 성함, 연락처, 아이 연령</li>
            <li>선택항목: 상담 내용, 추가 메시지</li>
            <li>자동수집: 접속 IP, 접속 일시, 쿠키 (서비스 품질 개선 목적)</li>
          </ul>
        </section>

        <section>
          <h2>제2조 (개인정보의 이용 목적)</h2>
          <ul>
            <li>상담 예약 접수 및 회신</li>
            <li>프로그램 안내 및 일정 조율</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>
        </section>

        <section>
          <h2>제3조 (개인정보의 보유 및 이용 기간)</h2>
          <p>수집된 개인정보는 상담 종료 후 12개월 이내 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 안전하게 보관합니다.</p>
        </section>

        <section>
          <h2>제4조 (개인정보의 제3자 제공)</h2>
          <p>센터는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.</p>
        </section>

        <section>
          <h2>제5조 (이용자의 권리)</h2>
          <p>이용자는 언제든지 본인의 개인정보를 열람·정정·삭제·처리정지를 요청할 수 있습니다. 연락처: {window.SITE_DATA?.brand?.phone || "031-977-2575"}</p>
        </section>

        <section>
          <h2>제6조 (개인정보 보호책임자)</h2>
          <p>책임자: 정지은 (센터장)<br/>전화: {window.SITE_DATA?.brand?.phone || "031-977-2575"}</p>
        </section>
      </div>
    </div>
  );
}

function PrivacyConsentPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <span className="eyebrow">CONSENT</span>
        <h1>개인정보 수집 및 이용동의</h1>
        <p className="legal-page__meta">상담 신청 시 동의 필수 항목입니다.</p>

        <section>
          <h2>1. 수집·이용 항목</h2>
          <ul>
            <li>부모님 성함, 연락처(휴대전화), 아이 연령, 상담 분야, 상담 내용(선택)</li>
          </ul>
        </section>

        <section>
          <h2>2. 수집·이용 목적</h2>
          <ul>
            <li>상담 예약 확인 및 회신</li>
            <li>아이에게 적합한 프로그램 안내</li>
            <li>상담 일정 조율</li>
          </ul>
        </section>

        <section>
          <h2>3. 보유·이용 기간</h2>
          <p>상담 종료일로부터 12개월 보관 후 안전하게 파기합니다.</p>
        </section>

        <section>
          <h2>4. 동의 거부권 안내</h2>
          <p>위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으며, 동의를 거부할 경우 상담 예약 서비스 이용이 제한될 수 있습니다.</p>
        </section>
      </div>
    </div>
  );
}

window.PrivacyPolicyPage = PrivacyPolicyPage;
window.PrivacyConsentPage = PrivacyConsentPage;

function ProgramDetail({ program, onBack }) {
  const tone = (window.PROGRAM_TONES && window.PROGRAM_TONES[program.tone]) || { from: "#F8AD46", to: "#FFC857" };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <article className="program-detail">
      <div className="program-detail__hero" style={{ background: `linear-gradient(135deg, ${tone.from} 0%, ${tone.to} 100%)` }}>
        <div className="container">
          <button className="program-detail__back" onClick={onBack}>
            <Icon name="arrow-left" size={16} /> 프로그램 전체보기
          </button>
          <div className="program-detail__hero-inner">
            <div className="program-detail__icon">
              <Icon name={program.icon} size={64} strokeWidth={1.5}/>
            </div>
            <div className="program-detail__head">
              <span className="program-detail__age">{program.ageRange}</span>
              <h1>{program.title}</h1>
              <p>{program.detail?.intro || program.desc}</p>
              <div className="program-detail__meta">{program.meta}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container program-detail__body">
        {program.detail?.sections?.map((s, i) => (
          <Reveal key={i} className="program-detail__section" delay={i * 60}>
            <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </Reveal>
        ))}
        <div className="program-detail__tags">
          {program.tags.map((t) => <span key={t} className="hash-tag">#{t}</span>)}
        </div>
        <div className="program-detail__cta">
          <a className="btn btn-primary btn-lg" href="#contact" onClick={(e)=>{e.preventDefault(); window.location.hash="contact";}}>
            상담 신청하기 <Icon name="arrow-right" size={16}/>
          </a>
          <button className="btn btn-secondary btn-lg" onClick={onBack}>
            <Icon name="arrow-left" size={16}/> 프로그램 목록
          </button>
        </div>
      </div>
    </article>
  );
}

function NoticeDetail({ notice, onBack }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <article className="notice-detail">
      <div className="container">
        <button className="therapist-detail__back" onClick={onBack}>
          <Icon name="arrow-left" size={16}/> 공지 전체보기
        </button>
        <div className="notice-detail__head">
          {notice.pinned && <span className="notice-row__chip" style={{ marginBottom: 8, display: "inline-block" }}>고정</span>}
          <h1>{notice.title}</h1>
          <div className="notice-detail__meta">
            <span>{notice.date}</span>
            <span>·</span>
            <span>조회 {notice.views}</span>
          </div>
        </div>
        <div className="notice-detail__body">
          {(notice.body || "본문이 등록되지 않았습니다.").split("\n").map((p, i) =>
            p.trim() ? <p key={i}>{p}</p> : <br key={i}/>
          )}
        </div>
        <div className="notice-detail__cta">
          <button className="btn btn-secondary" onClick={onBack}><Icon name="arrow-left" size={14}/> 공지 목록</button>
        </div>
      </div>
    </article>
  );
}

window.NoticeDetail = NoticeDetail;
window.Reveal = Reveal;
window.AboutSection = AboutSection;
window.ProgramsSection = ProgramsSection;
window.ProgramDetail = ProgramDetail;
window.TherapistsSection = TherapistsSection;
window.TherapistDetail = TherapistDetail;
window.NoticesSection = NoticesSection;
window.GallerySection = GallerySection;
window.ContactSection = ContactSection;
window.PROGRAM_TONES = PROGRAM_TONES;
