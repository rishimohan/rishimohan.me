import clsx from "clsx";
import { Check, X } from "phosphor-react";
import * as RadixSwitch from "@radix-ui/react-switch";

const Switch = ({
  label,
  info,
  value,
  onChange,
  labelClass,
  disabled,
} = {}) => (
  <div className="flex items-center gap-2">
    <RadixSwitch.Root
      checked={value || false}
      onCheckedChange={onChange}
      className={clsx(
        "w-[40px] dark:bg-gray-800 dark:border-gray-700 rounded-full border border-gray-300 h-[24px] p-[3px] group",
        value === false
          ? "bg-gray-200 dark:bg-gray-700"
          : "bg-white dark:bg-gray-800"
      )}
    >
      <RadixSwitch.Thumb
        className={clsx(
          " rounded-full bg-gradient-to-br from-gray-500 to-gray-800 ring-1 ring-gray-800 dark:from-gray-200 dark:to-gray-400 dark:ring-gray-200 h-full group-hover:scale-[0.9] aspect-square flex duration-[100ms] ease-in-out items-center justify-center",
          value === false ? "opacity-40" : "translate-x-[100%] bg-white"
        )}
      >
        {value === false ? (
          <X size={12} className="text-white dark:text-black" weight="bold" />
        ) : (
          <Check
            size={12}
            className="text-white dark:text-black"
            weight="bold"
          />
        )}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
    <div className="ml-2">
      {label && (
        <h4
          className={clsx(
            "text-sm font-semibold dark:text-gray-200",
            labelClass
          )}
        >
          {label}
        </h4>
      )}
      {info && (
        <p className="leading-tight font-normal text-gray-500 dark:text-gray-400">
          {info}
        </p>
      )}
    </div>
  </div>
);

export default Switch;
