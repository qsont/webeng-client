function Story() {
  return (<section className="flex flex-col items-center p-4 sm:p-6 lg:p-10 w-full bg-linear-to-r from-brand-violet-50 to-transparent">
    <h3 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center text-brand-violet-900">Our Story</h3>

    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-5xl w-full">
      {/* Image Placeholder */}
      <div className="w-40 sm:w-48 md:w-56 h-56 sm:h-64 md:h-72 bg-linear-to-br from-brand-violet-200 to-brand-accent-200 rounded-lg shadow-lg flex items-center justify-center border-2 border-brand-violet-300 flex-shrink-0">
        <div className="text-center">
          <svg className="w-16 h-16 text-brand-violet-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0-2C6.5 0 2 4.5 2 10s4.5 10 10 10 10-4.5 10-10S17.5 0 12 0z"/>
          </svg>
          <p className="text-xs text-brand-violet-600 font-medium">Story Image</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 text-center md:text-left flex-1">
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4">
          From humble beginnings, Graham has been dedicated to crafting the finest ice cream bars. Every product is made with premium ingredients and love, bringing joy to families across the region.
        </p>
        <p className="text-sm sm:text-base text-gray-600 italic">
          "Quality is not just a promise—it's our commitment to you."
        </p>
      </div>
    </div>
  </section>);
}

export default Story;