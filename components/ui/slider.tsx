import React from "react";
import { Input } from "./input";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { TooltipWrapper } from "./tooltip";
import { Label } from "recharts";
import { cn } from "@/app/lib/utils/utils";

interface CustomSliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "onValueChange" | "defaultValue"
  > {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (val: number) => void;
  tooltipText?: string;
  isPercentage?: boolean;
  isRating?: boolean;
  isFixed?: boolean;
  fixedMin?: number;
  fixedMax?: number;
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
  isPercentage = false,
  isRating = false,
  isFixed = false,
  fixedMin,
  fixedMax,
  ...props
}: CustomSliderProps) {
  const [min, setMin] = React.useState(
    isFixed
      ? fixedMin ?? (isRating ? 1 : isPercentage ? 0 : initialMin)
      : isRating
      ? 1
      : isPercentage
      ? 0
      : initialMin
  );

  const [max, setMax] = React.useState(
    isFixed
      ? fixedMax ?? (isRating ? 10 : isPercentage ? 100 : initialMax)
      : isRating
      ? 10
      : isPercentage
      ? 100
      : initialMax
  );

  const [_value, setValue] = React.useState<number>(
    typeof value === "number"
      ? value
      : typeof defaultValue === "number"
      ? defaultValue
      : min
  );

  const handleChange = (val: number) => {
    setValue(val);
    onValueChange?.(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);

    if (isFixed) {
      num = Math.max(displayMin, Math.min(displayMax, num));
    } else if (isPercentage) {
      num = Math.max(0, Math.min(100, num));
    } else if (isRating) {
      num = Math.max(1, Math.min(10, num));
    } else {
      if (num > max) setMax(num * 2);
      if (num < min) setMin(num);
    }

    handleChange(num);
  };

  const displayMin = isFixed
    ? fixedMin ?? (isRating ? 1 : isPercentage ? 0 : min)
    : isRating
    ? 1
    : isPercentage
    ? 0
    : min;

  const displayMax = isFixed
    ? fixedMax ?? (isRating ? 10 : isPercentage ? 100 : max)
    : isRating
    ? 10
    : isPercentage
    ? 100
    : max;

  return (
    <div className="flex flex-col w-full gap-2 text-white font-semibold font-geist-sans">
      {label && tooltipText && (
        <TooltipWrapper label={label} text={tooltipText ?? ""} />
      )}
      {label && !tooltipText && <Label>{label}</Label>}
      {!label && tooltipText && (
        <TooltipWrapper label={label ?? ""} text={tooltipText} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        {/* Slider */}
        <div className="flex flex-col flex-1 gap-2">
          <SliderPrimitive.Root
            value={[_value]} // radix still wants array internally
            min={displayMin}
            max={displayMax}
            onValueChange={(val) => {
              let v = val[0];
              if (isFixed) {
                v = Math.max(displayMin, Math.min(displayMax, v));
              }
              handleChange(v);
            }}
            className={cn(
              "relative flex w-full touch-none select-none items-center",
              className
            )}
            {...props}
          >
            <SliderPrimitive.Track className="bg-gray-700 relative h-1.5 w-full rounded-full">
              <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb className="group relative block size-4 shrink-0 rounded-full border border-blue-500 bg-gray-100 shadow transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform hidden group-hover:flex flex-col items-center">
                <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white">
                  {_value}
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
              </div>
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Root>

          <div className="flex justify-between text-xs text-gray-400 px-1 w-full">
            <span>{displayMin}</span>
            <span>{displayMax}</span>
          </div>
        </div>

        {/* Input box */}
        <div className="flex gap-2 sm:w-32 w-full">
          <Input
            type="number"
            value={_value}
            onChange={handleInputChange}
            min={displayMin}
            max={displayMax}
            className="h-8 text-white bg-gray-900 border-gray-700 focus-visible:ring-blue-500 w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export { Slider };
