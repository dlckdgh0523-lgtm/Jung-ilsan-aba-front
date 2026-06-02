/* global React */
const { useState, useEffect } = React;

/* ─────────────────────────────────────────────────────────────
   Icon — wraps Lucide.
   ───────────────────────────────────────────────────────────── */
function Icon({ name, size = 20, strokeWidth = 1.75, className = "" }) {
  const ref = React.useRef(null);
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.setAttribute("data-lucide", name);
      window.lucide.createIcons({ icons: undefined, attrs: { "stroke-width": strokeWidth } });
    }
  }, [name, strokeWidth]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      className={className}
      style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", strokeWidth }}
    />
  );
}
/* ─────────────────────────────────────────────────────────────
   Header — fixed, blurred, with multi-page nav (hash routes).
   ───────────────────────────────────────────────────────────── */
function Header({ nav, activeRoute, onNav, onAdminOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"site-header" + (scrolled || activeRoute !== "home" ? " is-scrolled" : "")}>
      <div className="container site-header__inner">
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); onNav("home"); }}>
          <img src="../../assets/logo-aba-clear.png" alt="정지은 일산 ABA" />
        </a>
        <nav className="site-nav">
          {nav.filter(n => n.visible !== false).map((n) => (
            <a
              key={n.id}
              href={"#" + n.id}
              className={"site-nav__link" + (activeRoute === n.id ? " is-active" : "")}
              onClick={(e) => { e.preventDefault(); onNav(n.id); }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <a className="btn btn-ghost btn-sm hide-mobile" href="admin.html" target="_top" aria-label="Admin">
            <Icon name="lock" size={14} /> 관리자
          </a>
          <a href="#contact" className="btn btn-white btn-sm" onClick={(e) => { e.preventDefault(); onNav("contact"); }}>
            상담 신청 <Icon name="arrow-right" size={14} />
          </a>
          <button className="icon-btn show-mobile" aria-label="Menu" onClick={() => setMobile(!mobile)}>
            <Icon name={mobile ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>
      {mobile && (
        <div className="site-nav__mobile">
          {nav.filter(n => n.visible !== false).map((n) => (
            <a key={n.id} href={"#" + n.id} onClick={(e) => { e.preventDefault(); onNav(n.id); setMobile(false); }}>{n.label}</a>
          ))}
          <a href="admin.html" target="_top" className="btn btn-ghost">
            <Icon name="lock" size={14} /> 관리자 로그인
          </a>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   Footer
   ───────────────────────────────────────────────────────────── */
function Footer({ brand, nav, onNav }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top-bleed">
        <img className="site-footer__logo" src="../../assets/logo-aba-cream.png" alt="정지은 일산 ABA" />
        <div className="site-footer__credentials" aria-label="공식 인증">
          <img src="../../assets/qaba-training.png" alt="QABA Approved Training Program" />
          <img src="../../assets/qaba-ce.png" alt="QABA Continuing Education Approved Provider" />
        </div>
      </div>
      <div className="site-footer__contact">
        <div className="site-footer__cols">
          <p><strong>운영시간 :</strong> {brand.hours}</p>
          <p><strong>문의 :</strong> {brand.phone}</p>
          <p><strong>팩스 :</strong> {brand.fax}</p>
          <p><strong>주소 :</strong> {brand.address}</p>
        </div>
      </div>
      <div className="site-footer__base">
        <div className="site-footer__base-row">
          <span>© 2026 정지은 일산 ABA · All rights reserved.</span>
          <span className="muted">CHUNG ji eun applied behavior analysis</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   Floating KakaoTalk consultation FAB.
   ───────────────────────────────────────────────────────────── */
function KakaoFab({ onClick }) {
  const [open, setOpen] = useState(false);
  const brand = (window.SITE_DATA && window.SITE_DATA.brand) || {};
  return (
    <>
      <button className="kakao-fab" onClick={() => setOpen(true)} aria-label="카카오톡으로 상담하기">
        <span className="kakao-fab__bubble">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="#181600" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.6 6.4-.2.6-.7 2.4-.8 2.8 0 0-.02.13.07.18.09.05.2.01.2.01.3-.05 3.4-2.2 3.9-2.6.6.1 1.3.1 2 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3Z"/>
          </svg>
        </span>
        <span className="kakao-fab__label">카카오톡 상담</span>
      </button>
      {open && (
        <div className="kakao-modal" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="kakao-modal__inner" onClick={(e) => e.stopPropagation()}>
            <button className="kakao-modal__close" onClick={() => setOpen(false)} aria-label="닫기">
              <Icon name="x" size={18}/>
            </button>
            <div className="kakao-modal__header">
              <div className="kakao-modal__bubble">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="#181600" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.6 6.4-.2.6-.7 2.4-.8 2.8 0 0-.02.13.07.18.09.05.2.01.2.01.3-.05 3.4-2.2 3.9-2.6.6.1 1.3.1 2 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3Z"/>
                </svg>
              </div>
              <h3>카카오톡 상담 안내</h3>
              <p>QR 코드를 찍어 채널로 문의를 보내주세요.</p>
            </div>
            <div className="kakao-modal__qr">
              <img src="../../assets/kakao-qr.png" alt="카카오톡 채널 QR 코드" />
            </div>
            <div className="kakao-modal__info">
              <div className="kakao-modal__row"><Icon name="clock" size={16}/> <strong>운영시간</strong> <span>{brand.hours || "평일 09:00 — 21:00"}</span></div>
              <div className="kakao-modal__row"><Icon name="phone" size={16}/> <strong>전화</strong>     <span>{brand.phone || ""}</span></div>
              <div className="kakao-modal__row"><Icon name="map-pin" size={16}/> <strong>주소</strong>   <span>{brand.address || ""}</span></div>
            </div>
            <div className="kakao-modal__welcome">
              아이의 작은 시도와 변화를, 정지은 일산 ABA가 함께 기다리고 있겠습니다.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Page header used on sub-pages (under the fixed header). */
function PageHeader({ eyebrow, title, sub }) {
  return (
    <div className="page-head">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-2">{title.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

function KakaoMap({ brand, height = 360, className = "" }) {
  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(brand.address);
      alert("주소가 복사되었습니다 — " + brand.address);
    } catch (e) {
      window.prompt("주소를 복사하세요", brand.address);
    }
  };
  const openKakao = () => window.open(brand.kakaoMapUrl || ("https://map.kakao.com/?q=" + encodeURIComponent(brand.address)), "_blank", "noopener");
  const openNaver = () => window.open(brand.naverMapUrl || ("https://map.naver.com/v5/search/" + encodeURIComponent(brand.address)), "_blank", "noopener");

  const mapsApi = (window.SITE_DATA && window.SITE_DATA.brand && window.SITE_DATA.brand.kakaoMapAppKey);
  const lat = brand.coords?.lat || 37.6707;
  const lng = brand.coords?.lng || 126.7547;

  // Static map preview using OpenStreetMap (no API key required)
  const bbox = `${lng - 0.003},${lat - 0.0018},${lng + 0.003},${lat + 0.0018}`;
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className={"kakao-map " + className}>
      <div className="kakao-map__frame" style={{ height }}>
        <iframe
          title="센터 위치"
          src={osmEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div className="kakao-map__bar">
        <div className="kakao-map__addr">
          <Icon name="map-pin" size={18}/>
          <div>
            <strong>{brand.address}</strong>
            <span>지하철·버스로 도착하시면 605호 옆 엘리베이터를 이용해 주세요.</span>
          </div>
        </div>
        <div className="kakao-map__actions">
          <button className="btn btn-secondary btn-sm" onClick={copyAddress}>
            <Icon name="copy" size={14}/> 주소 복사
          </button>
          <button className="btn btn-secondary btn-sm" onClick={openKakao}>
            <Icon name="navigation" size={14}/> 카카오 길찾기
          </button>
          <button className="btn btn-secondary btn-sm hide-mobile" onClick={openNaver}>
            <Icon name="map" size={14}/> 네이버 지도
          </button>
        </div>
      </div>
    </div>
  );
}

window.Icon = Icon;
window.Header = Header;
window.Footer = Footer;
window.KakaoFab = KakaoFab;
window.PageHeader = PageHeader;
window.KakaoMap = KakaoMap;

/* ─────────────────────────────────────────────────────────────
   PopupHost — home-page modal popups (Dim + center modal).
   Reads window.SITE_DATA.popups; filters by isActive, date range,
   soft-delete, and per-popup localStorage "hide today".
   ───────────────────────────────────────────────────────────── */
function popupIsShowable(p) {
  if (!p || p.deletedAt) return false;
  if (!p.isActive) return false;
  const now = Date.now();
  if (p.startAt && now < new Date(p.startAt + "T00:00:00").getTime()) return false;
  if (p.endAt && now > new Date(p.endAt + "T23:59:59").getTime()) return false;
  try {
    const until = localStorage.getItem("aba-popup-hide-" + p.id);
    if (until && Date.now() < parseInt(until, 10)) return false;
  } catch (e) {}
  return true;
}

function PopupHost({ popups }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList((popups || []).filter(popupIsShowable));
  }, [popups]);
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [list]);

  const close = (id) => setList((a) => a.filter((p) => p.id !== id));
  const hideToday = (id) => {
    try {
      const end = new Date(); end.setHours(23, 59, 59, 999);
      localStorage.setItem("aba-popup-hide-" + id, String(end.getTime()));
    } catch (e) {}
    close(id);
  };
  if (!list.length) return null;
  return (
    <div className="popup-layer">
      {list.map((p, i) => (
        <PopupModal key={p.id} popup={p} index={i} onClose={() => close(p.id)} onHideToday={() => hideToday(p.id)} />
      ))}
    </div>
  );
}

function PopupModal({ popup, index, onClose, onHideToday }) {
  const offset = index * 20;
  const go = () => {
    if (!popup.linkUrl) return;
    if (popup.linkUrl.startsWith("#")) { window.location.hash = popup.linkUrl.slice(1); onClose(); }
    else window.open(popup.linkUrl, "_blank", "noopener");
  };
  return (
    <div className="popup-dim" onClick={onClose}>
      <div className="popup-card" style={{ transform: `translate(${offset}px, ${offset}px)` }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="popup-card__close" onClick={onClose} aria-label="닫기"><Icon name="x" size={18}/></button>
        {popup.imageUrl && (
          <div className="popup-card__media" onClick={go} style={{ cursor: popup.linkUrl ? "pointer" : "default" }}>
            <img src={popup.imageUrl} alt={popup.title || ""} />
          </div>
        )}
        <div className="popup-card__body">
          {popup.title && <h3 className="popup-card__title">{popup.title}</h3>}
          {popup.content && (
            <div className="popup-card__content">
              {popup.content.split("\n").map((line, i) => line.trim() ? <p key={i}>{line}</p> : <br key={i}/>)}
            </div>
          )}
          {popup.linkUrl && (
            <button className="btn btn-primary popup-card__cta" onClick={go}>
              자세히 보기 <Icon name="arrow-right" size={15}/>
            </button>
          )}
        </div>
        <div className="popup-card__foot">
          {popup.allowHideToday && (
            <label className="popup-card__hide">
              <input type="checkbox" onChange={(e) => { if (e.target.checked) onHideToday(); }} />
              <span>오늘 하루 보지 않기</span>
            </label>
          )}
          <button className="popup-card__textclose" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

window.PopupHost = PopupHost;
