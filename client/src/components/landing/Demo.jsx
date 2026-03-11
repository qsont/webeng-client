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
  return (<section className="flex flex-col items-center bg-white p-6 m-6">


    <h1 className="text-6xl font-bold my-6">The Best in Town</h1>

    <div className="flex w-full flex-col md:flex-row gap-4">
      {products.map((product) => (
        <DemoCard className="w-full md:flex-1 md:basis-0" product={product}/>  
      ))}
    </div>
  </section>);
}

export default Demo;