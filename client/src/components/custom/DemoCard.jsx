import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function DemoCard({ product, className }) {
  return (
    <a
      href={product.href ?? "#"}
      className={cn("group ui-demo-card transition-transform hover:scale-105", className)}>
      <div className="ui-demo-card-fill" />

      <div className="ui-demo-card-content">
        {/* Image Placeholder */}
        {product.img ? (
          <img
            className="ui-demo-card-image"
            src={product.img}
            alt={product.name}
          />
        ) : (
          <div className="ui-demo-card-image bg-linear-to-b from-brand-violet-300 to-brand-accent-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-brand-violet-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
            </svg>
          </div>
        )}
        <h2 className="text-base sm:text-lg lg:text-xl text-center font-bold text-gray-800">{product.name}</h2>
        <div className="h-full">
          <Button
            asChild
            className="ui-demo-card-button bg-brand-violet-600 hover:bg-brand-violet-700 text-xs sm:text-sm transition-colors">
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </a>
  );
}

export default DemoCard;