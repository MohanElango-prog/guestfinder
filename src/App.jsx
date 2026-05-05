import { useState, useEffect, useMemo, useRef } from "react";

const guestsData = [
  { name: "Arun Kumar", table: 1 },
  { name: "Divya R", table: 2 },
  { name: "Mohan Kumar", table: 3 },
  { name: "Sneha S", table: 1 },
  { name: "Rahul V", table: 4 },
  { name: "Priya Sharma", table: 2 },
  { name: "Vikram Singh", table: 3 },
  { name: "Ananya Patel", table: 1 },
  { name: "Raj Malhotra", table: 4 },
  { name: "Kavya Reddy", table: 2 },
];

const TABLE_COLORS = {
  1: { bg: "#1a2236", accent: "#c9a84c", light: "#e8d5a3" },
  2: { bg: "#1c2131", accent: "#8fb3c9", light: "#c5dce8" },
  3: { bg: "#1e1e2e", accent: "#c97c8c", light: "#e8b8c2" },
  4: { bg: "#1b2420", accent: "#7ac996", light: "#b8e8c8" },
};

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  const filteredGuests = useMemo(() => {
    if (!search.trim()) return [];
    return guestsData
      .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(search.toLowerCase());
        const bExact = b.name.toLowerCase().startsWith(search.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [search]);

  const tableStats = useMemo(() => {
    const stats = {};
    guestsData.forEach((g) => {
      stats[g.table] = (stats[g.table] || 0) + 1;
    });
    return stats;
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSelectedGuest(null);
      setShowSuggestions(false);
      setRevealed(false);
    }
  }, [search]);

  const handleSelect = (guest) => {
    setSelectedGuest(guest);
    setSearch(guest.name);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    setRevealed(false);
    setTimeout(() => setRevealed(true), 50);
  };

  const highlightMatch = (text, search) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} style={{ color: '#c9a84c', fontWeight: '600' }}>{part}</span> : part
    );
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredGuests.length === 0) return;
    const max = Math.min(filteredGuests.length, 5);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((p) => (p + 1) % max);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((p) => (p <= 0 ? max - 1 : p - 1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredGuests[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const accent = selectedGuest ? TABLE_COLORS[selectedGuest.table]?.accent || "#c9a84c" : "#c9a84c";
  const lightAccent = selectedGuest ? TABLE_COLORS[selectedGuest.table]?.light || "#e8d5a3" : "#e8d5a3";

  return (
    <div style={styles.root}>
      {/* Decorative background */}
      <svg style={styles.bgSvg} viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="rg1" cx="30%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#1e2a4a" />
            <stop offset="100%" stopColor="#0a0e1a" />
          </radialGradient>
          <radialGradient id="rg2" cx="80%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#rg1)" />
        <rect width="800" height="800" fill="url(#rg2)" />
        {/* Decorative arcs */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={i}
            cx="400" cy="400"
            r={100 + i * 80}
            fill="none"
            stroke="#c9a84c"
            strokeWidth="0.4"
            strokeOpacity={0.06 - i * 0.008}
          />
        ))}
        {/* Corner ornaments */}
        <g opacity="0.12" stroke="#c9a84c" strokeWidth="1" fill="none">
          <path d="M 30 30 L 30 80 M 30 30 L 80 30" />
          <path d="M 770 30 L 770 80 M 770 30 L 720 30" />
          <path d="M 30 770 L 30 720 M 30 770 L 80 770" />
          <path d="M 770 770 L 770 720 M 770 770 L 720 770" />
          {/* Diamond at each corner junction */}
          {[[30,30],[770,30],[30,770],[770,770]].map(([x,y],i) => (
            <path key={i} d={`M ${x} ${y-6} L ${x+6} ${y} L ${x} ${y+6} L ${x-6} ${y} Z`} />
          ))}
        </g>
      </svg>

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.ornamentLine}>
            <span style={styles.ornamentDot} />
            <span style={{...styles.ornamentRule, background: `linear-gradient(90deg, transparent, #c9a84c40, #c9a84c, #c9a84c40, transparent)`}} />
            <span style={{...styles.ornamentDiamond, color: "#c9a84c"}}>◆</span>
            <span style={{...styles.ornamentRule, background: `linear-gradient(90deg, transparent, #c9a84c40, #c9a84c, #c9a84c40, transparent)`}} />
            <span style={styles.ornamentDot} />
          </div>

          <p style={styles.eyebrow}>TONIGHT'S EVENT · 7:00 PM</p>
          <h1 style={styles.title}>
            <span style={styles.titleAmp}>The</span>
            <br />
            Guest Finder
          </h1>
          <p style={styles.subtitle}>
            Discover your table assignment with grace
          </p>

          <div style={styles.ornamentLine}>
            <span style={styles.ornamentDot} />
            <span style={{...styles.ornamentRule, background: `linear-gradient(90deg, transparent, #c9a84c40, #c9a84c, #c9a84c40, transparent)`}} />
            <span style={{...styles.ornamentDiamond, color: "#c9a84c"}}>◆</span>
            <span style={{...styles.ornamentRule, background: `linear-gradient(90deg, transparent, #c9a84c40, #c9a84c, #c9a84c40, transparent)`}} />
            <span style={styles.ornamentDot} />
          </div>

          <div style={styles.metaRow}>
            <span style={styles.metaBadge}>{guestsData.length} Guests</span>
            <span style={styles.metaSep}>·</span>
            <span style={styles.metaBadge}>{Object.keys(tableStats).length} Tables</span>
          </div>
        </header>

        {/* Search */}
        <section style={styles.searchSection}>
          <div style={styles.searchWrapper}>
            <div style={styles.searchBorder}>
              <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => search.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search your name…"
                style={styles.searchInput}
                autoComplete="off"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setSelectedGuest(null); setRevealed(false); inputRef.current?.focus(); }}
                  style={styles.clearBtn}
                  aria-label="Clear"
                >✕</button>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && filteredGuests.length > 0 && (
              <div style={styles.dropdown}>
                {filteredGuests.slice(0, 5).map((guest, i) => (
                  <button
                    key={guest.name}
                    onMouseDown={() => handleSelect(guest)}
                    style={{
                      ...styles.dropdownItem,
                      background: focusedIndex === i ? "rgba(201,168,76,0.1)" : "transparent",
                      borderLeft: focusedIndex === i ? "2px solid #c9a84c" : "2px solid transparent",
                    }}
                  >
                    <span style={styles.dropdownAvatar}>
                      {guest.name.charAt(0)}
                    </span>
                    <span style={styles.dropdownName}>{highlightMatch(guest.name, search)}</span>
                    <span style={styles.dropdownTable}>Table {guest.table}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {showSuggestions && search.trim() && filteredGuests.length === 0 && (
              <div style={styles.dropdown}>
                <div style={styles.noResults}>
                  <span style={styles.noResultsIcon}>✦</span>
                  <span>No guest found — please contact the event host</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Result card */}
        {selectedGuest && (
          <section
            style={{
              ...styles.resultSection,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div style={{
              ...styles.resultCard,
              borderColor: `${accent}50`,
              boxShadow: `0 0 60px ${accent}18, 0 8px 32px rgba(0,0,0,0.5)`,
            }}>
              {/* Corner ornaments */}
              <CornerOrnament pos="tl" color={accent} />
              <CornerOrnament pos="tr" color={accent} />
              <CornerOrnament pos="bl" color={accent} />
              <CornerOrnament pos="br" color={accent} />

              <div style={{...styles.tableNumberBadge, background: accent, boxShadow: `0 4px 20px ${accent}60`}}>
                <span style={styles.tableNumberLabel}>TABLE</span>
                <span style={styles.tableNumber}>{selectedGuest.table}</span>
              </div>

              <p style={{...styles.resultGreeting, color: lightAccent}}>Welcome</p>
              <h2 style={styles.resultName}>{selectedGuest.name}</h2>

              <div style={{...styles.resultDivider, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`}} />

              <p style={styles.resultMessage}>
                Your seat is reserved and waiting.<br/>
                Please proceed to enjoy the evening.
              </p>

              <div style={{...styles.resultTag, borderColor: `${accent}40`, color: accent}}>
                ✓ Confirmed Guest
              </div>
            </div>
          </section>
        )}

        {/* Table Distribution */}
        <section style={styles.statsSection}>
          <div style={styles.statsHeader}>
            <span style={styles.statsLabel}>TABLE DISTRIBUTION</span>
          </div>
          <div style={styles.statsGrid}>
            {Object.entries(tableStats)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([table, count]) => {
                const tColor = TABLE_COLORS[parseInt(table)] || TABLE_COLORS[1];
                const isActive = selectedGuest && selectedGuest.table === parseInt(table);
                return (
                  <div
                    key={table}
                    style={{
                      ...styles.statCard,
                      borderColor: isActive ? tColor.accent : "rgba(201,168,76,0.15)",
                      boxShadow: isActive ? `0 0 24px ${tColor.accent}30` : "none",
                      background: isActive
                        ? `linear-gradient(135deg, ${tColor.bg}, rgba(10,14,26,0.95))`
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div style={{...styles.statTableNum, color: tColor.accent}}>
                      {table}
                    </div>
                    <div style={styles.statGuestCount}>
                      {count} {count === 1 ? "guest" : "guests"}
                    </div>
                    <div style={styles.statBarBg}>
                      <div
                        style={{
                          ...styles.statBarFill,
                          width: `${(count / Math.max(...Object.values(tableStats))) * 100}%`,
                          background: `linear-gradient(90deg, ${tColor.accent}, ${tColor.light})`,
                        }}
                      />
                    </div>
                    {isActive && (
                      <div style={{...styles.statYouBadge, color: tColor.accent, borderColor: tColor.accent}}>
                        Your Table
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLine} />
          <p style={styles.footerText}>
            ◆ &nbsp; Wishing you a delightful evening &nbsp; ◆
          </p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        button { cursor: pointer; font-family: inherit; }
        ::selection { background: rgba(201,168,76,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}

function CornerOrnament({ pos, color }) {
  const top = pos.startsWith("t");
  const left = pos.endsWith("l");
  return (
    <svg
      width="24" height="24"
      style={{
        position: "absolute",
        top: top ? 12 : "auto",
        bottom: !top ? 12 : "auto",
        left: left ? 12 : "auto",
        right: !left ? 12 : "auto",
        opacity: 0.5,
      }}
      viewBox="0 0 24 24"
    >
      <path
        d={left
          ? (top ? "M 2 14 L 2 2 L 14 2" : "M 2 10 L 2 22 L 14 22")
          : (top ? "M 10 2 L 22 2 L 22 14" : "M 10 22 L 22 22 L 22 10")}
        fill="none" stroke={color} strokeWidth="1.2"
      />
    </svg>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0e1a",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  bgSvg: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  page: {
    position: "relative",
    zIndex: 1,
    maxWidth: 680,
    margin: "0 auto",
    padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px) clamp(40px, 8vw, 64px)",
  },

  // Header
  header: {
    textAlign: "center",
    marginBottom: "clamp(32px, 8vw, 48px)",
  },
  ornamentLine: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "12px 0",
  },
  ornamentDot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#c9a84c",
    opacity: 0.5,
    flexShrink: 0,
  },
  ornamentRule: {
    flex: 1,
    height: 1,
  },
  ornamentDiamond: {
    fontSize: 10,
    flexShrink: 0,
  },
  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: "0.3em",
    color: "#c9a84c",
    opacity: 0.7,
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(32px, 7vw, 64px)",
    fontWeight: 400,
    color: "#f5efe0",
    lineHeight: 1.05,
    marginBottom: 12,
    letterSpacing: "0.04em",
  },
  titleAmp: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontWeight: 300,
    fontSize: "0.55em",
    color: "#c9a84c",
    letterSpacing: "0.2em",
    display: "block",
  },
  subtitle: {
    color: "#8a9ab5",
    fontSize: "clamp(15px, 3.5vw, 17px)",
    fontStyle: "italic",
    marginBottom: 4,
    letterSpacing: "0.02em",
  },
  metaRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  metaBadge: {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#c9a84c",
    opacity: 0.6,
  },
  metaSep: {
    color: "#c9a84c",
    opacity: 0.3,
  },

  // Search
  searchSection: {
    marginBottom: "clamp(24px, 6vw, 36px)",
  },
  searchWrapper: {
    position: "relative",
    maxWidth: 520,
    margin: "0 auto",
  },
  searchBorder: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(8px, 2vw, 12px)",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: 4,
    padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 18px)",
    transition: "border-color 0.3s",
  },
  searchIcon: {
    width: 18,
    height: 18,
    color: "#c9a84c",
    opacity: 0.6,
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#f5efe0",
    fontSize: "clamp(15px, 3.5vw, 17px)",
    fontFamily: "'EB Garamond', Georgia, serif",
    fontStyle: "italic",
    letterSpacing: "0.02em",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#8a9ab5",
    fontSize: 12,
    padding: "2px 4px",
    flexShrink: 0,
    opacity: 0.6,
    transition: "opacity 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#0f1526",
    border: "1px solid rgba(201,168,76,0.25)",
    borderRadius: 4,
    overflow: "hidden",
    zIndex: 50,
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(8px, 2vw, 12px)",
    width: "100%",
    padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
    border: "none",
    borderLeft: "2px solid transparent",
    color: "#d0c8b8",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontFamily: "'EB Garamond', Georgia, serif",
    transition: "background 0.15s, border-color 0.15s",
    textAlign: "left",
  },
  dropdownAvatar: {
    width: "clamp(28px, 6vw, 32px)",
    height: "clamp(28px, 6vw, 32px)",
    borderRadius: "50%",
    background: "rgba(201,168,76,0.15)",
    border: "1px solid rgba(201,168,76,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(10px, 2.5vw, 12px)",
    color: "#c9a84c",
    flexShrink: 0,
  },
  dropdownName: {
    flex: 1,
    fontStyle: "italic",
  },
  dropdownTable: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(9px, 2vw, 10px)",
    letterSpacing: "0.1em",
    color: "#c9a84c",
    opacity: 0.6,
  },
  noResults: {
    padding: "clamp(16px, 4vw, 20px) clamp(12px, 3vw, 16px)",
    color: "#8a9ab5",
    fontSize: "clamp(13px, 3vw, 15px)",
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    gap: "clamp(8px, 2vw, 10px)",
    justifyContent: "center",
  },
  noResultsIcon: {
    color: "#c9a84c",
    opacity: 0.4,
    fontSize: 12,
  },

  // Result
  resultSection: {
    marginBottom: 40,
    maxWidth: 520,
    margin: "0 auto 40px",
  },
  resultCard: {
    position: "relative",
    background: "rgba(10,14,26,0.95)",
    border: "1px solid",
    borderRadius: 4,
    padding: "clamp(32px, 6vw, 48px) clamp(24px, 5vw, 40px) clamp(28px, 5vw, 40px)",
    textAlign: "center",
    overflow: "hidden",
  },
  tableNumberBadge: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 3,
    padding: "8px 20px",
    marginBottom: 24,
    lineHeight: 1,
  },
  tableNumberLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: "0.3em",
    color: "rgba(10,14,26,0.8)",
    marginBottom: 2,
  },
  tableNumber: {
    fontFamily: "'Cinzel', serif",
    fontSize: 28,
    fontWeight: 600,
    color: "rgba(10,14,26,0.9)",
    lineHeight: 1,
  },
  resultGreeting: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: 18,
    letterSpacing: "0.1em",
    marginBottom: 4,
    opacity: 0.8,
  },
  resultName: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(20px, 4.5vw, 32px)",
    fontWeight: 400,
    color: "#f5efe0",
    letterSpacing: "0.04em",
    marginBottom: 20,
  },
  resultDivider: {
    height: 1,
    width: "60%",
    margin: "0 auto 20px",
  },
  resultMessage: {
    color: "#8a9ab5",
    fontSize: "clamp(14px, 3vw, 16px)",
    fontStyle: "italic",
    lineHeight: 1.8,
    letterSpacing: "0.01em",
    marginBottom: 24,
  },
  resultTag: {
    display: "inline-block",
    border: "1px solid",
    borderRadius: 2,
    padding: "4px 14px",
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: "0.2em",
  },

  // Stats
  statsSection: {
    maxWidth: 520,
    margin: "0 auto",
  },
  statsHeader: {
    textAlign: "center",
    marginBottom: 20,
  },
  statsLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: "0.3em",
    color: "#c9a84c",
    opacity: 0.5,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "clamp(8px, 2vw, 12px)",
  },
  statCard: {
    border: "1px solid",
    borderRadius: 4,
    padding: "clamp(16px, 3vw, 20px) clamp(16px, 3vw, 20px) clamp(12px, 2.5vw, 16px)",
    transition: "border-color 0.4s, box-shadow 0.4s, background 0.4s",
  },
  statTableNum: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: 4,
  },
  statGuestCount: {
    fontFamily: "'EB Garamond', serif",
    fontStyle: "italic",
    fontSize: "clamp(12px, 2.5vw, 14px)",
    color: "#8a9ab5",
    marginBottom: 12,
  },
  statBarBg: {
    height: 2,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  statBarFill: {
    height: "100%",
    borderRadius: 1,
    transition: "width 0.8s ease",
  },
  statYouBadge: {
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: "0.2em",
    border: "1px solid",
    borderRadius: 2,
    display: "inline-block",
    padding: "2px 8px",
    marginTop: 2,
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: "clamp(40px, 8vw, 56px)",
  },
  footerLine: {
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
    marginBottom: 20,
  },
  footerText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: "clamp(13px, 3vw, 15px)",
    color: "#c9a84c",
    opacity: 0.45,
    letterSpacing: "0.05em",
  },
};
