"use client";

import { useState, ReactNode } from "react";
import { BeneficiaryDistribution, AssetAllocation, TRANSFER_METHOD_LABELS } from "./EstateVisualization";

interface BeneficiaryCardsProps {
  beneficiaries: BeneficiaryDistribution[];
  assets: AssetAllocation[];
  totalValue: number;
}

// Relationship icons
const RELATIONSHIP_ICONS: Record<string, ReactNode> = {
  Spouse: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Child: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Parent: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function BeneficiaryCards({ beneficiaries, assets, totalValue }: BeneficiaryCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Distribute assets to each beneficiary (simplified - equal distribution)
  const getAssetsForBeneficiary = (beneficiary: BeneficiaryDistribution): AssetAllocation[] => {
    // For now, show all assets divided equally
    // In a real implementation, this would come from the will/trust data
    return assets.map(asset => ({
      ...asset,
      value: asset.value / beneficiaries.length,
    }));
  };

  if (beneficiaries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Beneficiaries Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Add family members in your intake form to see how your estate will be distributed to each person.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estate Distribution Among {beneficiaries.length} Beneficiar{beneficiaries.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map((beneficiary) => {
          const isExpanded = expandedCard === beneficiary.name;
          const beneficiaryAssets = getAssetsForBeneficiary(beneficiary);
          const probateAssets = beneficiaryAssets.filter(a => !a.bypassesProbate);
          const nonProbateAssets = beneficiaryAssets.filter(a => a.bypassesProbate);
          const icon = RELATIONSHIP_ICONS[beneficiary.relationship] || RELATIONSHIP_ICONS.default;

          return (
            <div
              key={beneficiary.name}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "border-blue-400 dark:border-blue-500 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {/* Header with color accent */}
              <div
                className="h-2"
                style={{ backgroundColor: beneficiary.color }}
              ></div>

              {/* Card content */}
              <div className="p-5">
                {/* Avatar and name */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                    style={{ backgroundColor: beneficiary.color }}
                  >
                    {beneficiary.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {beneficiary.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      {icon}
                      <span className="text-sm">{beneficiary.relationship}</span>
                    </div>
                  </div>
                </div>

                {/* Value summary */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Inheritance</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(beneficiary.value)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${beneficiary.percentage}%`,
                          backgroundColor: beneficiary.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {beneficiary.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">Via Probate</p>
                    <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                      {formatCurrency(probateAssets.reduce((sum, a) => sum + a.value, 0))}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400">Direct Transfer</p>
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      {formatCurrency(nonProbateAssets.reduce((sum, a) => sum + a.value, 0))}
                    </p>
                  </div>
                </div>

                {/* Expand/collapse button */}
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : beneficiary.name)}
                  className="mt-4 w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Assets Received
                    </h4>
                    {beneficiaryAssets.map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {asset.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {TRANSFER_METHOD_LABELS[asset.transferMethod]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(asset.value)}
                          </p>
                          {asset.bypassesProbate && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Direct
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Distribution Note
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This visualization shows an estimated equal distribution among beneficiaries.
              Your actual distribution may differ based on your will, trust, and beneficiary designations.
              Consult with an estate planning attorney to ensure your wishes are properly documented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryCards;
