import React from "react";
import { NumericFormat } from "react-number-format";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { TooltipWrapper } from "./tooltip";
import { cn } from "@/app/lib/utils/utils";

interface CustomSliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "onValueChange" | "value"
  > {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  onValueChange?: (val: number) => void;
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
  required = false,
  ...props
}: CustomSliderProps) {
  // Setup min/max display values
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

  // 🔹 Sync with parent value changes
  React.useEffect(() => {
    if (typeof value === "number" && value !== _value) {
      setValue(value);
    }
  }, [value, _value]);

  const handleChange = (val: number) => {
    setValue(val);
    onValueChange?.(val);
  };

  const handleInputChange = (num: number | null) => {
    if (num === null) return;
    let newVal = num;

    if (isFixed) {
      newVal = Math.max(displayMin, Math.min(displayMax, newVal));
    } else if (isPercentage) {
      newVal = Math.max(0, Math.min(100, newVal));
    } else if (isRating) {
      newVal = Math.max(1, Math.min(10, newVal));
    } else {
      if (newVal > max) setMax(newVal * 2);
      if (newVal < min) setMin(newVal);
    }

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
    <div className="flex flex-col w-full gap-3 text-white font-semibold font-geist-sans">
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

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* Slider Section */}
        <div className="flex flex-col gap-1 flex-1 w-full">
          <SliderPrimitive.Root
            value={[_value]}
            min={displayMin}
            max={displayMax}
            step={1}
            onValueChange={(val) => {
              const singleVal = val[0];
              handleChange(
                isFixed
                  ? Math.max(displayMin, Math.min(displayMax, singleVal))
                  : singleVal
              );
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

        {/* Input Box */}
        <div className="w-full sm:w-24">
          <NumericFormat
            value={_value}
            thousandSeparator=","
            allowNegative={false}
            decimalScale={0}
            onValueChange={(vals) => handleInputChange(vals.floatValue ?? null)}
            className="h-8 w-full rounded-md border border-gray-700 bg-gray-900 px-2 text-white selection:bg-blue-500 selection:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export { Slider };
