import React from "react";
import { Input } from "./input";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { TooltipWrapper } from "./tooltip";
import { cn } from "@/app/lib/utils/utils";

interface CustomSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: string;
  min?: number;
  max?: number;
  onValueChange?: (val: number[]) => void;
  tooltipText?: string;
  isPercentage?: boolean;
  isRating?: boolean;
  isFixed?: boolean;
  fixedMin?: number;
  fixedMax?: number;
  required?: boolean;
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
  required = false, // ✅ Default to false
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

    newVal[index] = num;
    handleChange(newVal);
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
    <div className="flex flex-col w-full gap-3 text-white">
      {label && (
        <div className="flex items-center gap-1">
          {tooltipText ? (
            <TooltipWrapper label={label} text={tooltipText} />
          ) : (
            <span className="font-medium text-gray-200">{label}</span>
          )}
          {required && (
            <>
              <span className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 w-full">
        <div className="flex flex-col gap-1">
          <SliderPrimitive.Root
            value={value ?? _value}
            defaultValue={defaultValue}
            min={displayMin}
            max={displayMax}
            onValueChange={(val) => {
              if (isFixed) {
                val = val.map((v) =>
                  Math.max(displayMin, Math.min(displayMax, v))
                );
              }
              handleChange(val);
            }}
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
            <span>{displayMin}</span>
            <span>{displayMax}</span>
          </div>
        </div>

        <div className="flex gap-2 w-32">
          {_value.map((val, index) => (
            <Input
              key={index}
              type="number"
              value={val}
              onChange={(e) => handleInputChange(e, index)}
              min={displayMin}
              max={displayMax}
              className="h-8 text-white bg-gray-900 border-gray-700 focus-visible:ring-blue-500 selection:bg-blue-500 selection:text-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Slider };
