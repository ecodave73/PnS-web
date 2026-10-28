import { FormEvent, useEffect, useId, useState } from "react";

const NAV_ITEMS = [
  ["Experiences", "#experiences"],
  ["Master class", "#master-class"],
  ["Live illustration", "#live-illustration"],
  ["Enquire", "#enquire"],
] as const;

const livePackages = [
  {
    title: "Live session",
    note: "Three hours · approximately six guests per hour",
    prices: [["18 guests", "$990"]],
  },
  {
    title: "Complete event",
    note: "Live three-hour session, then remaining portraits completed after the event",
    prices: [
      ["50 guests", "$1,950"],
      ["100 guests", "$3,450"],
      ["200 guests", "$5,850"],
    ],
  },
  {
    title: "Pre-event fashion",
    note: "Finished before your event from supplied guest photos",
    prices: [
      ["50 guests", "$1,750"],
      ["100 guests", "$3,200"],
      ["200 guests", "$5,600"],
    ],
  },
  {
    title: "Pre-event portraits",
    note: "Black-and-white portraits finished before your event",
    prices: [
      ["50 guests", "$2,750"],
      ["100 guests", "$4,950"],
      ["200 guests", "$8,250"],
    ],
  },
] as const;

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand--compact" : ""}`}>
      <img
        className="brand__approved-logo"
        src={compact ? "/images/paint-sip-approved-dark.png" : "/images/paint-sip-approved-light.png"}
        alt="Paint & Sip Events logo"
        width="800"
        height="215"
      />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="site-header">
      <a className="logo-link" href="#top" onClick={() => setOpen(false)}>
        <BrandMark />
      </a>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav id="site-nav" className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
        {NAV_ITEMS.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function App() {
  return (
    <div id="top">
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__image" role="img" aria-label="Guests enjoying a private art master class">
            <img src="/images/masterclass-hero.webp" alt="Guests painting expressive artworks around an intimate table" />
          </div>
          <div className="hero__content">
            <p className="eyebrow">Brisbane · Gold Coast · Byron Bay</p>
            <h1 id="hero-title">Art, hosted differently.</h1>
            <p className="hero__lede">Private art experiences with depth, beauty and a little theatre—guided by Australian artist Anthony Pieters.</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#enquire">
                Enquire about your event <ArrowIcon />
              </a>
              <a className="text-link" href="#experiences">Explore the experiences</a>
            </div>
          </div>
          <p className="hero__index">Private art experiences / 01</p>
        </section>

        <section className="statement section-shell" id="experiences" aria-labelledby="statement-title">
          <p className="section-number">01</p>
          <div>
            <p className="eyebrow">Choose your experience</p>
            <h2 id="statement-title">More considered than paint and sip. More personal than entertainment.</h2>
          </div>
          <p className="statement__copy">Anthony brings the studio to you—creating an occasion that feels relaxed, generous and genuinely connected to the practice of making art.</p>
        </section>

        <section className="experience experience--master" id="master-class" aria-labelledby="master-title">
          <div className="experience__media">
            <img src="/images/studio-details.webp" alt="Textured abstract painting, portrait sketch and artists' tools" loading="lazy" />
            <p className="image-caption">All materials supplied. You keep the piece you create.</p>
          </div>
          <div className="experience__body">
            <p className="section-number">02 / Art master class</p>
            <h2 id="master-title">A private master class, at your table.</h2>
            <p className="experience__intro">Anthony personally guides your group through portraiture, textured abstract art, or a considered blend of both. The result is a piece you will be proud to have at home—and an evening with a story worth retelling.</p>

            <dl className="fact-grid" aria-label="Master class details">
              <div><dt>Price</dt><dd>$60 per person</dd></div>
              <div><dt>Duration</dt><dd>90 minutes</dd></div>
              <div><dt>Group</dt><dd>6–10 guests</dd></div>
              <div><dt>Regions</dt><dd>Brisbane, Gold Coast &amp; Byron Bay</dd></div>
            </dl>

            <div className="detail-columns">
              <div>
                <h3>What is included</h3>
                <ul>
                  <li>Canvas, easel and apron</li>
                  <li>Professional tools, paints and mediums</li>
                  <li>Personal guidance from Anthony</li>
                  <li>Insight into Anthony’s artistic practice</li>
                </ul>
              </div>
              <div>
                <h3>Preparing your space</h3>
                <p>Provide tables and seating for your guests. Anthony arrives one hour before to set up and remains one hour after to carefully pack down. Additional furniture arrangements can be discussed for an extra fee.</p>
              </div>
            </div>

            <aside className="notice">
              <span>Planning note</span>
              <p>Please finalise your booking at least three weeks ahead so every detail can be properly prepared.</p>
            </aside>
            <a className="button button--dark" href="#enquire">Plan a private master class <ArrowIcon /></a>
          </div>
        </section>

        <section className="experience experience--illustration" id="live-illustration" aria-labelledby="illustration-title">
          <div className="experience__heading section-shell">
            <p className="section-number">03 / Live illustration</p>
            <h2 id="illustration-title">A portrait of the moment, made to keep.</h2>
            <p>Detailed, vibrant drawings created live for your guests—each finished on 300gsm paper and presented in a clear protective cover.</p>
          </div>

          <div className="illustration-grid">
            <figure className="illustration-grid__image">
              <img src="/images/live-illustration.webp" alt="Artist creating a fashion illustration for an event guest" loading="lazy" />
              <figcaption>Ideal for weddings, opening nights, corporate celebrations and private events.</figcaption>
            </figure>
            <div className="packages" aria-label="Live illustration packages">
              {livePackages.map((item, index) => (
                <article className="package" key={item.title}>
                  <div className="package__heading">
                    <span>0{index + 1}</span>
                    <div><h3>{item.title}</h3><p>{item.note}</p></div>
                  </div>
                  <dl>
                    {item.prices.map(([label, price]) => (
                      <div key={label}><dt>{label}</dt><dd>{price}</dd></div>
                    ))}
                  </dl>
                </article>
              ))}
              <div className="package-notes">
                <p><strong>All illustration prices include GST.</strong></p>
                <p>Optional guest photo session: $200. Branded protective-slip stickers: $100. Remaining live-event illustrations are completed within two weeks and delivered to one address.</p>
                <p>For pre-event packages, supply guest photos four weeks ahead. Finished illustrations are delivered one day before the event.</p>
              </div>
              <a className="button button--dark" href="#enquire">Book Anthony for your event <ArrowIcon /></a>
            </div>
          </div>
        </section>

        <section className="artist section-shell" aria-labelledby="artist-title">
          <p className="section-number">04 / The artist</p>
          <div>
            <p className="eyebrow">Anthony Pieters</p>
            <h2 id="artist-title">An established art practice, brought into the room.</h2>
          </div>
          <div className="artist__copy">
            <p>Anthony’s abstract landscape and figurative work explores rhythm, change and the human condition. Each event is grounded in that same thoughtful, expressive practice—not a formula.</p>
            <div className="artist__links">
              <a href="https://www.anthonypietersartist.com" target="_blank" rel="noreferrer">View Anthony’s portfolio <ArrowIcon /></a>
              <a href="https://www.instagram.com/anthony.pieters.artist" target="_blank" rel="noreferrer">Follow on Instagram <ArrowIcon /></a>
            </div>
          </div>
        </section>

        <section className="process" aria-labelledby="process-title">
          <div className="section-shell">
            <p className="section-number">05 / Booking</p>
            <h2 id="process-title">From first idea to event day.</h2>
            <ol>
              <li><span>01</span><h3>Enquire</h3><p>Tell us the experience, date, location and guest count you have in mind.</p></li>
              <li><span>02</span><h3>Shape the details</h3><p>Anthony will confirm availability and work through the format and preparation with you.</p></li>
              <li><span>03</span><h3>Anthony prepares</h3><p>Materials, artwork format and event logistics are carefully prepared ahead of time.</p></li>
              <li><span>04</span><h3>Enjoy the occasion</h3><p>Anthony arrives ready to create a generous, memorable experience for your guests.</p></li>
            </ol>
          </div>
        </section>

        <EnquiryForm />
      </main>

      <footer className="footer">
        <BrandMark compact />
        <div className="footer__contact">
          <a href="tel:+61450922695">0450 922 695</a>
          <a href="mailto:hello@anthonypietersartist.com">hello@anthonypietersartist.com</a>
        </div>
        <div className="footer__meta">
          <span>Brisbane · Gold Coast · Byron Bay</span>
          <a className="footer__top" href="#top">Back to top ↑</a>
          <span>© {new Date().getFullYear()} Paint &amp; Sip Events</span>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>(".hero");
        const enquiry = document.getElementById("enquire");
        const enquiryBounds = enquiry?.getBoundingClientRect();
        const overForm = enquiryBounds && enquiryBounds.top < window.innerHeight && enquiryBounds.bottom > 0;
        const active = document.activeElement;
        const editing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement;
        setVisible(window.scrollY > (hero?.offsetHeight ?? 800) && !overForm && !editing);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  return (
    <a
      className={`back-to-top${visible ? " back-to-top--visible" : ""}`}
      href="#top"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 11 6-6 6 6M12 5v14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>Top</span>
    </a>
  );
}

function EnquiryForm() {
  const id = useId();
  const [experience, setExperience] = useState("Art Master Class");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      `Name: ${form.get("name") ?? ""}`,
      `Email: ${form.get("email") ?? ""}`,
      `Phone: ${form.get("phone") ?? ""}`,
      `Experience: ${form.get("experience") ?? ""}`,
      `Preferred date and time: ${form.get("date") ?? ""}`,
      `Location: ${form.get("location") ?? ""}`,
      `Guest count: ${form.get("guests") ?? ""}`,
      `Event type: ${form.get("eventType") ?? ""}`,
      "",
      "Message:",
      String(form.get("message") ?? ""),
    ];
    const subject = `Paint & Sip Events enquiry — ${form.get("experience") ?? "Event"}`;
    window.location.href = `mailto:hello@anthonypietersartist.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <section className="enquiry" id="enquire" aria-labelledby="enquiry-title">
      <div className="enquiry__intro">
        <p className="section-number">06 / Enquire</p>
        <h2 id="enquiry-title">Let’s make something memorable.</h2>
        <p>Share the outline of your event and Anthony will get back to you as soon as possible.</p>
        <div className="enquiry__direct">
          <span>Prefer to talk?</span>
          <a href="tel:+61450922695">0450 922 695</a>
          <a href="https://www.instagram.com/anthony.pieters.artist" target="_blank" rel="noreferrer">@anthony.pieters.artist</a>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__row">
          <label htmlFor={`${id}-name`}>Name<input id={`${id}-name`} name="name" autoComplete="name" required /></label>
          <label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" required /></label>
        </div>
        <div className="form__row">
          <label htmlFor={`${id}-phone`}>Phone<input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" required /></label>
          <label htmlFor={`${id}-experience`}>Experience
            <select id={`${id}-experience`} name="experience" value={experience} onChange={(event) => setExperience(event.target.value)} required>
              <option>Art Master Class</option>
              <option>Live Illustration</option>
              <option>Pre-event Illustration</option>
              <option>Not sure yet</option>
            </select>
          </label>
        </div>
        <div className="form__row">
          <label htmlFor={`${id}-date`}>Preferred date &amp; time<input id={`${id}-date`} name="date" placeholder="e.g. 14 March, 5:30pm" required /></label>
          <label htmlFor={`${id}-location`}>Location<input id={`${id}-location`} name="location" autoComplete="address-level2" placeholder="Suburb or venue" required /></label>
        </div>
        <div className="form__row">
          <label htmlFor={`${id}-guests`}>Number of guests<input id={`${id}-guests`} name="guests" type="number" min="1" inputMode="numeric" required /></label>
          <label htmlFor={`${id}-event-type`}>Event type<input id={`${id}-event-type`} name="eventType" placeholder="Birthday, wedding, opening…" required /></label>
        </div>
        <label htmlFor={`${id}-message`}>Anything else Anthony should know?
          <textarea id={`${id}-message`} name="message" rows={5} placeholder={experience === "Art Master Class" ? "Tell us your preferred art style and what you have in mind for the setting." : "Tell us about your event, timing and illustration preferences."} />
        </label>
        <div className="form__submit">
          <button className="button button--light" type="submit">Prepare my enquiry <ArrowIcon /></button>
          <p>This prepares an email in your own mail app. Your details are not stored by this website.</p>
        </div>
      </form>
    </section>
  );
}

export default App;
