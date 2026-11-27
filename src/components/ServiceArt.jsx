// Unique, lightweight artwork for every service. It is drawn as inline SVG
// from the service slug, so each service always gets its own colours and
// composition, with no image file to download and no layout shift.

const PALETTES = [
  ["#1769f5", "#6254d8", "#12b8d4"],
  ["#12b8d4", "#1769f5", "#6254d8"],
  ["#6254d8", "#c026d3", "#1769f5"],
  ["#0f7a47", "#12b8d4", "#1769f5"],
  ["#f59e0b", "#ef4444", "#6254d8"],
  ["#0b1535", "#1769f5", "#12b8d4"],
  ["#db2777", "#6254d8", "#12b8d4"],
  ["#0d9488", "#1769f5", "#a3e635"],
];

function hash(text) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value) => Math.round(value * 10) / 10;

function Shapes({ variant, rand, colors }) {
  const [c1, c2, c3] = colors;

  if (variant === 0) {
    return (
      <>
        {Array.from({ length: 5 }, (_, index) => (
          <circle
            key={index}
            cx={round(rand() * 800)}
            cy={round(rand() * 600)}
            r={round(70 + rand() * 140)}
            fill={index % 2 ? c3 : c2}
            opacity={round(0.22 + rand() * 0.25)}
          />
        ))}
        {Array.from({ length: 2 }, (_, index) => (
          <circle
            key={`ring-${index}`}
            cx={round(150 + rand() * 500)}
            cy={round(100 + rand() * 400)}
            r={round(110 + rand() * 90)}
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity="0.28"
          />
        ))}
      </>
    );
  }

  if (variant === 1) {
    return (
      <>
        <circle cx="640" cy="140" r="78" fill={c3} opacity="0.55" />
        {Array.from({ length: 9 }, (_, index) => {
          const height = round(130 + rand() * 270);
          return (
            <rect
              key={index}
              x={40 + index * 82}
              y={600 - height}
              width="54"
              height={height}
              rx="27"
              fill={index % 2 ? c2 : "#fff"}
              opacity={index % 2 ? 0.45 : 0.2}
            />
          );
        })}
      </>
    );
  }

  if (variant === 2) {
    return (
      <>
        {Array.from({ length: 3 }, (_, index) => (
          <rect
            key={`stripe-${index}`}
            x="-200"
            y={round(80 + index * 190 + rand() * 40)}
            width="1200"
            height="46"
            fill={index % 2 ? c2 : c3}
            opacity="0.3"
            transform="rotate(-24 400 300)"
          />
        ))}
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 12 }, (_, column) => (
            <circle
              key={`${row}-${column}`}
              cx={46 + column * 64}
              cy={46 + row * 64}
              r="3.5"
              fill="#fff"
              opacity="0.32"
            />
          )),
        )}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: 4 }, (_, index) => {
        const y = round(230 + index * 80 + rand() * 30);
        return (
          <path
            key={index}
            d={`M0 ${y} C 200 ${round(y - 90)}, 400 ${round(y + 90)}, 800 ${round(y - 20)} L800 600 L0 600 Z`}
            fill={index % 2 ? c2 : c3}
            opacity={round(0.22 + index * 0.08)}
          />
        );
      })}
      <circle cx="150" cy="130" r="64" fill={c1} opacity="0.4" />
    </>
  );
}

export default function ServiceArt({ slug = "service", icon, category }) {
  const seed = hash(slug);
  const rand = seededRandom(seed);
  const colors = PALETTES[seed % PALETTES.length];
  const variant = (seed >>> 8) % 4;
  const angle = (seed >>> 12) % 90;
  const gradientId = `service-art-${seed.toString(36)}`;
  const label = (category || "").toUpperCase().slice(0, 24);

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="size-full"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientTransform={`rotate(${angle} 0.5 0.5)`}
        >
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#${gradientId})`} />
      <Shapes variant={variant} rand={rand} colors={colors} />
      <rect
        x="220"
        y="150"
        width="360"
        height="300"
        rx="40"
        fill="#fff"
        opacity="0.16"
        stroke="#fff"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
      <text
        x="400"
        y="300"
        textAnchor="middle"
        fontSize="120"
        fontFamily="system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"
      >
        {icon || "✦"}
      </text>
      {label && (
        <>
          <rect
            x="250"
            y="352"
            width="300"
            height="44"
            rx="22"
            fill="#000"
            opacity="0.38"
          />
          <text
            x="400"
            y="381"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            letterSpacing="2.5"
            fill="#fff"
            fontFamily="system-ui, sans-serif"
          >
            {label}
          </text>
        </>
      )}
    </svg>
  );
}
