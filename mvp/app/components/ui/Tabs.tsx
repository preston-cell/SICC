"use client";

import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pills" | "boxed";
  fullWidth?: boolean;
}

interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  variant?: "underline" | "pills" | "boxed";
  fullWidth?: boolean;
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabId: string;
}

const variantStyles = {
  underline: {
    list: "border-b border-gray-200 dark:border-gray-700",
    tab: "px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent -mb-px transition-colors",
    active: "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400",
    disabled: "opacity-50 cursor-not-allowed",
  },
  pills: {
    list: "bg-gray-100 dark:bg-gray-800 p-1 rounded-lg",
    tab: "px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md transition-all",
    active: "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm",
    disabled: "opacity-50 cursor-not-allowed",
  },
  boxed: {
    list: "border border-gray-200 dark:border-gray-700 rounded-lg p-1",
    tab: "px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md transition-all",
    active: "bg-blue-600 text-white",
    disabled: "opacity-50 cursor-not-allowed",
  },
};

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTab,
      activeTab: controlledActiveTab,
      onChange,
      variant = "underline",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
      defaultTab || tabs[0]?.id || ""
    );

    const isControlled = controlledActiveTab !== undefined;
    const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

    const setActiveTab = useCallback(
      (tabId: string) => {
        if (!isControlled) {
          setInternalActiveTab(tabId);
        }
        onChange?.(tabId);
      },
      [isControlled, onChange]
    );

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={className} {...props}>
          <TabList tabs={tabs} variant={variant} fullWidth={fullWidth} />
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ tabs, variant = "underline", fullWidth = false, className = "", ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="tablist"
        className={`flex ${fullWidth ? "" : "inline-flex"} ${styles.list} ${className}`}
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={`
              flex items-center justify-center gap-2
              ${fullWidth ? "flex-1" : ""}
              ${styles.tab}
              ${activeTab === tab.id ? styles.active : ""}
              ${tab.disabled ? styles.disabled : ""}
            `}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
);

TabList.displayName = "TabList";

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, className = "", children, ...props }, ref) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== tabId) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${tabId}`}
        aria-labelledby={tabId}
        tabIndex={0}
        className={`mt-4 animate-fadeIn ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = "TabPanel";

export { Tabs, TabList, TabPanel };
export default Tabs;
