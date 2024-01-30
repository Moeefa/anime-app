"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { background?: string }
>(({ className, tabIndex, background = "bg-primary", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-[20px] data-[orientation=vertical]:h-[100px] group",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      tabIndex={tabIndex}
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20 group-data-[orientation=vertical]:w-1.5"
    >
      <SliderPrimitive.Range
        tabIndex={tabIndex}
        className={`${background} absolute h-full group-data-[orientation=vertical]:w-full`}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      tabIndex={tabIndex}
      className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
