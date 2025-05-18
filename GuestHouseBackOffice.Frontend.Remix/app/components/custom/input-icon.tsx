import * as React from "react"

import {cn} from "~/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const InputIcon = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, startIcon, endIcon, ...props}, ref) => {
        return (
            <div className="w-full relative">
                {startIcon && (
                    <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
                        {startIcon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {endIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {endIcon}
                    </div>
                )}
            </div>
        )
    }
)
InputIcon.displayName = "Input"

export {InputIcon}
