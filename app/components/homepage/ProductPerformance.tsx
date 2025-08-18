"use client";
import React from "react";
import ChartCard from "@/app/ui/ChartCard";
import { ProductPerformanceType } from "@/app/types/homepage";

interface ProductPerformanceProps {
  chartData: ProductPerformanceType[];
  selectedPeriod: number;
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  chartData,
  selectedPeriod,
}) => {
  return (
    <div data-swapy-slot="slot-product-performance" className="lg:col-span-1">
      <div data-swapy-item="item-product-performance">
        <ChartCard
          title="Product Performance"
          subtitle={`Period ${selectedPeriod} overview`}
        >
          <div className="space-y-3">
            {chartData.length > 0 ? (
              chartData.slice(0, 4).map((product, index) => (
                <div
                  key={`${product.product?.name || product.name}-${index}`}
                  className="p-3 rounded-lg bg-white/5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white text-sm">
                      {product.product?.name ||
                        product.name ||
                        `Product ${index + 1}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.market_share || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (product.market_share || 0) * 2,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{product.sales_volume || 0} units</span>
                    <span>₹{((product.revenue || 0) / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <span className="text-gray-400 text-sm">
                  No products for Period {selectedPeriod}
                </span>
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default ProductPerformance;
