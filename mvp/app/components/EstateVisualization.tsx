"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Types for visualization data
export interface BeneficiaryDistribution {
  name: string;
  relationship: string;
  value: number;
  percentage: number;
  assets: AssetAllocation[];
  color: string;
}

export interface AssetAllocation {
  name: string;
  type: string;
  value: number;
  transferMethod: "will" | "trust" | "beneficiary_designation" | "joint_ownership";
  bypassesProbate: boolean;
}

export interface EstateData {
  totalValue: number;
  beneficiaries: BeneficiaryDistribution[];
  assets: AssetAllocation[];
  warnings: EstateWarning[];
}

export interface EstateWarning {
  type: "conflict" | "missing" | "outdated";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  asset?: string;
}

// Color palette for beneficiaries
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

// Transfer method labels
const TRANSFER_METHOD_LABELS: Record<string, string> = {
  will: "Through Will",
  trust: "Through Trust",
  beneficiary_designation: "Beneficiary Designation",
  joint_ownership: "Joint Ownership",
};

interface EstateVisualizationProps {
  data: EstateData;
  showLegend?: boolean;
  height?: number;
}

export function EstateVisualization({
  data,
  showLegend = true,
  height = 400,
}: EstateVisualizationProps) {
  const pieData = useMemo(() => {
    return data.beneficiaries.map((b) => ({
      name: b.name,
      value: b.percentage,
      actualValue: b.value,
      relationship: b.relationship,
      color: b.color,
    }));
  }, [data.beneficiaries]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof pieData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data.relationship}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            {data.value.toFixed(1)}% ({formatCurrency(data.actualValue)})
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
  }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    // Return null if required values are missing or percent is too small
    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined ||
      percent === undefined ||
      percent < 0.05
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      {/* Total Estate Value Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Estate Value</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(data.totalValue)}
        </p>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={height / 3}
            innerRadius={height / 6}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Attention Needed
          </h4>
          {data.warnings.map((warning, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                warning.severity === "high"
                  ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : warning.severity === "medium"
                  ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                  : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              }`}
            >
              <p className={`font-medium text-sm ${
                warning.severity === "high"
                  ? "text-red-800 dark:text-red-200"
                  : warning.severity === "medium"
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-blue-800 dark:text-blue-200"
              }`}>
                {warning.title}
              </p>
              <p className={`text-xs mt-1 ${
                warning.severity === "high"
                  ? "text-red-600 dark:text-red-300"
                  : warning.severity === "medium"
                  ? "text-amber-600 dark:text-amber-300"
                  : "text-blue-600 dark:text-blue-300"
              }`}>
                {warning.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Summary stats component
interface EstateStatsProps {
  data: EstateData;
}

export function EstateStats({ data }: EstateStatsProps) {
  const probateAssets = data.assets.filter((a) => !a.bypassesProbate);
  const nonProbateAssets = data.assets.filter((a) => a.bypassesProbate);

  const probateValue = probateAssets.reduce((sum, a) => sum + a.value, 0);
  const nonProbateValue = nonProbateAssets.reduce((sum, a) => sum + a.value, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const stats = [
    {
      label: "Total Beneficiaries",
      value: data.beneficiaries.length.toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Through Probate",
      value: formatCurrency(probateValue),
      subtext: `${data.totalValue > 0 ? ((probateValue / data.totalValue) * 100).toFixed(0) : 0}% of estate`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Bypasses Probate",
      value: formatCurrency(nonProbateValue),
      subtext: `${data.totalValue > 0 ? ((nonProbateValue / data.totalValue) * 100).toFixed(0) : 0}% of estate`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Warnings",
      value: data.warnings.length.toString(),
      variant: data.warnings.length > 0 ? "warning" : "success",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${
            stat.variant === "warning"
              ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
              : stat.variant === "success"
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          }`}
        >
          <div className={`mb-2 ${
            stat.variant === "warning"
              ? "text-amber-600 dark:text-amber-400"
              : stat.variant === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-gray-400 dark:text-gray-500"
          }`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          {stat.subtext && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper to parse intake data into visualization format
export function parseIntakeToEstateData(
  intakeData: Array<{ section: string; data: string }>,
  beneficiaryDesignations?: Array<{
    assetType: string;
    assetName: string;
    estimatedValue?: string;
    primaryBeneficiaryName: string;
    primaryBeneficiaryRelationship?: string;
  }>
): EstateData {
  let familyData: Record<string, unknown> = {};
  let assetsData: Record<string, unknown> = {};
  let goalsData: Record<string, unknown> = {};

  // Parse intake sections
  for (const section of intakeData) {
    try {
      const parsed = JSON.parse(section.data);
      switch (section.section) {
        case "family":
          familyData = parsed;
          break;
        case "assets":
          assetsData = parsed;
          break;
        case "goals":
          goalsData = parsed;
          break;
      }
    } catch (e) {
      // Skip malformed data
    }
  }

  // Build beneficiary list from family data
  const beneficiaryMap = new Map<string, BeneficiaryDistribution>();
  let colorIndex = 0;

  const addBeneficiary = (name: string, relationship: string) => {
    if (!name || beneficiaryMap.has(name)) return;
    beneficiaryMap.set(name, {
      name,
      relationship,
      value: 0,
      percentage: 0,
      assets: [],
      color: COLORS[colorIndex % COLORS.length],
    });
    colorIndex++;
  };

  // Add spouse
  if (familyData.spouseName) {
    addBeneficiary(familyData.spouseName as string, "Spouse");
  }

  // Add children
  if (Array.isArray(familyData.children)) {
    for (const child of familyData.children) {
      if (child.name) {
        addBeneficiary(child.name, "Child");
      }
    }
  }

  // Add beneficiaries from designations
  if (beneficiaryDesignations) {
    for (const designation of beneficiaryDesignations) {
      addBeneficiary(
        designation.primaryBeneficiaryName,
        designation.primaryBeneficiaryRelationship || "Beneficiary"
      );
    }
  }

  // Build assets list
  const assets: AssetAllocation[] = [];
  let totalValue = 0;

  // Helper to parse value ranges
  const parseValueRange = (range: string): number => {
    const rangeMap: Record<string, number> = {
      under_100k: 50000,
      "100k_250k": 175000,
      "250k_500k": 375000,
      "500k_1m": 750000,
      "1m_2m": 1500000,
      "2m_5m": 3500000,
      "5m_10m": 7500000,
      over_10m: 15000000,
    };
    return rangeMap[range] || 0;
  };

  // Add primary home
  if (assetsData.hasPrimaryHome && assetsData.primaryHomeValue) {
    const value = parseValueRange(assetsData.primaryHomeValue as string);
    assets.push({
      name: "Primary Residence",
      type: "real_estate",
      value,
      transferMethod: "will",
      bypassesProbate: false,
    });
    totalValue += value;
  }

  // Add bank accounts
  if (assetsData.hasBankAccounts && assetsData.bankAccountsValue) {
    const value = parseValueRange(assetsData.bankAccountsValue as string);
    assets.push({
      name: "Bank Accounts",
      type: "bank",
      value,
      transferMethod: "will",
      bypassesProbate: false,
    });
    totalValue += value;
  }

  // Add investment accounts
  if (assetsData.hasInvestmentAccounts && assetsData.investmentAccountsValue) {
    const value = parseValueRange(assetsData.investmentAccountsValue as string);
    assets.push({
      name: "Investment Accounts",
      type: "investment",
      value,
      transferMethod: "will",
      bypassesProbate: false,
    });
    totalValue += value;
  }

  // Add retirement accounts (these bypass probate via beneficiary designation)
  if (assetsData.hasRetirementAccounts && assetsData.retirementAccountsValue) {
    const value = parseValueRange(assetsData.retirementAccountsValue as string);
    assets.push({
      name: "Retirement Accounts",
      type: "retirement",
      value,
      transferMethod: "beneficiary_designation",
      bypassesProbate: true,
    });
    totalValue += value;
  }

  // Add life insurance (bypasses probate)
  if (assetsData.hasLifeInsurance && assetsData.lifeInsuranceValue) {
    const value = parseValueRange(assetsData.lifeInsuranceValue as string);
    assets.push({
      name: "Life Insurance",
      type: "insurance",
      value,
      transferMethod: "beneficiary_designation",
      bypassesProbate: true,
    });
    totalValue += value;
  }

  // Add business interests
  if (assetsData.hasBusinessInterests && assetsData.businessValue) {
    const value = parseValueRange(assetsData.businessValue as string);
    assets.push({
      name: "Business Interests",
      type: "business",
      value,
      transferMethod: "will",
      bypassesProbate: false,
    });
    totalValue += value;
  }

  // Distribute assets to beneficiaries (simplified equal distribution for now)
  const beneficiaries = Array.from(beneficiaryMap.values());
  if (beneficiaries.length > 0 && totalValue > 0) {
    const sharePerBeneficiary = totalValue / beneficiaries.length;
    for (const beneficiary of beneficiaries) {
      beneficiary.value = sharePerBeneficiary;
      beneficiary.percentage = 100 / beneficiaries.length;
    }
  }

  // Generate warnings
  const warnings: EstateWarning[] = [];

  // Check for retirement accounts without tracked beneficiaries
  if (assetsData.hasRetirementAccounts && (!beneficiaryDesignations || beneficiaryDesignations.length === 0)) {
    warnings.push({
      type: "missing",
      severity: "high",
      title: "Retirement Beneficiaries Not Tracked",
      description: "Your retirement accounts pass directly to named beneficiaries, bypassing your will. Consider tracking these designations.",
    });
  }

  // Check for life insurance without beneficiary info
  if (assetsData.hasLifeInsurance && !assetsData.lifeInsuranceBeneficiaries) {
    warnings.push({
      type: "missing",
      severity: "medium",
      title: "Life Insurance Beneficiaries Unknown",
      description: "Life insurance proceeds go directly to named beneficiaries. Make sure these match your wishes.",
    });
  }

  return {
    totalValue,
    beneficiaries,
    assets,
    warnings,
  };
}

export { COLORS, TRANSFER_METHOD_LABELS };
