"use client";

import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right";
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      size = "md",
      closeOnBackdrop = true,
      closeOnEscape = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
          onClose();
        }
      },
      [closeOnBackdrop, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const modalContent = (
      <div
        className="fixed inset-0 z-[1040] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={ref}
          className={`
            relative w-full ${sizeStyles[size]}
            bg-white dark:bg-gray-800
            rounded-xl shadow-xl
            animate-scaleIn
            max-h-[90vh] flex flex-col
            ${className}
          `}
          {...props}
        >
          {children}
        </div>
      </div>
    );

    if (typeof window === "undefined") return null;
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ title, description, onClose, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}
        {...props}
      >
        {(title || description) ? (
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        ) : children}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-2 -m-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ align = "right", className = "", children, ...props }, ref) => {
    const alignStyles = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3 p-6
          border-t border-gray-200 dark:border-gray-700
          ${alignStyles[align]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export { Modal, ModalHeader, ModalContent, ModalFooter };
export default Modal;
