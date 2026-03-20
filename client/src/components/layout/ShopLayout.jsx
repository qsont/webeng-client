import { Outlet } from "react-router-dom";
import Navigation from "@/components/custom/Navigation";

function ShopLayout() {

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Outlet />
      </section>
    </main>
  );
}

export default ShopLayout;