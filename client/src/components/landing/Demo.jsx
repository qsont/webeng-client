import DemoCard from "../custom/DemoCard";

const products = [
  {
    name: 'Plain',
    img: null,
  },
  {
    name: 'Mango',
    img: null,
  },
  {
    name: 'Cookies & Cream',
    img: null,
  },
  {
    name: 'Milo',
    img: null,
  },
];

function Demo() {
  return (<section className="flex flex-col items-center bg-white p-4 sm:p-6 lg:p-8 m-2 sm:m-4 lg:m-6 w-full">

    <div className="max-w-6xl w-full">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold my-4 sm:my-6 lg:my-8 text-center text-brand-violet-900">The Best in Town</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Discover our signature flavors, each carefully crafted to bring you the perfect taste experience.</p>
    </div>

    <div className="flex w-full flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-6xl">
      {products.map((product) => (
        <DemoCard key={product.name} className="w-full md:flex-1 md:basis-0" product={product}/>
      ))}
    </div>
  </section>);
}

export default Demo;