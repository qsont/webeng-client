import DemoCard from "../custom/DemoCard";

const products = [
  {
    name: 'Plain',
    img: './src/assets/graham1.png',
  },
  {
    name: 'Mango',
    img: './src/assets/graham1.png',
  },
  {
    name: 'Cookies & Cream',
    img: './src/assets/graham1.png',
  },
  {
    name: 'Milo',
    img: './src/assets/graham1.png',
  },
];

function Demo() {
  return (<section className="flex flex-col items-center bg-white p-4 sm:p-6 lg:p-8 m-2 sm:m-4 lg:m-6">


    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold my-4 sm:my-6 lg:my-8 text-center">The Best in Town</h1>

    <div className="flex w-full flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <DemoCard className="w-full md:flex-1 md:basis-0" product={product}/>  
      ))}
    </div>
  </section>);
}

export default Demo;