const functions = [
  { name: "Mehendi", detail: "Friday · 4:00 PM", color: "lavender" },
  { name: "Wedding ceremony", detail: "Saturday · 7:00 PM", color: "gold" },
  { name: "Reception", detail: "Sunday · 7:30 PM", color: "rose" },
];

const features = [
  {
    number: "01",
    title: "Every function, in its place",
    description:
      "Give each part of your celebration its own guests, schedule, budget, and album—all under one event.",
    icon: "calendar",
  },
  {
    number: "02",
    title: "Guest lists that make sense",
    description:
      "Invite a family as one party, set a different guest limit for each function, and follow RSVPs as they arrive.",
    icon: "guests",
  },
  {
    number: "03",
    title: "A plan everyone can follow",
    description:
      "Share the work with family managers, keep tasks moving, and see your budget in one clear view.",
    icon: "check",
  },
  {
    number: "04",
    title: "Memories from every moment",
    description:
      "Give each function its own album. Guests can scan a QR code and add their photos without an account.",
    icon: "photo",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark">
      <img src="/images/make-my-event-logo.svg" alt="Make My Event — Plan beautifully. Celebrate effortlessly." />
    </span>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "calendar") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 13h3M8 17h3M14 13h3" /></svg>;
  }
  if (name === "guests") {
    return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19v-1.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V19H3.5ZM16 5.5a3 3 0 0 1 0 5.8M17 13.2a4.8 4.8 0 0 1 3.5 4.6V19" /></svg>;
  }
  if (name === "check") {
    return <svg {...common}><path d="M5 4.5h14v16H5zM8 9l1.5 1.5L12.5 7M14.5 9H17M8 15l1.5 1.5 3-3.5M14.5 15H17" /></svg>;
  }
  return <svg {...common}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m5 17 4.3-4.3a1.5 1.5 0 0 1 2.1 0L14 15.3l1.3-1.3a1.5 1.5 0 0 1 2.1 0l2.1 2.1" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" /></svg>;
}

export default function HomePage() {
  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Make My Event home">
          <BrandMark />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#why-make-my-event">Why Make My Event</a>
          <a href="#features">What you can do</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="header-actions">
          <a className="text-link sign-in-link" href="#get-started">Sign in</a>
          <a className="button button-small" href="#get-started">Start planning <ArrowIcon /></a>
        </div>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />For the moments that matter</p>
          <h1 id="hero-title">Plan beautifully.<br /><em>Celebrate effortlessly.</em></h1>
          <p className="hero-description">
            One thoughtful place for every guest, gathering, and detail. Bring your whole celebration together—and enjoy more of it along the way.
          </p>
          <div className="hero-actions">
            <a className="button" href="#get-started">Plan your event <ArrowIcon /></a>
            <a className="underlined-link" href="#features">Explore the details <span>↓</span></a>
          </div>
          <p className="hero-note"><span className="note-star">✳</span> Made for weddings, milestones, and everything worth celebrating.</p>
        </div>

        <div className="hero-art" aria-label="Illustrative preview of an event workspace">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-stem stem-one" />
          <div className="art-stem stem-two" />
          <div className="preview-card">
            <div className="preview-topline"><span>YOUR EVENT</span><span className="preview-menu">•••</span></div>
            <div className="preview-title-row">
              <div>
                <p className="preview-kicker">A celebration in the making</p>
                <h2>Aarav &amp; Mira</h2>
                <p className="preview-date">12—14 December · Jaipur</p>
              </div>
              <div className="preview-seal" aria-hidden="true"><span>THE</span><strong>AM</strong><span>DAY</span></div>
            </div>
            <div className="preview-divider" />
            <div className="preview-section-heading"><span>UP NEXT</span><a href="#features">View all <ArrowIcon /></a></div>
            <div className="next-function">
              <span className="function-date"><strong>12</strong><small>DEC</small></span>
              <span className="function-details"><strong>Mehendi</strong><small>Friday · 4:00 PM</small></span>
              <span className="function-dot" />
            </div>
            <div className="preview-bottom">
              <div><span className="bottom-icon guests-icon"><FeatureIcon name="guests" /></span><span><strong>Guest list</strong><small>Parties &amp; RSVPs</small></span></div>
              <div className="preview-mini-avatars" aria-label="Family managers"><span>AM</span><span>R</span><span>+2</span></div>
            </div>
          </div>
          <div className="floating-note note-rsvp"><span className="note-check">✓</span><span><strong>One family, every function</strong><small>Guests and RSVPs, all together</small></span></div>
          <div className="floating-note note-budget"><span className="budget-ring">◌</span><span><strong>Plan with clarity</strong><small>Budgets, tasks &amp; timelines</small></span></div>
          <span className="art-caption">A little more room to enjoy the moment.</span>
        </div>
      </section>

      <section className="intro-strip" id="why-make-my-event">
        <div className="section-shell intro-grid">
          <p className="eyebrow"><span className="eyebrow-line" />A calmer kind of planning</p>
          <p className="intro-statement">All the moving pieces,<br /><em>gently brought together.</em></p>
          <p className="intro-detail">From the first guest list to the last shared photo, keep the whole celebration in view—without keeping everything in your head.</p>
        </div>
      </section>

      <section className="features section-shell" id="features">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />Everything has its place</p>
            <h2>Thoughtful details.<br /><em>One lovely overview.</em></h2>
          </div>
          <p>Whether it’s one special day or a whole weekend, the important details stay connected.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-card-top"><span className="feature-number">{feature.number}</span><span className="feature-icon"><FeatureIcon name={feature.icon} /></span></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <a href="#how-it-works" aria-label={`Learn about ${feature.title}`}>Discover <ArrowIcon /></a>
            </article>
          ))}
        </div>

        <div className="function-showcase">
          <div className="showcase-copy">
            <p className="eyebrow"><span className="eyebrow-line" />A celebration, many moments</p>
            <h2>Every function<br />gets its <em>own rhythm.</em></h2>
            <p>Keep the guest list, venue, schedule, and photo album close to the function they belong to. Your whole event stays connected, while every gathering feels like its own.</p>
            <a className="underlined-link" href="#how-it-works">See how it comes together <span>→</span></a>
          </div>
          <div className="function-board">
            <div className="board-heading"><div><span className="board-label">THE CELEBRATION</span><h3>Aarav &amp; Mira</h3></div><span className="board-count">3 FUNCTIONS</span></div>
            <div className="board-track"><span /><span /><span /></div>
            <div className="function-list">
              {functions.map((item, index) => (
                <div className="board-function" key={item.name}>
                  <span className={`board-marker ${item.color}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="board-function-name"><strong>{item.name}</strong><small>{item.detail}</small></span>
                  <span className="board-arrow">↗</span>
                </div>
              ))}
            </div>
            <div className="board-foot"><span>ONE EVENT, BEAUTIFULLY ORGANISED</span><span>✳</span></div>
          </div>
        </div>
      </section>

      <section className="planning-section">
        <div className="section-shell planning-grid">
          <div className="planning-copy">
            <p className="eyebrow"><span className="eyebrow-line" />Made for doing it together</p>
            <h2>Share the work.<br /><em>Keep the joy.</em></h2>
            <p>Bring trusted family into the planning, give everyone the right responsibilities, and keep track of what’s next without another long message thread.</p>
            <a className="button button-light" href="#get-started">Make a little room <ArrowIcon /></a>
          </div>
          <div className="planning-preview">
            <div className="planning-preview-header"><span>THE PLAN</span><span className="plan-menu">•••</span></div>
            <div className="planning-event-line"><span className="plan-mark">✳</span><span><strong>Aarav &amp; Mira’s wedding</strong><small>Planning with your people</small></span><span className="plan-avatar">AM</span></div>
            <div className="task-row"><span className="task-checkbox checked">✓</span><span className="task-text done">Confirm the venue</span><span className="task-label">DONE</span></div>
            <div className="task-row"><span className="task-checkbox" /><span className="task-text">Choose the invitation</span><span className="task-label violet-label">IN PROGRESS</span></div>
            <div className="task-row"><span className="task-checkbox" /><span className="task-text">Finalize the Mehendi menu</span><span className="task-label">UP NEXT</span></div>
            <div className="planning-preview-footer"><span>3 thoughtful steps at a time</span><span>01 / 03</span></div>
          </div>
        </div>
      </section>

      <section className="how-section section-shell" id="how-it-works">
        <div className="section-heading how-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" />A simple place to begin</p><h2>Start with the event.<br /><em>We’ll help with the details.</em></h2></div>
          <p>Get the essentials in place, invite your people, and make the plan your own.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-number">01</span><span className="step-rule" /><h3>Make it yours</h3><p>Create your event and add the functions that make it special.</p></article>
          <article className="step-card"><span className="step-number">02</span><span className="step-rule" /><h3>Bring everyone in</h3><p>Invite family managers and guest parties, with the right details for each function.</p></article>
          <article className="step-card"><span className="step-number">03</span><span className="step-rule" /><h3>Enjoy what you planned</h3><p>Follow RSVPs, keep plans on track, and collect the moments you’ll remember.</p></article>
        </div>
      </section>

      <section className="closing-cta section-shell" id="get-started">
        <div className="cta-ornament" aria-hidden="true">✳</div>
        <p className="eyebrow"><span className="eyebrow-line" />The moments matter most</p>
        <h2>Let’s make room<br /><em>for the good part.</em></h2>
        <p>Start with what you know. The rest can come together one thoughtful step at a time.</p>
        <a className="button" href="#top">Start planning <ArrowIcon /></a>
        <span className="cta-footnote">A better-organised celebration begins right here.</span>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Make My Event home"><BrandMark /></a>
        <p>Make space for the moments that matter.</p>
        <span className="footer-copyright">© 2026 Make My Event</span>
      </footer>
    </main>
  );
}
