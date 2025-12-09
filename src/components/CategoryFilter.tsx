import { Button } from "@/components/ui/button";
import { Category } from "@/data/products";
import { Leaf, Sun, Blend, Package } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: Category | "All";
  onCategoryChange: (category: Category | "All") => void;
}

const categories: { value: Category | "All"; label: string; icon: React.ReactNode }[] = [
  { value: "All", label: "All", icon: null },
  { value: "Indica", label: "Indica", icon: <Leaf className="h-4 w-4" /> },
  { value: "Sativa", label: "Sativa", icon: <Sun className="h-4 w-4" /> },
  { value: "Hybrid", label: "Hybrid", icon: <Blend className="h-4 w-4" /> },
  { value: "Accessories", label: "Accessories", icon: <Package className="h-4 w-4" /> },
];

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "premium" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          {category.icon}
          {category.label}
        </Button>
      ))}
    </div>
  );
};
