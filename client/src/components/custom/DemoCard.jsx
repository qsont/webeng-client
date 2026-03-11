import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function DemoCard({ product, className }) {
  return (
    <a
      href={product.href ?? "#"}
      className={cn("group ui-demo-card", className)}>
      <div className="ui-demo-card-fill" />

      <div className="ui-demo-card-content">
        <img
          className="ui-demo-card-image"
          src={product.img}
          alt={product.name}
        />
        <h2 className="text-xl text-center font-bold">{product.name}</h2>
        <div className="h-full">
          <Button
            asChild
            className="ui-demo-card-button bg-brand-violet-600">
            <span>Buy now!</span>
          </Button>
        </div>
      </div>
    </a>
  );
}

export default DemoCard;