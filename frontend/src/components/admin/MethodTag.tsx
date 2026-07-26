import { Smartphone } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MethodTag({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold",
        method === "M-Pesa"
          ? "bg-fern/15 text-forest"
          : method === "Bank"
            ? "bg-pine/10 text-pine"
            : "bg-ink/6 text-ink/60",
      )}>
      {method === "M-Pesa" && <Smartphone className="h-3 w-3" />} {method}
    </span>
  );
}

export default MethodTag;