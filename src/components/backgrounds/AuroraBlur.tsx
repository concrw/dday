// Detail page background — slow aurora blur blobs
export function AuroraBlur() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* blob 1 — violet */}
      <div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          top: '10%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora 18s ease-in-out infinite',
        }}
      />
      {/* blob 2 — indigo */}
      <div
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          top: '40%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora 24s ease-in-out 4s infinite reverse',
        }}
      />
      {/* blob 3 — cyan accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '60%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora 20s ease-in-out 8s infinite',
        }}
      />
    </div>
  );
}
