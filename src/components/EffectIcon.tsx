import { Moon, Zap, Lightbulb, Focus, TrendingUp, Cloud } from "lucide-react";
import { Effect } from "@/data/products";

interface EffectIconProps {
  effect: Effect;
}

const effectIconMap = {
  Relaxing: Moon,
  Energizing: Zap,
  Creative: Lightbulb,
  Focused: Focus,
  Uplifting: TrendingUp,
  Sleepy: Cloud,
};

export const EffectIcon = ({ effect }: EffectIconProps) => {
  const Icon = effectIconMap[effect];
  
  return (
    <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-2 border border-accent/30">
      <Icon className="h-4 w-4 text-accent" />
      <span className="text-sm font-medium">{effect}</span>
    </div>
  );
};
