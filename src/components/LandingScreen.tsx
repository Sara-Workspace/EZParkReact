import { useNavigate } from 'react-router-dom';

// ───────── מערכת עיצוב: כחול ולבן ─────────
const NAVY = '#0a2540'; // כחול עמוק: כותרות ורקעים כהים
const BLUE = '#0a6cf0'; // כחול ראשי: כפתורים והדגשות
const SKY = '#eaf3ff'; // רקע תכלת בהיר
const PAGE = '#f6faff'; // רקע הדף (לבן־תכלכל)
const SUN = '#ffc83d'; // צהוב: הדגשה קטנה בלבד
const INK = '#14263d'; // טקסט
const MUTED = '#5a6b82';
const LINE = '#dfe8f3';

const HEAD = "'Rubik', 'Assistant', system-ui, sans-serif";
const BODY = "'Assistant', system-ui, sans-serif";

// שימו ב-public תמונה בהירה עם שמיים כחולים בשם hero-parking-morning.jpg
// בלי הקובץ יוצג גרדיינט שמיים כחול כברירת מחדל.
const HERO_IMAGE = '/hero-parking-morning.jpg';

const NAV_LINKS = [
  { label: 'איך זה עובד', href: '#how' },
  { label: 'לבעלי חניה', href: '#owners' },
  { label: 'המלצות', href: '#reviews' },
];

const FACTS = [
  { value: '2 דק׳', label: 'הליכה ממוצעת' },
  { value: '5 דק׳', label: 'שריון ללא חיוב' },
  { value: 'לפי דקה', label: 'תשלום הוגן' },
];

const STEPS = [
  { n: '1', title: 'בוחרים יעד', text: 'מסמנים יעד על המפה ורואים חניות פרטיות פנויות במרחק הליכה קצר, כולל עמדות טעינה.' },
  { n: '2', title: 'משריינים ומנווטים', text: 'המקום נשמר עבורכם ל־5 דקות ללא חיוב, והניווט מוביל ישר לשער החניה.' },
  { n: '3', title: 'חונים בראש שקט', text: 'הרכב מזוהה בכניסה והמונה מודד את דקות החניה בפועל, לא יותר.' },
  { n: '4', title: 'משלמים ומרוויחים', text: 'התשלום בנקודות נגבה אוטומטית בסיום, והנקודות נצברות אצל בעל החניה.' },
];

const TESTIMONIALS = [
  { name: 'נועה לוי', role: 'נהגת בתל אביב', text: 'מצאתי חניה פרטית תוך דקה ממש מתחת למשרד. אפס סיבובים מיותרים.' },
  { name: 'דניאל כהן', role: 'בעל חניה פרטית', text: 'החניה שלי הייתה ריקה כל הבוקר כשאני בעבודה. היום היא מכניסה לי נקודות מדי יום.' },
  { name: 'מיכל אברהם', role: 'נהגת רכב חשמלי', text: 'השריון מראש והניווט הישיר לחניה שינו לי את שגרת הבוקר בעיר.' },
];

function LandingScreen() {
  const navigate = useNavigate();
  const goLogin = () => navigate('/login');

  return (
    <div dir="rtl" style={{ background: PAGE, color: INK, fontFamily: BODY, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Rubik:wght@500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        .ez-nav-link { color:${MUTED}; text-decoration:none; font-size:16px; font-weight:600; transition:color .2s; }
        .ez-nav-link:hover { color:${BLUE}; }
        .ez-btn { transition: transform .15s ease, box-shadow .15s ease; }
        .ez-btn:hover { transform: translateY(-2px); }
        .ez-card { transition: transform .2s ease, box-shadow .2s ease; }
        .ez-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(10,37,64,.10); }
        @keyframes ezPulse { 0%,100% { opacity:1 } 50% { opacity:.35 } }
        @media (max-width: 860px) { .ez-nav-links { display:none !important; } .ez-pad { padding-left:20px !important; padding-right:20px !important; } }
      `}</style>

      {/* ───────── תפריט צף ───────── */}
      <div className="ez-pad" style={{ position: 'sticky', top: 0, zIndex: 20, padding: '16px 56px 0' }}>
        <header
          style={{
            background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(10px)',
            border: `1px solid ${LINE}`, borderRadius: 999, padding: '10px 14px 10px 14px',
            boxShadow: '0 8px 28px rgba(10,37,64,0.07)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 800, fontSize: 20 }}>
              P
            </div>
            <div style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: '-0.3px' }}>EZPark</div>
          </div>

          <nav className="ez-nav-links" style={{ display: 'flex', gap: 34 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="ez-nav-link">{l.label}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={goLogin} className="ez-btn"
              style={{ background: 'transparent', color: NAVY, border: 'none', borderRadius: 999, padding: '10px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}>
              התחברות
            </button>
            <button type="button" onClick={goLogin} className="ez-btn"
              style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}>
              הרשמה
            </button>
          </div>
        </header>
      </div>

      {/* ───────── Hero ───────── */}
      <section
        className="ez-pad"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 56, alignItems: 'center', padding: '48px 56px 80px', maxWidth: 1440, margin: '0 auto' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28 }}>
          <span style={{ background: SKY, color: BLUE, padding: '8px 18px', borderRadius: 999, fontSize: 14, fontWeight: 700 }}>
            ☀ בוקר טוב, החניה כבר מחכה
          </span>

          <h1 style={{ fontFamily: HEAD, fontSize: 'clamp(44px, 5.4vw, 76px)', fontWeight: 800, lineHeight: 1.1, margin: 0, color: NAVY, letterSpacing: '-1px' }}>
            החניה הבאה שלך
            <br />
            <span style={{ color: BLUE, backgroundImage: `linear-gradient(transparent 66%, rgba(10,108,240,0.16) 66%)`, padding: '0 4px' }}>
              מתחילה כאן.
            </span>
          </h1>

          <p style={{ fontSize: 20, lineHeight: 1.75, color: MUTED, margin: 0, maxWidth: 500 }}>
            מצאו חניה פרטית פנויה ליד היעד, שריינו מראש ושלמו בנקודות לפי זמן החניה בפועל.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <button type="button" onClick={goLogin} className="ez-btn"
              style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 999, padding: '16px 34px', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: BODY, boxShadow: '0 10px 24px rgba(10,108,240,0.28)' }}>
              מתחילים עכשיו ←
            </button>
            <button type="button" onClick={goLogin} className="ez-btn"
              style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: 999, padding: '16px 30px', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}>
              פרסום חניה פרטית
            </button>
          </div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 16, paddingTop: 24, borderTop: `1px solid ${LINE}`, width: '100%', maxWidth: 520 }}>
            {FACTS.map((f) => (
              <div key={f.label}>
                <div style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 800, color: NAVY }}>{f.value}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* תמונה בכרטיס מעוגל */}
        <div
          style={{
            position: 'relative', minHeight: 580, borderRadius: 36, overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(10,37,64,0.18)',
            backgroundImage: `linear-gradient(to top, rgba(10,37,64,0.35), rgba(10,37,64,0) 40%), url(${HERO_IMAGE}), radial-gradient(circle at 72% 24%, #ffffff 0, rgba(255,255,255,0) 26%), linear-gradient(170deg, #e3f1ff 0%, #a8d3ff 48%, #3f8ff2 100%)`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          <div style={{ position: 'absolute', bottom: 24, left: 24, width: 'calc(100% - 48px)', maxWidth: 340, background: '#fff', borderRadius: 20, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 12px 30px rgba(10,37,64,0.18)' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: BLUE, animation: 'ezPulse 1.8s infinite', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>חניה פרטית #21 שמורה עבורך</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>דיזנגוף 120, תל אביב • 2 דק׳ הליכה</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── איך זה עובד ───────── */}
      <section id="how" className="ez-pad" style={{ background: SKY, padding: '96px 56px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>איך זה עובד</span>
            <h2 style={{ fontFamily: HEAD, margin: '8px 0 0', fontSize: 'clamp(30px, 3.6vw, 46px)', fontWeight: 800, color: NAVY }}>
              ארבעה צעדים לחניה בלי כאב ראש
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="ez-card" style={{ background: '#fff', borderRadius: 24, padding: 30 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: SKY, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 800, fontSize: 22 }}>
                  {s.n}
                </div>
                <h3 style={{ fontFamily: HEAD, margin: '20px 0 10px', fontSize: 24, fontWeight: 800, color: NAVY }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: MUTED }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── בעלי חניה ───────── */}
      <section id="owners" className="ez-pad" style={{ padding: '96px 56px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', background: NAVY, color: '#fff', borderRadius: 36, padding: 'clamp(36px, 5vw, 64px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <h2 style={{ fontFamily: HEAD, margin: 0, fontSize: 'clamp(28px, 3.4vw, 44px)', fontWeight: 800, lineHeight: 1.2 }}>
              יש לך חניה פרטית? <span style={{ color: SUN }}>שתעבוד בשבילך.</span>
            </h2>
            <p style={{ margin: '16px 0 0', fontSize: 19, lineHeight: 1.75, color: '#c9ddd0' }}>
              פרסמו את החניה בשתי דקות והרוויחו נקודות בכל פעם שהיא פנויה ומישהו חונה בה.
            </p>
          </div>
          <button type="button" onClick={goLogin} className="ez-btn"
            style={{ background: SUN, color: NAVY, border: 'none', borderRadius: 999, padding: '16px 38px', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: BODY }}>
            פרסום חניה ←
          </button>
        </div>
      </section>

      {/* ───────── המלצות ───────── */}
      <section id="reviews" className="ez-pad" style={{ padding: '96px 56px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>המלצות</span>
            <h2 style={{ fontFamily: HEAD, margin: '8px 0 0', fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 800, color: NAVY }}>
              מה אומרים הנהגים ובעלי החניות
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="ez-card" style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 24, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 500, lineHeight: 1.75, color: INK }}>“{t.text}”</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${LINE}`, paddingTop: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{t.role}</div>
                  </div>
                  <div style={{ color: SUN, fontSize: 14, letterSpacing: 2 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${LINE}`, padding: '28px 56px', textAlign: 'center', fontSize: 14, color: MUTED }}>
        EZPark • חניה בקליק • שיתוף חניות פרטיות בזמן אמת
      </footer>
    </div>
  );
}

export default LandingScreen;