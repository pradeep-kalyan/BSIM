"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import Mandatory from "@/app/ui/MandatoryIcon";

interface CustomInputProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  isNumeric?: boolean;
  isCurrency?: boolean;
  isText?: boolean;
  isTextarea?: boolean;
  isPercentage?: boolean;
  isRating?: boolean;
  currencySymbol?: string;
  rows?: number;
  readOnly?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  max,
  isNumeric,
  isCurrency,
  isText,
  isTextarea,
  isPercentage,
  isRating,
  currencySymbol = "₹",
  rows = 3,
  readOnly = false,
}) => {
  const commonProps = {
    placeholder,
    required,
    readOnly,
    className:
      "w-full p-2 rounded border " +
      (readOnly
        ? "bg-slate-700 text-white opacity-60 cursor-not-allowed border-slate-600 "
        : "bg-slate-900 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 selection:bg-blue-500 selection:text-white"),
  };

  if (isCurrency) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <NumericFormat
          value={value}
          thousandSeparator=","
          prefix={currencySymbol}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(vals) =>
            vals.floatValue === undefined ||
            ((min === undefined || vals.floatValue >= min) &&
              (max === undefined || vals.floatValue <= max))
          }
          onValueChange={(vals) => !readOnly && onChange(vals.floatValue || 0)}
          customInput={Input}
          {...commonProps}
        />
      </div>
    );
  }

  if (isPercentage) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <NumericFormat
          value={value}
          suffix="%"
          allowNegative={false}
          decimalScale={0}
          isAllowed={(vals) => {
            const v = vals.floatValue;
            return v === undefined || (v >= (min ?? 0) && v <= (max ?? 100));
          }}
          onValueChange={(vals) => !readOnly && onChange(vals.floatValue || 0)}
          customInput={Input}
          {...commonProps}
        />
      </div>
    );
  }

  if (isRating) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <NumericFormat
          value={value}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(vals) => {
            const v = vals.floatValue;
            return v === undefined || (v >= (min ?? 1) && v <= (max ?? 5));
          }}
          onValueChange={(vals) => !readOnly && onChange(vals.floatValue || 0)}
          customInput={Input}
          {...commonProps}
        />
      </div>
    );
  }

  if (isNumeric) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <NumericFormat
          value={value}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(vals) => {
            const v = vals.floatValue;
            return (
              v === undefined ||
              (v >= (min ?? 0) && (max === undefined || v <= max))
            );
          }}
          onValueChange={(vals) => !readOnly && onChange(vals.floatValue || 0)}
          customInput={Input}
          {...commonProps}
        />
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <textarea
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          rows={rows}
          {...commonProps}
        />
      </div>
    );
  }

  if (isText) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-300">
          {label} {required && <Mandatory />}
        </label>
        <Input
          type="text"
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          {...commonProps}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">
        {label} {required && <Mandatory />}
      </label>
      <Input
        type="text"
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        {...commonProps}
      />
    </div>
  );
};
