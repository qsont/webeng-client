import useAuthentication from "@/hooks/useAuthentication";
import { Outlet, Navigate } from "react-router-dom";

function AuthLayout() {

const { isChecking, path } = useAuthentication();

  if (isChecking) return null;
  if (path) return <Navigate to={path} replace />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-flavor-mango/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-brand-violet-500/25 blur-3xl" />

      <section className="relative mx-auto grid min-h-[85vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/70 shadow-float backdrop-blur-md lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-linear-to-br from-brand-violet-600 via-brand-violet-500 to-brand-violet-700 p-10 text-white lg:flex">
          <div>
            <h1 className="text-4xl font-black leading-tight">Graham Ice Cream Bars</h1>
            <p className="mt-4 max-w-sm text-sm text-white/90">
              A playful and creamy shopping experience for your favorite local flavors.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm shadow-soft backdrop-blur-sm">
            <p className="font-semibold">Flavor Notes</p>
            <p className="mt-2 text-white/90">Mango • Milo • Cookies & Cream</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;