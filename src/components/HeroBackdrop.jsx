// Same hero background as the Services page: spore canvas + primary glow.
// Usage: put <HeroBackdrop /> inside a hero <section className="relative isolate overflow-hidden ...">
export default function HeroBackdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden"
      >
        <canvas
          className="heroSporeCanvas w-full opacity-70"
          width={2000}
          height={2000}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-20 size-160 -translate-x-1/2 -translate-y-1/2 blur-2xl xl:size-300"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 78%, transparent) 20%, transparent 70%)",
        }}
      />
    </>
  );
}
