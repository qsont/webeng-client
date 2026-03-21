import DemoCard from "../custom/DemoCard";
import landingImages from "@/config/landingImages.json";

const products = [
  {
    name: 'Plain',
    img: null,
    flavor: "cookies",
  },
  {
    name: 'Mango',
    img: null,
    flavor: "mango",
  },
  {
    name: 'Cookies & Cream',
    img: null,
    flavor: "cookies",
  },
  {
    name: 'Milo',
    img: null,
    flavor: "milo",
    featured: true,
  },
];

function Demo() {
  const productsWithImages = products.map((product) => ({
    ...product,
    img: landingImages?.demoImages?.[product.name]?.trim() || null,
  }));

  return (<section className="m-2 flex w-full flex-col items-center bg-background p-4 sm:m-4 sm:p-6 lg:m-6 lg:p-8">

    <div className="max-w-6xl w-full">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold my-4 sm:my-6 lg:my-8 text-center text-brand-violet-900">The Best in Town</h1>
      <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">Discover our signature flavors, each carefully crafted to bring you the perfect taste experience.</p>
    </div>

    <div className="flex w-full flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-6xl">
      {productsWithImages.map((product) => (
        <DemoCard key={product.name} className="w-full md:flex-1 md:basis-0" product={product}/>
      ))}
    </div>
  </section>);
}

export default Demo;