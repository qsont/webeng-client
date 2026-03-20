function Banner() {
  return (
    <section className="relative isolate mb-16 flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-x-clip overflow-y-visible bg-linear-to-br from-brand-accent-50 via-brand-accent-100 to-brand-accent-200 px-4 before:absolute before:bottom-0 before:left-1/2 before:h-44 before:w-[150%] before:-translate-x-1/2 before:translate-y-1/2 before:rounded-[100%] before:bg-brand-accent-200 before:content-[''] before:z-0 dark:from-brand-violet-900 dark:via-brand-violet-800 dark:to-brand-violet-900 dark:before:bg-brand-violet-800 md:flex-row md:justify-around md:gap-0 sm:px-6 lg:px-8">
      <div className="z-10 pt-8 md:pt-16 text-center md:text-left">
        <h1 className="font-black text-4xl leading-tight text-brand-accent-900 dark:text-brand-violet-50 sm:text-5xl md:text-6xl lg:text-7xl">
          Meet the Graham
        </h1>
        <p className="mt-4 max-w-lg text-base text-brand-accent-700 dark:text-brand-violet-100 sm:text-lg md:text-xl">
          Experience the perfect blend of taste and quality. Premium ice cream bars crafted with love.
        </p>
        <button className="mt-6 px-8 py-3 bg-brand-accent-600 hover:bg-brand-accent-700 text-white rounded-full font-semibold transition-colors">
          Shop Now
        </button>
      </div>

      {/* Graphic Placeholder */}
      <div className="z-10 pt-8 md:pt-16">
        <div className="flex h-80 w-64 items-center justify-center rounded-2xl border-2 border-brand-accent-300 bg-card p-2 shadow-float dark:border-brand-violet-500/50">
          <div className="text-center">
            <div className="flex h-64 w-48 items-center justify-center rounded-2xl bg-linear-to-b from-brand-accent-300 to-brand-accent-100">
              <svg className="w-32 h-32 text-brand-accent-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <p className="text-xs text-brand-accent-600 mt-4">Product Image</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;