/* global React, ReactDOM */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const ROUTES = ["home", "about", "programs", "therapists", "notices", "gallery", "contact", "privacy-policy", "privacy-consent"];

function parseRoute(hash) {
  const h = (hash || "#home").slice(1);
  if (h.startsWith("program-")) return { name: "program-detail", id: h.slice("program-".length) };
  if (h.startsWith("therapist-")) return { name: "therapist-detail", id: h.slice("therapist-".length) };
  if (h.startsWith("notice-")) return { name: "notice-detail", id: h.slice("notice-".length) };
  return { name: ROUTES.includes(h) ? h : "home" };
}

function App() {
  const data = window.SITE_DATA;
  const [route, setRoute] = useStateApp(() => parseRoute(window.location.hash));

  /* Hash routing — keep state and URL in sync */
  const handleNav = (id) => {
    const target = ROUTES.includes(id) ? id : "home";
    setRoute({ name: target });
    if (window.location.hash !== "#" + target) {
      window.history.pushState(null, "", "#" + target);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffectApp(() => {
    const onHash = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffectApp(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const openAdmin = () => {
    // Try new tab first; if blocked (e.g. inside a sandboxed iframe), fall back to same-window navigation.
    const w = window.open("admin.html", "_blank", "noopener,noreferrer");
    if (!w) window.location.href = "admin.html";
  };

  const goToPrograms = () => { window.location.hash = "programs"; };

  /* Page renderers */
  const renderPage = () => {
    switch (route.name) {
      case "home":
        return <HeroSlider slides={data.hero} onCta={handleNav} />;
      case "about":
        return (
          <>
            <PageHeader eyebrow="ABOUT US" title={data.about.title} />
            <AboutSection data={data.about} asPage />
          </>
        );
      case "programs":
        return (
          <>
            <PageHeader
              eyebrow="PROGRAMS"
              title={"아이에게 꼭 맞는 길"}
              sub="관찰부터 시작해, 부모님과 함께 목표를 설계하고, 매주 진척을 공유합니다."
            />
            <ProgramsSection programs={data.programs} asPage />
          </>
        );
      case "therapists":
        return (
          <>
            <PageHeader
              eyebrow="OUR THERAPISTS"
              title={"치료사 소개"}
              sub="BCBA 자격을 갖춘 원장과, 풍부한 임상 경험의 치료사들이 함께합니다."
            />
            <TherapistsSection therapists={data.therapists} asPage />
          </>
        );
      case "notices":
        return (
          <>
            <PageHeader eyebrow="NOTICES" title={"공지사항"} sub="기관 소식과 일정 안내입니다." />
            <NoticesSection notices={data.notices} asPage />
          </>
        );
      case "gallery":
        return (
          <>
            <PageHeader eyebrow="GALLERY" title={"우리 공간의 결"} sub="아이가 편안함을 느낄 수 있도록, 공간의 작은 부분까지 함께 고민했습니다." />
            <GallerySection gallery={data.gallery} asPage />
          </>
        );
      case "contact":
        return (
          <>
            <PageHeader eyebrow="CONTACT" title={"상담 문의"} />
            <ContactSection brand={data.brand} asPage />
          </>
        );
      case "privacy-policy":
        return <PrivacyPolicyPage />;
      case "privacy-consent":
        return <PrivacyConsentPage />;
      case "program-detail": {
        const program = data.programs.find(p => p.id === route.id);
        if (!program) { setTimeout(() => { window.location.hash = "programs"; }, 0); return null; }
        return <ProgramDetail program={program} onBack={goToPrograms} />;
      }
      case "therapist-detail": {
        const therapist = data.therapists.find(t => t.id === route.id);
        if (!therapist) { setTimeout(() => { window.location.hash = "therapists"; }, 0); return null; }
        return <TherapistDetail therapist={therapist} onBack={() => { window.location.hash = "therapists"; }} />;
      }
      case "notice-detail": {
        const notice = data.notices.find(n => String(n.id) === String(route.id));
        if (!notice) { setTimeout(() => { window.location.hash = "notices"; }, 0); return null; }
        return <NoticeDetail notice={notice} onBack={() => { window.location.hash = "notices"; }} />;
      }
      default:
        return null;
    }
  };

  const isHome = route.name === "home";

  return (
    <>
      <Header nav={data.nav} activeRoute={route.name} onNav={handleNav} onAdminOpen={openAdmin} />
      <main id="top" className={isHome ? "is-home" : "is-subpage"}>
        {renderPage()}
      </main>
      <Footer brand={data.brand} nav={[...data.nav, { id: "privacy-policy", label: "개인정보처리방침" }, { id: "privacy-consent", label: "수집·이용 동의" }]} onNav={handleNav} />
      <KakaoFab onClick={() => alert("카카오톡 채널 @jungjieun_aba 로 연결됩니다.")} />
      {isHome && <PopupHost popups={data.popups} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
