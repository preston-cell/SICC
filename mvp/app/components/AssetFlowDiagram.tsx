"use client";

import { useMemo, ReactNode } from "react";
import { AssetAllocation, BeneficiaryDistribution, COLORS } from "./EstateVisualization";

interface FlowNode {
  id: string;
  label: string;
  value: number;
  type: "asset" | "method" | "beneficiary";
  color: string;
  bypassesProbate?: boolean;
}

interface FlowLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

interface AssetFlowDiagramProps {
  assets: AssetAllocation[];
  beneficiaries: BeneficiaryDistribution[];
  totalValue: number;
}

// Asset type icons
const ASSET_ICONS: Record<string, ReactNode> = {
  real_estate: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  bank: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  investment: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  retirement: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  insurance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  business: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

// Transfer method colors
const METHOD_COLORS = {
  will: "#6366F1", // Indigo
  trust: "#8B5CF6", // Purple
  beneficiary_designation: "#10B981", // Green
  joint_ownership: "#06B6D4", // Cyan
};

const METHOD_LABELS = {
  will: "Will",
  trust: "Trust",
  beneficiary_designation: "Beneficiary Designation",
  joint_ownership: "Joint Ownership",
};

export function AssetFlowDiagram({ assets, beneficiaries, totalValue }: AssetFlowDiagramProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Group assets by transfer method
  const assetsByMethod = useMemo(() => {
    const grouped: Record<string, AssetAllocation[]> = {};
    for (const asset of assets) {
      if (!grouped[asset.transferMethod]) {
        grouped[asset.transferMethod] = [];
      }
      grouped[asset.transferMethod].push(asset);
    }
    return grouped;
  }, [assets]);

  // Calculate method totals
  const methodTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const [method, methodAssets] of Object.entries(assetsByMethod)) {
      totals[method] = methodAssets.reduce((sum, a) => sum + a.value, 0);
    }
    return totals;
  }, [assetsByMethod]);

  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>No asset data available to visualize</p>
        <p className="text-sm mt-1">Complete the assets section of your intake form</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Through Will (Probate)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Beneficiary Designation (No Probate)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Through Trust</span>
        </div>
      </div>

      {/* Three Column Flow */}
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        {/* Column 1: Assets */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
            Your Assets
          </h4>
          {assets.map((asset, index) => (
            <div
              key={index}
              className="relative p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  asset.bypassesProbate
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                }`}>
                  {ASSET_ICONS[asset.type] || ASSET_ICONS.bank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {asset.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(asset.value)}
                  </p>
                </div>
              </div>
              {/* Flow line indicator */}
              <div
                className={`absolute right-0 top-1/2 w-4 h-0.5 -mr-4 ${
                  asset.bypassesProbate ? "bg-green-400" : "bg-indigo-400"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Column 2: Transfer Methods */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
            How It Transfers
          </h4>
          {Object.entries(assetsByMethod).map(([method, methodAssets]) => {
            const methodTotal = methodTotals[method];
            const percentage = totalValue > 0 ? (methodTotal / totalValue) * 100 : 0;
            const bypassesProbate = method === "beneficiary_designation" || method === "joint_ownership" || method === "trust";

            return (
              <div
                key={method}
                className={`relative p-4 rounded-lg border-2 ${
                  bypassesProbate
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20"
                }`}
              >
                {/* Flow line indicators */}
                <div className={`absolute left-0 top-1/2 w-4 h-0.5 -ml-4 ${
                  bypassesProbate ? "bg-green-400" : "bg-indigo-400"
                }`}></div>
                <div className={`absolute right-0 top-1/2 w-4 h-0.5 -mr-4 ${
                  bypassesProbate ? "bg-green-400" : "bg-indigo-400"
                }`}></div>

                <div className="text-center">
                  <p className={`font-semibold text-sm ${
                    bypassesProbate
                      ? "text-green-700 dark:text-green-300"
                      : "text-indigo-700 dark:text-indigo-300"
                  }`}>
                    {METHOD_LABELS[method as keyof typeof METHOD_LABELS] || method}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(methodTotal)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(0)}% of estate
                  </p>
                  {bypassesProbate && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 rounded-full">
                      Skips Probate
                    </span>
                  )}
                  {!bypassesProbate && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200 rounded-full">
                      Through Probate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 3: Beneficiaries */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">
            Who Receives
          </h4>
          {beneficiaries.length > 0 ? (
            beneficiaries.map((beneficiary, index) => (
              <div
                key={index}
                className="relative p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {/* Flow line indicator */}
                <div
                  className="absolute left-0 top-1/2 w-4 h-0.5 -ml-4"
                  style={{ backgroundColor: beneficiary.color }}
                ></div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: beneficiary.color }}
                  >
                    {beneficiary.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {beneficiary.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {beneficiary.relationship}
                    </p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(beneficiary.value)} ({beneficiary.percentage.toFixed(0)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No beneficiaries defined
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Add family members in intake
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Probate Summary */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Probate Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Goes Through Probate</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(assets.filter(a => !a.bypassesProbate).reduce((sum, a) => sum + a.value, 0))}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Court-supervised distribution process
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Bypasses Probate</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(assets.filter(a => a.bypassesProbate).reduce((sum, a) => sum + a.value, 0))}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Transfers directly to beneficiaries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetFlowDiagram;
