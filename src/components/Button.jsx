import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-black",
    textColor = "text-white",
    className = "",
    borderColor = "border-white", // Add a new prop for border color
    borderWidth = "border-2", // Add a new prop for border width
    shadowColor = "shadow-glow", // Add a new prop for shadow color
    ...props
}) {
    return (
        <button
            className={`px-4 py-2 rounded-lg hover:text-black hover:bg-white font-bold ${bgColor} ${textColor} ${borderWidth} ${borderColor} ${shadowColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
