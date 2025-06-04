"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";

interface CustomSliderProps {
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function CustomSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}: CustomSliderProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const getTooltipPosition = () => {
    if (!sliderRef.current) return "0px";
    const sliderWidth = sliderRef.current.offsetWidth;
    const percent = (value[0] - min) / (max - min);
    const offset = percent * sliderWidth;
    return `${offset - 20}px`; // adjust tooltip position
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="absolute -top-7 transition-opacity duration-200 text-xs bg-black text-white px-2 py-1 rounded opacity-0 pointer-events-none z-10"
        style={{
          left: getTooltipPosition(),
          opacity: isHovering ? 1 : 0,
        }}
      >
        {value[0]}
      </div>

      <div
        ref={sliderRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Slider
          value={value}
          onValueChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  );
}
