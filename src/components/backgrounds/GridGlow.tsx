// Create page background — grid with scanning light beam
export function GridGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.035 }}
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scanning glow beam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, rgba(167,139,250,0.06) 50%, transparent)',
          filter: 'blur(20px)',
          animation: 'gridGlow 6s ease-in-out infinite',
          top: '20%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.05) 50%, transparent)',
          filter: 'blur(15px)',
          animation: 'gridGlow 9s ease-in-out 3s infinite',
          top: '55%',
        }}
      />
    </div>
  );
}
