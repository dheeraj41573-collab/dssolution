"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { adsCampaigns } from "@/lib/adsCampaigns";
import styles from "./PortfolioGallery.module.css";

const CAT = {
  J: "Jewellery",
  R: "Real Estate",
  F: "Food & FMCG",
  A: "Fashion",
  W: "Wellness",
  G: "Gems & Spiritual",
  E: "Events",
  T: "Tech & Auto",
  L: "Lifestyle",
  D: "Education",
};

const COL = {
  J: "#B8872B",
  R: "#2F6FD0",
  F: "#E0662B",
  A: "#C8366F",
  W: "#14A0AE",
  G: "#7B4FD0",
  E: "#A24FC0",
  T: "#4A63C8",
  L: "#D84A62",
  D: "#2F9468",
};

const TYL = {
  web: "Website",
  app: "Mobile App",
  seo: "SEO & Growth",
  ads: "Ads",
};

const SHOWCASE = [
  [
    "w-01",
    "MN Movers",
    "Logistics Website",
    "T",
    "web",
    "https://mnmovers.ca",
    "/portfolio/website/MN%20Movers.png",
  ],
  [
    "w-02",
    "Rai Exterior",
    "Exterior Design Website",
    "R",
    "web",
    "https://raiexterior.ca",
    "/portfolio/website/raiexterior.png",
  ],
  

  [
    "w-03",
    "Digital Solutions",
    "Digital Marketing Website",
    "F",
    "web",
    "https://www.thedssolution.com",
    "/portfolio/website/digitalsolution.png",
  ],
  [
    "w-04",
    "Waterh",
    "Water & Hydration Website",
    "W",
    "web",
    "https://www.waterh.com",
    "/portfolio/website/waterh.png",
  ],
  [
    "w-05",
    "Ouros Jewels",
    "Fine Jewellery Website",
    "J",
    "web",
    "https://www.ourosjewels.com",
    "/portfolio/website/ourosjewels.png",
  ],
  [
    "s-03",
    "Airfare Travel Info",
    "Travel SEO & Growth",
    "T",
    "seo",
    "https://airfaretravelinfo.com",
    "/portfolio/seo/Airfare-travel.png",
  ],
  
  [
    "s-04",
    "Netsmartz",
    "Technology SEO & Growth",
    "T",
    "seo",
    "https://www.netsmartz.com/",
    "/portfolio/seo/Netsmats.png",
  ],
  [
    "s-05",
    "Trinity Graphics",
    "Graphic Design SEO & Growth",
    "T",
    "seo",
    "https://www.trinitygraphics.com/",
    "/portfolio/seo/Trinity.png",
  ],
  [
    "s-06",
    "Greater Public Studio",
    "SEO & Growth",
    "T",
    "seo",
    "https://greaterpublicstudio.com/",
    "/portfolio/seo/GPS.png",
  ],
  [
    "s-07",
    "Sanify Healthcare",
    "Healthcare SEO & Growth",
    "W",
    "seo",
    "https://www.sanifyhealthcare.com/",
    "/portfolio/seo/sanifyhealthcare.png",
  ],
  
  [
    "w-07",
    "Debra's",
    "Wellness Website",
    "W",
    "web",
    "https://www.debras.com.au",
    "/portfolio/website/debras.png",
  ],
  
  [
    "w-09",
    "Healthy Hippo",
    "Health & Wellness Website",
    "W",
    "web",
    "https://healthyhippo.ca",
    "/portfolio/website/healthyhippo.png",
  ],
  [
    "w-10",
    "My Allure Spa",
    "Beauty & Wellness Website",
    "W",
    "web",
    "https://myallurespa.com",
    "/portfolio/website/myallurespa.png",
  ],
  [
    "w-11",
    "Eroticgel",
    "Personal Wellness Website",
    "W",
    "web",
    "https://eroticgel.com",
    "/portfolio/website/eroticgel.png",
  ],
  [
    "w-12",
    "Self Made Athletes",
    "Fitness & Apparel Website",
    "W",
    "web",
    "https://selfmadeathletes.com",
    "/portfolio/website/selfmadeathletes.png",
  ],
  [
    "w-13",
    "Yacht Gurus",
    "Yacht Services Website",
    "T",
    "web",
    "https://yachtgurus.us",
    "/portfolio/website/yachtgurus.png",
  ],
  [
    "w-14",
    "Carbon Factory",
    "Automotive Website",
    "T",
    "web",
    "https://www.carbonfactory.co.uk",
    "/portfolio/website/carbonfactory.png",
  ],
  [
    "w-15",
    "Bulk Beef Jerky",
    "Food & FMCG Website",
    "F",
    "web",
    "https://www.bulkbeefjerky.com",
    "/portfolio/website/bulkbeefjerky.png",
  ],
  [
    "w-16",
    "Hello Tushy",
    "Personal Care Website",
    "W",
    "web",
    "https://hellotushy.com",
    "/portfolio/website/hellotushy.png",
  ],
  [
    "w-17",
    "Airfare Travel Info",
    "Travel & Tourism Website",
    "T",
    "web",
    "https://airfaretravelinfo.com",
    "/portfolio/seo/Airfare-travel.png",
  ],
    [
    "s-02",
    "Digital Solutions",
    "SEO & Growth",
    "T",
    "seo",
    "https://www.thedssolution.com",
    "/portfolio/seo/digitalsolution.png",
  ],
  ["a-01", "FitTrack", "Fitness Tracking App", "W", "app"],
  ["a-02", "Health Companion", "Wellness App", "W", "app"],
  ["a-03", "Shopi", "Shopping App", "A", "app"],
  ["a-04", "Finwise", "Finance App", "T", "app"],

  [
    "s-01",
    "Neo Homes",
    "Local SEO & Ranking",
    "R",
    "seo",
    "https://www.neo-homes.com",
    "/portfolio/seo/neo-homes.png",
  ],
].map(([id, name, summary, cat, type, url, image]) => ({
  id,
  no: id.toUpperCase(),
  name,
  summary,
  cat,
  type,
  url,
  image,
}));

const PROJECTS = [...SHOWCASE, ...adsCampaigns];

const SERVICE_TYPES = [
  { type: "web", title: "Web", title2: "Development" },
  { type: "app", title: "App", title2: "Development" },
  { type: "seo", title: "SEO &", title2: "Growth" },
  { type: "ads", title: "Ads &", title2: "Digital Marketing" },
];

const SERVICE_COPY = {
  web: "High-performance websites built with modern technologies and user-centric design.",
  app: "Feature-rich, scalable, and intuitive mobile applications for iOS and Android.",
  seo: "Data-driven SEO strategies that improve rankings, drive traffic, and grow your business.",
  ads: "Targeted ad campaigns that increase visibility, engagement, and conversions.",
};

const TAB_LABELS = [
  ["all", "All"],
  ["web", "Websites"],
  ["app", "Apps"],
  ["seo", "SEO"],
  ["ads", "Ads & Campaigns"],
];

const PAGE_SIZE = 12;

function ServiceMock({ type }) {
  if (type === "web") {
    return (
      <>
        <div className={styles.mini}>
          <div
            className={styles.in}
            style={{ background: "linear-gradient(135deg,#F4C16A,#D98A3A)" }}
          />
          <b>MN Movers</b>
        </div>
        <div className={styles.mini}>
          <div
            className={styles.in}
            style={{ background: "linear-gradient(135deg,#8FB3E8,#4F79C7)" }}
          />
          <b>Rai Exterior</b>
        </div>
        <div className={styles.mini}>
          <div
            className={styles.in}
            style={{ background: "linear-gradient(135deg,#9BD3D8,#3F9BA8)" }}
          />
          <b>Neo Homes</b>
        </div>
      </>
    );
  }

  if (type === "app") {
    return ["#1668F2", "#19B8D6", "#7B3FE4", "#16A085"].map((color, index) => (
      <div
        className={styles.pw}
        key={color}
        style={index % 2 ? { marginBottom: 12 } : undefined}
      >
        <i style={{ background: color }} />
      </div>
    ));
  }

  if (type === "seo") {
    return (
      <div className={styles.st}>
        <div>
          <small>Organic Traffic</small>
          23.8K
        </div>
        <div>
          <small>Keywords</small>
          12.6K
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <small>Organic Traffic Growth</small>
          <div className={styles.bars}>
            {[20, 28, 35, 32, 48, 60, 72, 85].map((height, index) => (
              <i
                key={height + index}
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 90}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.mini}>
        <div
          className={styles.in}
          style={{ background: "linear-gradient(135deg,#FFD9C2,#FFAF85)" }}
        />
        <b>50% OFF</b>
      </div>
      <div className={styles.mini}>
        <div
          className={styles.in}
          style={{ background: "linear-gradient(135deg,#D6C9FF,#9B82F0)" }}
        />
        <b>Stay Ahead</b>
      </div>
      <div className={styles.st} style={{ width: "46%" }}>
        <div>
          <small>Impressions</small>
          1.2M
        </div>
        <div>
          <small>ROAS</small>
          4.6x
        </div>
      </div>
    </>
  );
}

export default function PortfolioGallery() {
  const [activeType, setActiveType] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState(null);
  const drawerRef = useRef(null);

  const typeCounts = useMemo(
    () =>
      PROJECTS.reduce((counts, project) => {
        counts[project.type] = (counts[project.type] || 0) + 1;
        return counts;
      }, {}),
    [],
  );

  const filtered = useMemo(
    () => PROJECTS.filter((project) => activeType === "all" || project.type === activeType),
    [activeType],
  );

  const visible = filtered.slice(
    0,
    activeType === "ads" ? adsCampaigns.length : visibleCount,
  );
  const remaining =
    activeType === "ads" ? 0 : filtered.length - visibleCount;
  const openIndex = PROJECTS.findIndex((project) => project.id === openId);
  const current = openIndex >= 0 ? PROJECTS[openIndex] : null;
  const previous =
    openIndex >= 0
      ? PROJECTS[(openIndex + PROJECTS.length - 1) % PROJECTS.length]
      : null;
  const next =
    openIndex >= 0 ? PROJECTS[(openIndex + 1) % PROJECTS.length] : null;

  function openProject(id) {
    setOpenId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  function closeDrawer() {
    setOpenId(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function selectType(type) {
    setActiveType((currentType) => (currentType === type ? "all" : type));
    setVisibleCount(PAGE_SIZE);
    document
      .getElementById("pj")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const sync = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setOpenId(PROJECTS.some((project) => project.id === id) ? id : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    if (openId && drawerRef.current) drawerRef.current.scrollTop = 0;
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.w}>
        <section className={styles.hero}>
          <div>
            <div className={styles.eye}>Selected work / Global projects</div>
            <h1 className={styles.title}>
              <span>
                <b className="whitespace-nowrap" style={{ "--d": "0s" }}>
                  Portfolio
                </b>
              </span>
              <span>
                <b className="whitespace-nowrap" style={{ "--d": ".15s" }}>
                  Your Next Big Move
                </b>
              </span>
            </h1>
            <p className={styles.lead}>
              Explore our portfolio of digital experiences crafted with
              strategy, creativity, and performance to help brands grow and
              lead.
            </p>
            <Link className={styles.lnk} href="#pj" scroll={false}>
              Explore All Projects →
            </Link>
            <div className={styles.strip}>
              <div>
                <b>15+</b>
                <small>Featured Projects</small>
              </div>
              <div>
                <b>4</b>
                <small>Core Capabilities</small>
              </div>
              <div>
                <b>Global</b>
                <small>Brands &amp; Clients</small>
              </div>
            </div>
          </div>
          <div className="relative ml-auto aspect-[1060/498] w-full max-w-[1060px]">
            <Image
              src="/portfolio/portfolio-hero.png"
              alt="Portfolio preview of website, app, SEO, and digital marketing work"
              fill
              priority
              sizes="(max-width: 1060px) 100vw, 1060px"
              className="object-contain"
            />
          </div>
        </section>

        <section className={styles.cards} id="svc">
          {SERVICE_TYPES.map((service, index) => (
            <button
              className={`${styles.sv} ${
                activeType === service.type ? styles.svOn : ""
              }`}
              key={service.type}
              type="button"
              aria-pressed={activeType === service.type}
              onClick={() => selectType(service.type)}
            >
              <span className={styles.gn}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>
                  {service.title}
                  <span>{service.title2}</span>
                </h3>
                <p>{SERVICE_COPY[service.type]}</p>
                <span className={styles.go}>
                  Explore Projects <i>↗</i>
                </span>
              </div>
              <div className={styles.mk}>
                <ServiceMock type={service.type} />
              </div>
            </button>
          ))}
        </section>

        <div className={styles.ct}>
          <span className={styles.ic}>➤</span>
          <h2>
            Have a project in mind?{" "}
            <span className={styles.accent}>
              Let&rsquo;s build something that works.
            </span>
          </h2>
          <Link className={styles.btn} href="/contact">
            Start Your Project →
          </Link>
        </div>

        <section className={styles.pj} id="pj">
          <div className={styles.eye}>Browse the portfolio</div>
          <h2 className={styles.pjTitle}>
            {activeType === "all"
              ? "All projects"
              : `${TYL[activeType]} projects`}
          </h2>
          <div className={styles.tabs}>
            {TAB_LABELS.map(([value, label]) => (
              <button
                className={`${styles.chip} ${
                  activeType === value ? styles.chipOn : ""
                }`}
                key={value}
                type="button"
                aria-pressed={activeType === value}
                onClick={() => {
                  setActiveType(value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {value === "all"
                  ? `${label} (${PROJECTS.length})`
                  : `${label} (${typeCounts[value] || 0})`}
              </button>
            ))}
          </div>
          <div
            className={`${styles.grid} ${
              activeType === "ads" ? styles.adsGrid : ""
            }`}
          >
            {visible.map((project, index) => {
              if (project.type === "ads") {
                return (
                  <button
                    className={`${styles.card} ${styles.adsCard}`}
                    key={project.id}
                    type="button"
                    aria-label={`Preview ${project.name} ads`}
                    onClick={() => openProject(project.id)}
                    style={{ "--i": index % 12 }}
                  >
                    <span className={styles.adsHeading}>
                      <strong>{project.name}</strong>
                      <small>{project.summary}</small>
                    </span>
                    <span className={styles.adsImage}>
                      <Image
                        src={project.image}
                        alt={`${project.name} advertising campaign`}
                        fill
                        sizes="(max-width: 700px) 90vw, (max-width: 1060px) 45vw, 25vw"
                        className={styles.adsImageContent}
                      />
                    </span>
                  </button>
                );
              }

              const cardContent = (
                <>
                  {project.image ? (
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={project.image}
                        alt={`${project.name} ${project.type === "seo" ? "SEO results" : "website"} preview`}
                        fill
                        sizes="(max-width: 860px) 100vw, (max-width: 1060px) 90vw, 760px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : project.url ? (
                    <div
                      className="relative flex aspect-[3/2] w-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${COL[project.cat]}, #172033)`,
                      }}
                    >
                      <span className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
                        Website preview
                      </span>
                      <span className="text-2xl font-bold">{project.name}</span>
                      <span className="text-xs text-white/75">
                        {project.url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={styles.tile}
                      style={{ background: COL[project.cat] }}
                    >
                      <span className={styles.no}>
                        {project.no} · {TYL[project.type]}
                      </span>
                      <span className={styles.big}>{project.name}</span>
                    </div>
                  )}
                  <div className={styles.meta}>
                    <div>
                      <div className={styles.nm}>{project.name}</div>
                      <div className={styles.tg}>{project.summary}</div>
                    </div>
                    <span className={styles.arr}>→</span>
                  </div>
                </>
              );
              const className = `${styles.card} group`;
              const style = {
                "--i": index % 12,
                "--c": COL[project.cat],
              };

              return project.url ? (
                <a
                  className={className}
                  href={project.url}
                  key={project.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name} website (opens in a new tab)`}
                  style={style}
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  className={className}
                  href={`#${project.id}`}
                  key={project.id}
                  scroll={false}
                  style={style}
                  onClick={() => openProject(project.id)}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
          {remaining > 0 && (
            <div className={styles.moreBtnWrap}>
              <button
                className={styles.btn}
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more projects ({remaining} more)
              </button>
            </div>
          )}
        </section>
      </div>

      <aside
        className={`${styles.d} ${
          openId && current?.type !== "ads" ? styles.dOpen : ""
        }`}
        ref={drawerRef}
        aria-label="Project details"
        aria-hidden={!openId || current?.type === "ads"}
      >
        {current && current.type !== "ads" && (
          <>
            <button
              className={styles.close}
              type="button"
              aria-label="Close"
              onClick={closeDrawer}
            >
              ✕
            </button>
            <div className={styles.w}>
              <div className={styles.tg} style={{ paddingTop: 36 }}>
                ←{" "}
                <Link className={styles.accent} href="#pj" scroll={false}>
                  All projects
                </Link>{" "}
                / {TYL[current.type]} / {CAT[current.cat]}
              </div>
              <h1 className={styles.dh}>{current.name}</h1>
              <p className={styles.lead} style={{ maxWidth: 720 }}>
                {current.summary}
              </p>
              <div className={styles.m4}>
                <div>
                  <span className={styles.eye}>Client</span>
                  <b>{current.name}</b>
                </div>
                <div>
                  <span className={styles.eye}>Industry</span>
                  <b>{CAT[current.cat]}</b>
                </div>
                <div>
                  <span className={styles.eye}>Service</span>
                  <b>{TYL[current.type]}</b>
                </div>
                <div>
                  <span className={styles.eye}>Year</span>
                  <b>2026</b>
                </div>
              </div>
              <div
                className={styles.dhero}
                style={{ background: COL[current.cat] }}
              >
                <span className={styles.hd} style={{ fontSize: 18 }}>
                  {current.name} · {current.summary}
                </span>
              </div>
              <div className={styles.two}>
                <h2>The brief</h2>
                <p>
                  {current.name} came to us to stand out in the{" "}
                  {CAT[current.cat]} space. We shaped a direction that pairs
                  strong storytelling with measurable performance.
                </p>
              </div>
              <div className={styles.two}>
                <h2>Our approach</h2>
                <div className={styles.three}>
                  <div>
                    <div className={`${styles.hd} ${styles.accent}`}>01</div>
                    <div className={styles.nm}>Strategy</div>
                    <div className={styles.tg}>
                      Research, positioning and the plan behind the work.
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.hd} ${styles.accent}`}>02</div>
                    <div className={styles.nm}>Design</div>
                    <div className={styles.tg}>
                      The visual direction and craft that carried the idea.
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.hd} ${styles.accent}`}>03</div>
                    <div className={styles.nm}>Results</div>
                    <div className={styles.tg}>
                      What the campaign delivered for the brand.
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.pnRow}>
                <button type="button" onClick={() => openProject(previous.id)}>
                  <div className={styles.tg}>← Previous</div>
                  <div className={styles.nm}>{previous.name}</div>
                </button>
                <button
                  type="button"
                  style={{ textAlign: "right" }}
                  onClick={() => openProject(next.id)}
                >
                  <div className={styles.tg}>Next →</div>
                  <div className={styles.nm}>{next.name}</div>
                </button>
              </div>
            </div>
            <div className={styles.w}>
              <div className={styles.ct}>
                <h2>
                  Want a result like this?{" "}
                  <span className={styles.accent}>Let&rsquo;s build it.</span>
                </h2>
                <Link className={styles.btn} href="/contact">
                  Start Your Project →
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
      {current?.type === "ads" && (
        <div
          className={styles.adsLightbox}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDrawer();
          }}
        >
          <div
            className={styles.adsDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ads-preview-title"
          >
            <h2 className="sr-only" id="ads-preview-title">
              {current.name} ads preview
            </h2>
            <button
              className={styles.adsClose}
              type="button"
              aria-label="Close preview"
              onClick={closeDrawer}
            >
              <span aria-hidden="true">×</span> Close
            </button>
            <div className={styles.adsPreview}>
              <Image
                src={current.image}
                alt={`${current.name} advertising campaign`}
                fill
                sizes="(max-width: 700px) 90vw, 560px"
                className={styles.adsPreviewImage}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
