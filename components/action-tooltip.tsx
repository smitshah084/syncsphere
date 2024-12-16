"use client"; // Marks this as a client-side component in Next.js

// Import necessary tooltip components from shadcn/ui library
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

// Define the props interface for ActionTooltip component
interface ActionTooltipProps {
    label: string;      // Text to display in tooltip
    children: React.ReactNode;  // Element that triggers the tooltip
    side?: "top" | "right" | "bottom" | "left";  // Tooltip position
    align?: "start" | "center" | "end";  // Tooltip alignment
}

// Main ActionTooltip component that wraps elements with tooltip functionality
export const ActionTooltip = ({
    label,
    children,
    side,
    align
}: ActionTooltipProps) => {
    return (
        // TooltipProvider: Provides context for tooltip components
        <TooltipProvider>
            {/* Tooltip: Main wrapper with 50ms delay before showing */}
            <Tooltip delayDuration={50}>
                {/* TooltipTrigger: Wraps the element that will trigger tooltip */}
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>

                {/* TooltipContent: Actual tooltip content with positioning */}
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">
                        {label.toLowerCase()}
                        {/* // Convert label to lowercase and capitalize */}
                    </p>
                </TooltipContent>

            </Tooltip>
        </TooltipProvider>
    )
}
