function Banner() {
  return (
    <section className="relative isolate overflow-x-clip overflow-y-visible flex items-center justify-around px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-pink-300 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:w-[150%] before:h-44 before:bg-pink-300 before:rounded-[100%] before:z-0 mb-22">
      <div className="z-10 pt-16">
        <h2 className="font-black text-4xl md:text-6xl">Meet the Graham</h2>
      </div>

      {/* Graphic */}
      <div className="z-10 pt-16">
        <p>Insert static picture here</p>
      </div>
    </section>
  );
}

export default Banner;