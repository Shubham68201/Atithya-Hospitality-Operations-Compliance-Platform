export default function PageLoader() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="font-cinzel text-4xl text-gold tracking-[6px] mb-2">ATITHYA</h1>
        <p className="text-[#9BB0C9] text-xs tracking-widest uppercase">Loading...</p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
