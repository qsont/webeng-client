import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

function DemoCard({ product, className }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const flavorStyles = {
    mango: {
      placeholder: "from-flavor-mango/70 to-flavor-mango/30",
      icon: "text-flavor-mango-foreground/70",
      button: "bg-flavor-mango text-flavor-mango-foreground hover:bg-flavor-mango/90",
    },
    milo: {
      placeholder: "from-flavor-milo/75 to-flavor-milo/35",
      icon: "text-flavor-milo-foreground/75",
      button: "bg-flavor-milo text-flavor-milo-foreground hover:bg-flavor-milo/90",
    },
    cookies: {
      placeholder: "from-flavor-cookies/75 to-flavor-cookies/35",
      icon: "text-flavor-cookies-foreground/70",
      button: "bg-flavor-cookies text-flavor-cookies-foreground hover:bg-flavor-cookies/90",
    },
  };

  const currentFlavor = flavorStyles[product?.flavor] ?? flavorStyles.cookies;

  const onAction = () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    navigate("/shop");
  };

  return (
    <article className={cn("group ui-demo-card transition-transform hover:scale-105", className)}>
      <div className="ui-demo-card-fill" />

      <div className="ui-demo-card-content">
        {product?.featured ? (
          <span className="inline-flex items-center rounded-full bg-flavor-milo-status px-3 py-1 text-xs font-semibold text-flavor-milo-status-foreground">
            Best Seller
          </span>
        ) : null}

        {/* Image Placeholder */}
        {product.img ? (
          <img
            className="ui-demo-card-image"
            src={product.img}
            alt={product.name}
          />
        ) : (
          <div className={cn("ui-demo-card-image bg-linear-to-b flex items-center justify-center", currentFlavor.placeholder)}>
            <svg className={cn("w-16 h-16", currentFlavor.icon)} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
            </svg>
          </div>
        )}
        <h2 className="text-center text-base font-bold text-foreground sm:text-lg lg:text-xl">{product.name}</h2>
        <div className="h-full">
          <Button
            type="button"
            onClick={onAction}
            className={cn("ui-demo-card-button text-xs transition-colors sm:text-sm", currentFlavor.button)}>
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

export default DemoCard;