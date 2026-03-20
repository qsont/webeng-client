function Story() {
  return (<section className="flex flex-col items-center p-4 sm:p-6 lg:p-10 w-full">
    <h3 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center">Our Story</h3>

    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-4xl">
      <img 
      className="w-40 sm:w-48 md:w-56 object-cover flex-shrink-0"
      src="./src/assets/story.jpg" 
      alt="Graham ice cream bar making" />

      <div className="p-4 sm:p-6 text-center md:text-left">
        <p className="text-sm sm:text-base">From humble beginnings, our product keeps finding ways to expand across the local scene. Find out more below.</p>
      </div>
    </div>
  </section>);
}

export default Story;