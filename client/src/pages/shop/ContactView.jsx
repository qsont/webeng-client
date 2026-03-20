import { Mail, MapPin, Phone, Store } from "lucide-react";

const CONTACT_ITEMS = [
  { icon: Phone, label: "Phone", value: "+63 900 123 4567" },
  { icon: Mail, label: "Email", value: "support@webengshop.com" },
  { icon: MapPin, label: "Address", value: "123 Market Avenue, Quezon City" },
  { icon: Store, label: "Store Hours", value: "Mon - Sat, 9:00 AM to 8:00 PM" },
];

function ContactView() {
  return (
    <section className="space-y-6">
      <header className="rounded-xl border bg-linear-to-br from-brand-violet-700 to-brand-violet-500 p-6 text-white sm:p-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-sm text-white/85">We’re happy to help with orders, product info, and custom requests.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTACT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-brand-violet-100 p-2 text-brand-violet-700">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-violet-700">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm leading-7 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer faucibus mi at felis rutrum, non cursus
          dolor iaculis. Praesent non ex vitae lectus efficitur lacinia. Phasellus volutpat orci et arcu posuere,
          vitae ultricies tortor tincidunt. Ut volutpat interdum justo, ac volutpat est feugiat et. Suspendisse
          interdum magna ut lacus pellentesque, ac faucibus risus bibendum. Cras quis pretium purus. Mauris gravida
          nisl nec velit aliquet tempus.
        </p>
      </div>
    </section>
  );
}

export default ContactView;