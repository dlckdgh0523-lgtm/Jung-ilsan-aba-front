/* global React */
const { useState: useStateHero, useEffect: useEffectHero, useRef: useRefHero } = React;

function HeroSlider({ slides, onCta }) {
  const [active, setActive] = useStateHero(0);
  const [paused, setPaused] = useStateHero(false);
  const trackRef = useRefHero(null);

  useEffectHero(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [active, paused, slides.length]);

  const go = (n) => setActive(((n % slides.length) + slides.length) % slides.length);

  // touch swipe
  useEffectHero(() => {
    const el = trackRef.current;
    if (!el) return;
    let sx = 0;
    const ts = (e) => { sx = e.touches[0].clientX; };
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => { el.removeEventListener("touchstart", ts); el.removeEventListener("touchend", te); };
  }, [active]);

  return (
    <section
      className="hero"
      ref={trackRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div key={s.id} className={"hero__slide" + (i === active ? " is-active" : "")} aria-hidden={i !== active}>
          <div className="hero__media" style={{ backgroundImage: `url(${s.image})` }} />
          <div className="hero__overlay" />
        </div>
      ))}

      <div className="hero__content container">
        {slides.map((s, i) => (
          <div key={s.id} className={"hero__text" + (i === active ? " is-active" : "")} aria-hidden={i !== active}>
            <span className="hero__eyebrow">{s.eyebrow}</span>
            <h1 className="hero__title">{s.title.split("\n").map((line, idx) => <span key={idx}>{line}<br/></span>)}</h1>
            <p className="hero__sub">{s.subtitle}</p>
            <div className="hero__cta">
              <a className="btn btn-primary btn-lg" href={s.buttonLink} onClick={(e) => { e.preventDefault(); onCta(s.buttonLink); }}>
                {s.buttonText} <Icon name="arrow-right" size={16} />
              </a>
              {s.buttonText2 && (
                <a className="btn btn-secondary btn-lg" href={s.buttonLink2} onClick={(e) => { e.preventDefault(); onCta(s.buttonLink2); }}>
                  {s.buttonText2} <Icon name="arrow-right" size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="hero__nav hero__nav--prev" aria-label="이전 슬라이드" onClick={() => go(active - 1)}>
        <Icon name="chevron-left" size={22} />
      </button>
      <button className="hero__nav hero__nav--next" aria-label="다음 슬라이드" onClick={() => go(active + 1)}>
        <Icon name="chevron-right" size={22} />
      </button>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={"슬라이드 " + (i + 1)}
            className={"hero__dot" + (i === active ? " is-active" : "")}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <div className="hero__count">
        <span>{String(active + 1).padStart(2, "0")}</span>
        <span className="hero__count-sep" />
        <span className="muted">{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

window.HeroSlider = HeroSlider;
