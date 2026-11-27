import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-ph relative overflow-hidden text-center">
      <div className="relative container">
        <div className="row justify-center">
          <div className="sm:col-10 md:col-8 lg:col-6">
            <span className="text-primary block text-[8rem] font-bold">
              404
            </span>
            <h1 className="h2 mb-4">Page not found</h1>
            <div className="content">
              <p>
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
            </div>
            <Link href="/" className="btn btn-primary mt-8">
              Back to home
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 left-1/2 -z-20 size-160 -translate-x-1/2 -translate-y-1/2 blur-2xl xl:size-300"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 78%, transparent) 20%, transparent 70%)",
        }}
      />
    </section>
  );
}
