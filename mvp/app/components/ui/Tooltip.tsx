"use client";

import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      position = "top",
      delay = 200,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const calculatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top + scrollY - tooltipRect.height - 8;
          left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + scrollY + 8;
          left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left + scrollX - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + scrollX + 8;
          break;
      }

      // Keep tooltip within viewport
      const padding = 8;
      const maxLeft = window.innerWidth + scrollX - tooltipRect.width - padding;
      const maxTop = window.innerHeight + scrollY - tooltipRect.height - padding;

      left = Math.max(padding, Math.min(left, maxLeft));
      top = Math.max(padding, Math.min(top, maxTop));

      setCoords({ top, left });
    };

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    useEffect(() => {
      if (isVisible) {
        // Small delay to ensure tooltip is rendered before calculating position
        requestAnimationFrame(calculatePosition);
      }
    }, [isVisible, position]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const arrowStyles: Record<TooltipPosition, string> = {
      top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700",
      bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700",
      left: "right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700",
      right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700",
    };

    return (
      <>
        <div
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          className={`inline-block ${className}`}
          {...props}
        >
          {children}
        </div>

        {isVisible &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              ref={tooltipRef}
              role="tooltip"
              className="fixed z-[1070] animate-fadeIn"
              style={{ top: coords.top, left: coords.left }}
            >
              <div className="relative px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg max-w-xs">
                {content}
                <div
                  className={`absolute w-0 h-0 border-4 ${arrowStyles[position]}`}
                />
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
