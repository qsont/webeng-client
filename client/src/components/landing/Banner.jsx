function Banner() {
  return (
    <section className="relative isolate overflow-x-clip overflow-y-visible flex flex-col md:flex-row items-center justify-center md:justify-around px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-linear-to-br from-brand-accent-50 via-brand-accent-100 to-brand-accent-200 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:w-[150%] before:h-44 before:bg-brand-accent-200 before:rounded-[100%] before:z-0 mb-16 gap-6 md:gap-0">
      <div className="z-10 pt-8 md:pt-16 text-center md:text-left">
        <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-accent-900 leading-tight">
          Meet the Graham
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-brand-accent-700 mt-4 max-w-lg">
          Experience the perfect blend of taste and quality. Premium ice cream bars crafted with love.
        </p>
        <button className="mt-6 px-8 py-3 bg-brand-accent-600 hover:bg-brand-accent-700 text-white rounded-full font-semibold transition-colors">
          Shop Now
        </button>
      </div>

      {/* Graphic Placeholder */}
      <div className="z-10 pt-8 md:pt-16">
        <div className="w-64 h-80 bg-white rounded-lg shadow-2xl flex items-center justify-center border-2 border-brand-accent-300">
          <div className="text-center">
            <div className="w-48 h-64 bg-linear-to-b from-brand-accent-300 to-brand-accent-100 rounded-lg flex items-center justify-center">
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