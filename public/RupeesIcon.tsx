function RupeesIcon() {
  return (
    <svg
      viewBox="0 0 55 24"
      width="32"
      height="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#25A7DA" />
        </linearGradient>
      </defs>

      <text
        x="2"
        y="19"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="url(#rsGradient)"
        letterSpacing="-1"
      >
        Rs
      </text>
    </svg>
  );
}

export default RupeesIcon;
