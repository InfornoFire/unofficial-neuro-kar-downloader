import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface Props {
  compressionLevel: number;
  onChange: (level: number) => void;
}

export function ArchiveOptionsPopover({ compressionLevel, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Archive options">
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-5" align="start">
        <p className="text-sm font-medium">Archive options</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Compression level</Label>
            <span className="text-sm tabular-nums text-muted-foreground">
              {compressionLevel === 0
                ? `${compressionLevel} (store)`
                : compressionLevel === 9
                  ? `${compressionLevel} (max)`
                  : compressionLevel}
            </span>
          </div>
          <Slider
            min={0}
            max={9}
            step={1}
            value={[compressionLevel]}
            onValueChange={([v]) => onChange(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Faster</span>
            <span>Smaller</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
