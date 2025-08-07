"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TooltipWrapper } from "@/components/ui/tooltip"; // adjust path as needed

interface CustomSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: string;
  min?: number;
  max?: number;
  onValueChange?: (val: number[]) => void;
  tooltipText?: string;
}

function Slider({
  className,
  tooltipText,
  defaultValue,
  value,
  min: initialMin = 0,
  max: initialMax = 100,
  onValueChange,
  label,
  ...props
}: CustomSliderProps) {
  const [min, setMin] = React.useState(initialMin);
  const [max, setMax] = React.useState(initialMax);

  const [_value, setValue] = React.useState<number[]>(
    Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]
  );

  const handleChange = (val: number[]) => {
    setValue(val);
    onValueChange?.(val);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newVal = [..._value];
    const num = Number(e.target.value);
    newVal[index] = num;

    if (num > max) setMax(num * 2);
    if (num < min) setMin(num);

    handleChange(newVal);
  };

  return (
    <div className="flex flex-col w-full gap-3 text-white">
      {label && tooltipText && (
        <TooltipWrapper label={label} text={tooltipText ?? ""} />
      )}
      {label && !tooltipText && <Label>{label}</Label>}
      {!label && tooltipText && (
        <TooltipWrapper label={label ?? ""} text={tooltipText} />
      )}

      <div className="flex items-center gap-4 w-full">
        <div className="flex flex-col gap-1">
          <SliderPrimitive.Root
            value={value ?? _value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            onValueChange={handleChange}
            className={cn(
              "relative flex w-[300px] touch-none select-none items-center",
              className
            )}
            {...props}
          >
            <SliderPrimitive.Track className="bg-gray-700 relative h-1.5 w-full rounded-full">
              <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
            </SliderPrimitive.Track>

            {_value.map((val, index) => (
              <SliderPrimitive.Thumb
                key={index}
                className="group relative block size-4 shrink-0 rounded-full border border-blue-500 bg-gray-100 shadow transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform hidden group-hover:flex flex-col items-center">
                  <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white">
                    {val}
                  </div>
                  <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                </div>
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>

          <div className="flex justify-between text-xs text-gray-400 px-1 w-full">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>

        <div className="flex gap-2 w-32">
          {_value.map((val, index) => (
            <Input
              key={index}
              type="text"
              value={val}
              onChange={(e) => handleInputChange(e, index)}
              min={min}
              max={max}
              className="h-8 text-white bg-gray-900 border-gray-700 focus-visible:ring-blue-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Slider };
