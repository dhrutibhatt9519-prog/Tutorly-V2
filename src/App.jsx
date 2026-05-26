import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Link, NavLink, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import tutorlyLogo from "../assets/tutorly_logo.png";
import tutorsData from "../data/tutors.json";

const AppContext = createContext(null);
const FAVORITES_KEY = "tutorly-favourites";

const pageShell = "mx-auto w-[min(1180px,calc(100%-32px))] sm:w-[min(1180px,calc(100%-48px))]";
const card = "rounded-[28px] border border-emerald-950/10 bg-white/85 shadow-[0_24px_80px_rgba(17,64,57,0.10)] backdrop-blur";
const eyebrow = "text-xs font-extrabold uppercase tracking-[0.28em] text-teal-700";
const h1 = "font-serif text-5xl font-semibold leading-[0.95] text-emerald-950 sm:text-6xl lg:text-7xl";
const h2 = "font-serif text-4xl font-semibold leading-none text-emerald-950 sm:text-5xl";
const bodyText = "text-base leading-8 text-slate-600";
const labelText = "text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-950";
const inputClass = "mt-2 w-full rounded-2xl border border-emerald-950/10 bg-white px-4 py-3.5 text-emerald-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-700/10";
const primaryButton = "inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-800 via-teal-600 to-amber-400 px-6 text-sm font-extrabold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:shadow-xl";
const secondaryButton = "inline-flex min-h-12 items-center justify-center rounded-2xl border border-emerald-950/10 bg-white px-6 text-sm font-extrabold text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700/30";
const chip = "inline-flex min-h-9 items-center justify-center rounded-full border border-teal-700/15 bg-teal-700/5 px-3 text-sm font-bold text-teal-800";

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors.html" element={<Tutors />} />
        <Route path="/become-tutor" element={<BecomeTutor />} />
        <Route path="/become-tutor.html" element={<BecomeTutor />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/favourites.html" element={<Favourites />} />
        <Route path="/tutor-details" element={<TutorDetail />} />
        <Route path="/tutor-details.html" element={<TutorDetail />} />
      </Routes>
    </AppProvider>
  );
}

function AppProvider({ children }) {
  const [favourites, setFavourites] = useLocalStorage(FAVORITES_KEY, []);

  const toggleFavourite = (id) => {
    setFavourites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const value = useMemo(
    () => ({ tutors: tutorsData, favourites, toggleFavourite }),
    [favourites]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useTutorly() {
  return useContext(AppContext);
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function Page({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f2ea] font-sans text-emerald-950">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname]);

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      isActive ? "bg-teal-800 text-white shadow-lg shadow-teal-900/10" : "text-slate-600 hover:bg-teal-700/10 hover:text-teal-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#fffdf9]/90 backdrop-blur-xl">
      <div className={`${pageShell} flex items-center justify-between py-4`}>
        <Link className="flex items-center gap-3" to="/" aria-label="Tutorly home">
          <img className="h-11 w-auto" src={tutorlyLogo} alt="Tutorly logo" />
        </Link>
        <button
          className="inline-flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-950/10 bg-white text-emerald-950 shadow-sm lg:hidden"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
        <nav
          id="site-nav"
          className={`${isOpen ? "flex" : "hidden"} absolute left-4 right-4 top-[calc(100%+10px)] flex-col gap-2 rounded-[24px] border border-emerald-950/10 bg-white p-3 shadow-2xl shadow-emerald-950/10 lg:static lg:flex lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/tutors" className={navClass}>Tutors</NavLink>
          <NavLink to="/become-tutor" className={navClass}>Become a Tutor</NavLink>
          <NavLink to="/favourites" className={navClass}>Favourites</NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className={`${pageShell} grid justify-items-center gap-3 py-10 text-center`}>
        <Link className="flex items-center gap-3" to="/">
          <img className="h-10 brightness-0 invert" src={tutorlyLogo} alt="Tutorly" />
        </Link>
        <p className="text-sm text-white/70">Empowering students through exceptional education</p>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <Page>
      <section className="overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(223,185,48,0.24),transparent_24%),linear-gradient(135deg,#073f3b_0%,#0f766e_52%,#d9b82f_145%)] text-white">
        <div className={`${pageShell} grid min-h-[calc(100svh-80px)] items-center gap-12 py-20 lg:grid-cols-[1fr_420px]`}>
          <div>
            <h1 className="max-w-3xl font-serif text-6xl font-semibold leading-[0.9] sm:text-7xl lg:text-8xl">Find your tutor</h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/85">
              Discover exceptional tutors who transform learning into achievement. Connect with expert educators tailored
              to your needs across Waterloo Region and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className={primaryButton} to="/tutors">Browse Tutors</Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15" to="/become-tutor">
                Become a Tutor
              </Link>
            </div>
            <div className="mt-14 grid max-w-2xl grid-cols-3 gap-4">
              {[
                ["500+", "Expert Tutors"],
                ["98%", "Success Rate"],
                ["12K+", "Students Helped"]
              ].map(([value, label]) => (
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur" key={label}>
                  <strong className="block font-serif text-4xl font-semibold">{value}</strong>
                  <span className="mt-1 block text-sm text-white/75">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${card} hidden p-5 text-emerald-950 lg:block`}>
            <div className="rounded-[22px] bg-[#f7f2e8] p-5">
              <p className={eyebrow}>Featured match</p>
              <TutorCard tutor={tutorsData[0]} compact />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className={pageShell}>
          <SectionHeading
            eyebrowText="Why Tutorly"
            title="A calmer way to find the right support."
            copy="Tutorly gives families a clean, practical way to compare tutors, understand availability, and save strong matches without messy spreadsheets."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article className={`${card} p-7`} key={benefit.title}>
                <div className="mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-800 text-white">
                  {benefit.icon}
                </div>
                <h3 className="font-serif text-3xl font-semibold text-emerald-950">{benefit.title}</h3>
                <p className={`${bodyText} mt-3`}>{benefit.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className={`${card} flex flex-col justify-between gap-6 bg-emerald-950 p-8 text-white sm:flex-row sm:items-center`}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-950">Trusted platform</p>
                <p className="mt-3 max-w-2xl text-xl leading-8 text-emerald-950">Trusted by 12,000+ students and recognized as an award-winning education platform in 2025.</p>
              </div>
              <Link className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 px-6 text-sm font-extrabold text-white" to="/tutors">
                Start Matching
              </Link>
            </div>
            <TriviaCard />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className={pageShell}>
          <SectionHeading
            eyebrowText="How it works"
            title="Four steps from search to progress."
            copy="A simple flow for discovering, comparing, contacting, and learning with tutors who fit your goals."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article className="rounded-[28px] border border-emerald-950/10 bg-[#f6f2ea] p-7" key={step.title}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-sm font-extrabold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-7 font-serif text-3xl font-semibold text-emerald-950">{step.title}</h3>
                <p className={`${bodyText} mt-3`}>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function TriviaCard() {
  const [trivia, setTrivia] = useState({ question: "Loading trivia...", answer: "" });
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTrivia() {
      try {
        const response = await fetch("https://api.api-ninjas.com/v1/trivia", {
          headers: { "X-Api-Key": "ANxjyRqlHf4G0Xy2Pvw2yf2D4TwoyEasV9xr6ThU" }
        });
        if (!response.ok) throw new Error("Failed to fetch trivia");
        const data = await response.json();
        if (active && data?.[0]) setTrivia({ question: data[0].question, answer: data[0].answer });
      } catch {
        if (active) setTrivia({ question: "Couldn't load trivia right now.", answer: "" });
      }
    }

    loadTrivia();
    return () => {
      active = false;
    };
  }, []);

  return (
    <article className={`${card} p-7`}>
      <p className={eyebrow}>Trivia of the Day</p>
      <p className="mt-4 text-lg font-bold leading-7 text-emerald-950">{trivia.question}</p>
      {showAnswer && trivia.answer ? <p className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 font-bold text-emerald-950">{trivia.answer}</p> : null}
      <button className={`${secondaryButton} mt-5 w-full`} type="button" onClick={() => setShowAnswer((current) => !current)}>
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button>
    </article>
  );
}

function Tutors() {
  const { tutors } = useTutorly();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    price: 150,
    subjects: [],
    locations: [],
    availability: []
  });

  const subjectValues = useMemo(() => uniqueValues(tutors.flatMap((tutor) => tutor.subject)), [tutors]);
  const locationValues = useMemo(() => uniqueValues(tutors.map((tutor) => tutor.location)), [tutors]);
  const availabilityValues = useMemo(() => uniqueValues(tutors.flatMap((tutor) => tutor.availability)), [tutors]);
  const filteredTutors = useMemo(() => applyTutorFilters(tutors, filters), [tutors, filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleListValue = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value]
    }));
  };
  const resetFilters = () => setFilters({ search: "", price: 150, subjects: [], locations: [], availability: [] });

  return (
    <Page>
      <HeroBand
        eyebrowText="Tutor marketplace"
        title="Find the right tutor faster."
        copy="Filter by subject, location, availability, and budget while keeping every tutor pin visible on the map."
      />
      <section className="py-12 sm:py-16">
        <div className={pageShell}>
          <div className={`${card} overflow-hidden p-4 sm:p-6`}>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className={eyebrow}>Tutor Locations</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold text-emerald-950">Map view</h2>
              </div>
              <p className="text-sm font-bold text-slate-500">Found {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"}</p>
            </div>
            <TutorMap tutors={filteredTutors} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
            <FiltersPanel
              filters={filters}
              subjectValues={subjectValues}
              locationValues={locationValues}
              availabilityValues={availabilityValues}
              updateFilter={updateFilter}
              toggleListValue={toggleListValue}
              resetFilters={resetFilters}
            />
            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className={eyebrow}>Available now</p>
                  <h2 className={h2}>Available Tutors</h2>
                </div>
                <p className="text-sm font-bold text-slate-500">Found {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"} matching your criteria</p>
              </div>
              {filteredTutors.length ? (
                <TutorGrid tutors={filteredTutors} />
              ) : (
                <EmptyState
                  title="No tutors match these filters yet."
                  copy="Try resetting the filters or choosing a broader subject or price range."
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

function FiltersPanel({ filters, subjectValues, locationValues, availabilityValues, updateFilter, toggleListValue, resetFilters }) {
  return (
    <aside className={`${card} sticky top-24 h-fit p-5`}>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-3xl font-semibold text-emerald-950">Filters</h3>
        <button className="text-sm font-extrabold text-teal-800 hover:text-teal-950" type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>
      <div className="mt-5">
        <label className={labelText} htmlFor="directory-search">Search</label>
        <input
          id="directory-search"
          className={inputClass}
          type="search"
          placeholder="Search tutors"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </div>
      <div className="mt-5 grid gap-4 lg:hidden">
        <SelectFilter label="Subject" value={filters.subjects[0] || ""} values={subjectValues} placeholder="All subjects" onChange={(value) => updateFilter("subjects", value ? [value] : [])} />
        <SelectFilter label="Location" value={filters.locations[0] || ""} values={locationValues} placeholder="All locations" onChange={(value) => updateFilter("locations", value ? [value] : [])} />
        <SelectFilter label="Availability" value={filters.availability[0] || ""} values={availabilityValues} placeholder="Any day" onChange={(value) => updateFilter("availability", value ? [value] : [])} />
      </div>
      <CheckboxGroup title="Subjects" values={subjectValues} selected={filters.subjects} onChange={(value) => toggleListValue("subjects", value)} />
      <CheckboxGroup title="Location" values={locationValues} selected={filters.locations} onChange={(value) => toggleListValue("locations", value)} />
      <div className="mt-6 hidden lg:block">
        <h4 className={labelText}>Availability</h4>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {availabilityValues.map((value) => (
            <button
              className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                filters.availability.includes(value)
                  ? "border-amber-400 bg-amber-100 text-emerald-950"
                  : "border-emerald-950/10 bg-white text-slate-600 hover:border-teal-700/30"
              }`}
              key={value}
              type="button"
              onClick={() => toggleListValue("availability", value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h4 className={labelText}>Price Range</h4>
          <span className="rounded-full bg-teal-800 px-3 py-1 text-xs font-extrabold text-white">${filters.price}/hr max</span>
        </div>
        <input
          className="mt-4 w-full accent-teal-700"
          type="range"
          min="40"
          max="150"
          step="5"
          value={filters.price}
          onChange={(event) => updateFilter("price", Number(event.target.value))}
        />
      </div>
    </aside>
  );
}

function SelectFilter({ label, value, values, placeholder, onChange }) {
  const id = `filter-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div>
      <label className={labelText} htmlFor={id}>{label}</label>
      <select className={inputClass} id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
  );
}

function CheckboxGroup({ title, values, selected, onChange }) {
  return (
    <div className="mt-6 hidden lg:block">
      <h4 className={labelText}>{title}</h4>
      <div className="mt-3 grid gap-2">
        {values.map((value) => (
          <label className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-sm font-bold text-slate-600" key={value}>
            <input className="h-4 w-4 accent-teal-700" type="checkbox" checked={selected.includes(value)} onChange={() => onChange(value)} />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TutorMap({ tutors }) {
  const mapElement = useRef(null);
  const map = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapElement.current || map.current) return;

    map.current = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map.current);

    markersLayer.current = L.layerGroup().addTo(map.current);
  }, []);

  useEffect(() => {
    if (!map.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    if (!tutors.length) {
      map.current.setView([43.45, -80.49], 9);
      return;
    }

    const bounds = [];

    tutors.forEach((tutor) => {
      const icon = L.divIcon({
        className: "",
        html: '<div class="h-6 w-6 -rotate-45 rounded-[50%_50%_50%_0] border-4 border-white bg-teal-700 shadow-xl shadow-teal-900/25"><div class="m-1 h-2 w-2 rounded-full bg-white"></div></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 24]
      });
      const marker = L.marker([tutor.lat, tutor.lng], { icon });
      marker
        .bindPopup(`<strong>${tutor.name}</strong><br>${tutor.location}, ${tutor.city}`)
        .bindTooltip(tutor.location, {
          permanent: true,
          direction: "top",
          className: "rounded-full border border-teal-700/20 bg-white px-3 py-2 text-xs font-bold text-emerald-950 shadow-lg",
          offset: [0, -18]
        });
      marker.addTo(markersLayer.current);
      bounds.push([tutor.lat, tutor.lng]);
    });

    map.current.fitBounds(bounds, { padding: [36, 36], maxZoom: 10 });
    window.setTimeout(() => map.current?.invalidateSize(), 80);
  }, [tutors]);

  return <div ref={mapElement} className="h-[320px] overflow-hidden rounded-[24px] border border-emerald-950/10 bg-slate-100 sm:h-[430px]" />;
}

function TutorGrid({ tutors }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
    </div>
  );
}

function TutorCard({ tutor, compact = false }) {
  const { favourites, toggleFavourite } = useTutorly();
  const isSaved = favourites.includes(tutor.id);

  return (
    <article className={`${card} overflow-hidden ${compact ? "shadow-none" : ""}`}>
      <div className="h-2 bg-gradient-to-r from-teal-800 via-teal-500 to-amber-300" />
      <div className={compact ? "p-4" : "p-5 sm:p-6"}>
        <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
          <div className="relative">
            <img className="h-20 w-20 rounded-3xl border-4 border-amber-300 object-cover sm:h-24 sm:w-24" src={tutor.image} alt={tutor.name} />
            <span className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-amber-300 text-teal-900">
              <IconBadge className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="font-serif text-3xl font-semibold leading-none text-emerald-950">{tutor.name}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
              <Rating rating={tutor.rating} />
              <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
            </div>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><IconLocation />{tutor.location}</p>
          </div>
          <button
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-extrabold transition ${
              isSaved ? "border-amber-300 bg-amber-100 text-amber-700" : "border-emerald-950/10 bg-white text-teal-800 hover:border-teal-700/30"
            }`}
            type="button"
            onClick={() => toggleFavourite(tutor.id)}
            aria-label={`${isSaved ? "Remove" : "Save"} ${tutor.name}`}
          >
            <IconHeart filled={isSaved} />
          </button>
        </div>
        <p className={`${bodyText} mt-5`}>{tutor.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tutor.subject.map((item) => <span className={chip} key={item}>{item}</span>)}
        </div>
        <div className="my-5 grid grid-cols-2 gap-3 border-y border-emerald-950/10 py-4">
          <MiniStat icon={<IconClock />} label="Experience" value={`${tutor.experience} years`} />
          <MiniStat icon={<IconDollar />} label="Price/Hour" value={`$${tutor.price}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          {tutor.availability.map((slot) => <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800" key={slot}>{slot}</span>)}
        </div>
        {!compact ? (
          <Link className={`${secondaryButton} mt-5 w-full`} to={`/tutor-details?id=${tutor.id}`}>View Profile</Link>
        ) : null}
      </div>
    </article>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-700/10 text-teal-800">{icon}</span>
      <div>
        <span className="block text-xs font-bold text-slate-500">{label}</span>
        <strong className="block text-sm text-emerald-950">{value}</strong>
      </div>
    </div>
  );
}

function TutorDetail() {
  const { tutors } = useTutorly();
  const [searchParams] = useSearchParams();
  const requestedId = Number(searchParams.get("id")) || 1;
  const tutor = tutors.find((item) => item.id === requestedId);

  useEffect(() => {
    document.title = tutor ? `Tutorly | ${tutor.name}` : "Tutorly | Tutor Details";
  }, [tutor]);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#f6f2ea] font-sans text-emerald-950">
        <DetailHeader />
        <main className={`${pageShell} py-16`}>
          <EmptyState title="Tutor not found" copy="We couldn't find that tutor profile. Try returning to the tutor directory." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] font-sans text-emerald-950">
      <DetailHeader />
      <main>
        <section className="bg-[linear-gradient(135deg,#073f3b,#0f766e_60%,#d9b82f_160%)] py-14 text-white">
          <div className={`${pageShell} grid items-center gap-8 lg:grid-cols-[260px_1fr]`}>
            <div className="relative w-fit">
              <img className="h-56 w-56 rounded-[36px] border-4 border-amber-300 object-cover shadow-2xl shadow-emerald-950/25" src={tutor.image} alt={tutor.name} />
              <span className="absolute -bottom-5 -right-5 inline-flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#f6f2ea] bg-amber-300 text-teal-950">
                <IconBadge className="h-9 w-9" />
              </span>
            </div>
            <div>
              <h1 className="font-serif text-5xl font-semibold leading-none sm:text-7xl">{tutor.name}</h1>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/80">
                <Rating rating={tutor.rating} />
                <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
                <span className="inline-flex items-center gap-2"><IconLocation />{tutor.location}</span>
                <span className="inline-flex items-center gap-2"><IconClock />{tutor.experience} years experience</span>
                <span className="inline-flex items-center gap-2"><IconDollar />${tutor.price}/hour</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {tutor.subject.map((item) => <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white" key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </section>
        <section className={`${pageShell} grid gap-7 py-10 lg:grid-cols-[1fr_390px]`}>
          <div className="grid gap-6">
            <DetailCard icon={<IconBook />} title="About Me"><p className={bodyText}>{tutor.about}</p></DetailCard>
            <DetailList icon={<IconAward />} title="Education" items={tutor.education} />
            <DetailList icon={<IconStar />} title="Achievements" items={tutor.achievements} />
            <DetailCard icon={<IconSpark />} title="Specialties">
              <div className="flex flex-wrap gap-2">{tutor.specialties.map((item) => <span className={chip} key={item}>{item}</span>)}</div>
            </DetailCard>
            <DetailCard icon={<IconMessage />} title="Student Reviews">
              <div className="grid gap-5">
                {tutor.reviewsList.map((review) => (
                  <div className="border-t border-emerald-950/10 pt-5 first:border-t-0 first:pt-0" key={`${review.name}-${review.date}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-emerald-950">{review.name}</p>
                        <Rating rating={review.rating} />
                      </div>
                      <span className="text-sm font-bold text-slate-500">{review.date}</span>
                    </div>
                    <p className={`${bodyText} mt-3`}>{review.text}</p>
                  </div>
                ))}
              </div>
            </DetailCard>
          </div>
          <ContactCard tutor={tutor} />
        </section>
      </main>
    </div>
  );
}

function DetailHeader() {
  return (
    <header className="border-b border-emerald-950/10 bg-[#fffdf9]">
      <div className={`${pageShell} flex items-center justify-between py-4`}>
        <Link className={secondaryButton} to="/tutors">Back to Tutors</Link>
      </div>
    </header>
  );
}

function DetailCard({ icon, title, children }) {
  return (
    <article className={`${card} p-6 sm:p-8`}>
      <h3 className="mb-5 flex items-center gap-3 font-serif text-3xl font-semibold text-emerald-950">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700/10 text-teal-800">{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </article>
  );
}

function DetailList({ icon, title, items }) {
  return (
    <DetailCard icon={icon} title={title}>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 text-slate-600" key={item}>
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <span className="leading-8">{item}</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}

function ContactCard({ tutor }) {
  const [message, setMessage] = useState("");

  return (
    <aside className={`${card} sticky top-24 h-fit p-6 sm:p-8`}>
      <h2 className="font-serif text-4xl font-semibold text-emerald-950">Contact {tutor.name.split(" ")[0]}</h2>
      <p className={`${bodyText} mt-3`}>Fill out the form below to get started.</p>
      <form className="mt-5 grid gap-4" onSubmit={(event) => handleFormSubmit(event, setMessage, `Message prepared for ${tutor.name}. We'll be in touch soon.`)}>
        <FormInput id="contact-name" label="Your Name" name="name" placeholder="John Doe" />
        <FormInput id="contact-email" label="Email Address" name="email" type="email" placeholder="john@example.com" />
        <FormInput id="contact-phone" label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" />
        <div>
          <label className={labelText} htmlFor="contact-subject">Subject of Interest</label>
          <select className={inputClass} id="contact-subject" name="subject" required>
            <option value="">Select a subject</option>
            {tutor.subject.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </div>
        <FormInput id="contact-date" label="Preferred Date" name="date" type="date" />
        <div>
          <label className={labelText} htmlFor="contact-message">Message</label>
          <textarea className={`${inputClass} min-h-32 resize-y`} id="contact-message" name="message" rows="5" placeholder="Tell us about your learning goals..." required />
        </div>
        <button className={primaryButton} type="submit">Send Message</button>
        <p className="min-h-6 font-bold text-teal-800" aria-live="polite">{message}</p>
      </form>
      <div className="mt-5 border-t border-emerald-950/10 pt-5 text-sm font-bold text-slate-500">
        <p className="flex items-center gap-2"><IconCalendar />Available: {tutor.availability.join(", ")}</p>
        <p className="mt-3 flex items-center gap-2"><IconClock />Response time: {tutor.responseTime}</p>
      </div>
    </aside>
  );
}

function Favourites() {
  const { tutors, favourites } = useTutorly();
  const favouriteTutors = tutors.filter((tutor) => favourites.includes(tutor.id));

  return (
    <Page>
      <HeroBand
        eyebrowText="Saved tutors"
        title="Your favourite tutors in one place."
        copy="Come back to the tutors you liked most and jump straight into their full profiles."
      />
      <section className="py-12 sm:py-16">
        <div className={pageShell}>
          {favouriteTutors.length ? (
            <TutorGrid tutors={favouriteTutors} />
          ) : (
            <EmptyState
              title="No favourite tutors yet."
              copy="Save tutors from the directory and they'll appear here for quick access."
              action={<Link className={primaryButton} to="/tutors">Browse Tutors</Link>}
            />
          )}
        </div>
      </section>
    </Page>
  );
}

function BecomeTutor() {
  const [message, setMessage] = useState("");

  return (
    <Page>
      <HeroBand
        eyebrowText="Join Tutorly"
        title="Teach with a platform built for trust."
        copy="Share your expertise with students who need the right guide. Build a polished profile and connect with families looking for trusted subject experts."
      />
      <section className="py-12 sm:py-16">
        <div className={`${pageShell} grid gap-7 lg:grid-cols-[0.85fr_1.15fr]`}>
          <div>
            <SectionHeading
              align="left"
              eyebrowText="Application process"
              title="What we look for"
              copy="Strong tutor profiles combine depth, clarity, and reliable availability."
            />
            <div className="grid gap-4">
              {criteria.map((item) => (
                <article className={`${card} p-6`} key={item.title}>
                  <h3 className="font-serif text-3xl font-semibold text-emerald-950">{item.title}</h3>
                  <p className={`${bodyText} mt-3`}>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
          <form className={`${card} p-6 sm:p-8`} onSubmit={(event) => handleFormSubmit(event, setMessage, "Application submitted. We'll review your profile and email you soon.")}>
            <h2 className={h2}>Become a Tutor</h2>
            <p className={`${bodyText} mt-3`}>Tell us about your teaching background and we'll review your profile.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormInput id="apply-name" label="Full Name" name="name" placeholder="Jane Doe" />
              <FormInput id="apply-email" label="Email Address" name="email" type="email" placeholder="jane@example.com" />
              <FormInput id="apply-phone" label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" />
              <FormInput id="apply-location" label="Location" name="location" placeholder="Waterloo" />
              <FormInput id="apply-subject" label="Primary Subject" name="subject" placeholder="Mathematics" />
              <FormInput id="apply-experience" label="Years of Experience" name="experience" type="number" min="0" placeholder="5" />
            </div>
            <div className="mt-4">
              <label className={labelText} htmlFor="apply-bio">Professional Summary</label>
              <textarea className={`${inputClass} min-h-36 resize-y`} id="apply-bio" name="bio" rows="5" placeholder="Share your teaching approach, credentials, and specialties." required />
            </div>
            <div className="mt-4">
              <label className={labelText} htmlFor="apply-availability">Availability</label>
              <select className={inputClass} id="apply-availability" name="availability" required>
                <option value="">Select availability</option>
                <option>Weekdays</option>
                <option>Evenings</option>
                <option>Weekends</option>
                <option>Flexible</option>
              </select>
            </div>
            <button className={`${primaryButton} mt-5`} type="submit">Submit Application</button>
            <p className="mt-4 min-h-6 font-bold text-teal-800" aria-live="polite">{message}</p>
          </form>
        </div>
      </section>
    </Page>
  );
}

function HeroBand({ eyebrowText, title, copy }) {
  return (
    <section className="border-b border-emerald-950/10 bg-[radial-gradient(circle_at_84%_16%,rgba(217,184,47,0.18),transparent_24%),linear-gradient(180deg,rgba(20,184,166,0.10),transparent)] py-14 sm:py-20">
      <div className={pageShell}>
        <p className={eyebrow}>{eyebrowText}</p>
        <h1 className={`${h1} mt-4 max-w-3xl`}>{title}</h1>
        <p className={`${bodyText} mt-5 max-w-2xl text-lg`}>{copy}</p>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrowText, title, copy, align = "center" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} mb-10 max-w-3xl`}>
      <p className={eyebrow}>{eyebrowText}</p>
      <h2 className={`${h2} mt-4`}>{title}</h2>
      <p className={`${bodyText} mt-4`}>{copy}</p>
    </div>
  );
}

function EmptyState({ title, copy, action }) {
  return (
    <div className={`${card} grid justify-items-center p-10 text-center`}>
      <h2 className="font-serif text-4xl font-semibold text-emerald-950">{title}</h2>
      <p className={`${bodyText} mt-3 max-w-xl`}>{copy}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

function FormInput({ id, label, type = "text", ...props }) {
  return (
    <div>
      <label className={labelText} htmlFor={id}>{label}</label>
      <input className={inputClass} id={id} type={type} required {...props} />
    </div>
  );
}

function handleFormSubmit(event, setMessage, successMessage) {
  event.preventDefault();
  setMessage(successMessage);
  event.currentTarget.reset();
}

function applyTutorFilters(tutors, filters) {
  const search = filters.search.trim().toLowerCase();

  return tutors.filter((tutor) => {
    const searchHaystack = [tutor.name, tutor.location, tutor.city, tutor.bio, ...tutor.subject].join(" ").toLowerCase();
    const matchesSearch = !search || searchHaystack.includes(search);
    const matchesSubject = !filters.subjects.length || tutor.subject.some((item) => filters.subjects.includes(item));
    const matchesLocation = !filters.locations.length || filters.locations.includes(tutor.location);
    const matchesAvailability = !filters.availability.length || tutor.availability.some((slot) => filters.availability.includes(slot));
    const matchesPrice = tutor.price <= filters.price;
    return matchesSearch && matchesSubject && matchesLocation && matchesAvailability && matchesPrice;
  });
}

function uniqueValues(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function Rating({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-400" aria-label={`${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <IconStarSolid className="h-6 w-6" active={index < Math.round(rating)} key={index} />
      ))}
    </span>
  );
}

function IconBase({ children, className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function IconLocation() {
  return <IconBase className="h-4 w-4"><path d="M12 21s-6-4.6-6-10a6 6 0 1 1 12 0c0 5.4-6 10-6 10z" /><circle cx="12" cy="11" r="2.5" /></IconBase>;
}

function IconClock() {
  return <IconBase className="h-6 w-6"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></IconBase>;
}

function IconDollar() {
  return <IconBase className="h-4 w-4"><path d="M12 3v14" /><path d="M15.5 7.5c0-1.4-1.6-2.5-3.5-2.5S8.5 6.1 8.5 7.5 10.1 10 12 10s3.5 1.1 3.5 2.5S13.9 15 12 15s-3.5-1.1-3.5-2.5" /></IconBase>;
}

function IconBadge({ className = "h-6 w-6" }) {
  return <IconBase className={className}><circle cx="12" cy="8.5" r="4.5" /><path d="M9.5 13l-1 7 3.5-2 3.5 2-1-7" /></IconBase>;
}

function IconBook() {
  return <IconBase><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a.5.5 0 0 1-.5.5h-13A2.5 2.5 0 0 1 4 17.5v-11z" /><path d="M8 4v16" /></IconBase>;
}

function IconAward() {
  return <IconBase><circle cx="12" cy="8" r="4" /><path d="M9.5 12.5 8 20l4-2 4 2-1.5-7.5" /></IconBase>;
}

function IconStar() {
  return <IconBase><path d="M12 4l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 16l-4.8 2.5.9-5.2L4.3 9.6l5.3-.8L12 4z" /></IconBase>;
}

function IconSpark() {
  return <IconBase><path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4z" /><path d="M18 4l.8 2 .2.2 2 .8-2 .8-.2.2-.8 2-.8-2-.2-.2-2-.8 2-.8.2-.2.8-2z" /></IconBase>;
}

function IconMessage() {
  return <IconBase><path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /></IconBase>;
}

function IconCalendar() {
  return <IconBase className="h-4 w-4"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 4v4M16 4v4M4 11h16" /></IconBase>;
}

function IconHeart({ filled }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

function IconStarSolid({ className, active }) {
  return (
    <svg className={`${className} ${active ? "text-amber-400" : "text-slate-300"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.6l2.6 5.2 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.6z" />
    </svg>
  );
}

const benefits = [
  { title: "Verified Experts", copy: "Every tutor undergoes credential checks and profile reviews before they appear in our directory.", icon: <IconBadge /> },
  { title: "Proven Results", copy: "Families consistently report stronger confidence, higher grades, and better study habits.", icon: <IconStar /> },
  { title: "Flexible Scheduling", copy: "Choose evening, weekend, or weekday sessions with tutors who fit your pace and routine.", icon: <IconClock /> },
  { title: "Personalized Matching", copy: "Find tutors by subject, location, price, and availability without digging through cluttered profiles.", icon: <IconHeart /> },
  { title: "Progress Tracking", copy: "Build momentum with tutors who set goals, share feedback, and support consistent improvement.", icon: <IconSpark /> },
  { title: "Community Support", copy: "From first contact to regular lessons, Tutorly helps students and parents stay connected.", icon: <IconMessage /> }
];

const steps = [
  { title: "Discover Your Match", copy: "Browse expert tutors and filter by subject, location, availability, and price." },
  { title: "Review & Connect", copy: "Explore profiles, read reviews, and reach out to tutors who fit your learning style." },
  { title: "Schedule Sessions", copy: "Book sessions at times that work for your family, with clear availability and response windows." },
  { title: "Achieve Excellence", copy: "Learn with confidence, track progress, and build long-term academic momentum." }
];

const criteria = [
  { title: "Subject depth", copy: "Show clear expertise in your core subjects, curriculum familiarity, and teaching outcomes." },
  { title: "Communication skills", copy: "We prioritize tutors who explain complex topics clearly and can adapt to different learners." },
  { title: "Reliable availability", copy: "Students need dependable scheduling, fast replies, and consistent session planning." }
];

export default App;
