import landingImages from "@/config/landingImages.json";

function Story() {
  const storyImageUrl = landingImages?.story?.image?.trim();
  const storyImageAlt = landingImages?.story?.imageAlt || "Our story";

  return (<section className="flex w-full flex-col items-center bg-linear-to-r from-brand-violet-50 to-transparent p-4 dark:from-brand-violet-900/30 sm:p-6 lg:p-10">
    <h3 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center text-brand-violet-900">Our Story</h3>

    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-5xl w-full">
      {/* Image Placeholder */}
      {storyImageUrl ? (
        <img
          src={storyImageUrl}
          alt={storyImageAlt}
          className="h-56 w-40 shrink-0 rounded-2xl border-2 border-brand-violet-300 object-cover shadow-soft sm:h-64 sm:w-48 md:h-72 md:w-56"
        />
      ) : (
        <div className="flex h-56 w-40 shrink-0 items-center justify-center rounded-2xl border-2 border-brand-violet-300 bg-linear-to-br from-brand-violet-200 to-brand-accent-200 shadow-soft sm:h-64 sm:w-48 md:h-72 md:w-56">
          <div className="text-center">
            <svg className="w-16 h-16 text-brand-violet-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0-2C6.5 0 2 4.5 2 10s4.5 10 10 10 10-4.5 10-10S17.5 0 12 0z"/>
            </svg>
            <p className="text-xs text-brand-violet-600 font-medium">Story Image</p>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 text-center md:text-left flex-1">
        <p className="mb-4 text-sm leading-relaxed text-foreground sm:text-base lg:text-lg">
          From humble beginnings, Graham has been dedicated to crafting the finest ice cream bars. Every product is made with premium ingredients and love, bringing joy to families across the region.
        </p>
        <p className="text-sm italic text-muted-foreground sm:text-base">
          "Quality is not just a promise—it's our commitment to you."
        </p>
      </div>
    </div>
  </section>);
}

export default Story;