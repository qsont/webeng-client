function Story() {
  return (<section className="flex flex-col items-center p-10 w-full">
    <h3 className="text-6xl font-bold mb-10">Our Story</h3>

    <div className="flex justify-between items-center">
      <img 
      className="w-[200px]: object-cover"
      src="./src/assets/story.jpg" 
      alt="Graham ice cream bar making" />

      <div className="p-6">
        <p>From humble beginnings, our product keeps finding ways to expand across the local scene. Find out more below.</p>
      </div>
    </div>
  </section>);
}

export default Story;