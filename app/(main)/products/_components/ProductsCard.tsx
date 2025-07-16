"use client";
import React from "react";
import { product } from "@prisma/client";

interface CardProps {
  products: product[];
}

const ProductsCard: React.FC<CardProps> = ({ products }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-lg p-5 transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
            aria-label={`product: ${product.name}`}
          >
            <h1 className="text-lg font-semibold text-white mb-2 truncate hover:text-blue-500">
              {product.name}
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Additional product details */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Category:</span>
                <span className="text-xs text-gray-300">
                  {product.category}
                </span>
              </div>

              {product.selling_price && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Price:</span>
                  <span className="text-xs text-green-400">
                    ${product.selling_price}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Status:</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.status === "launched"
                      ? "bg-green-500/20 text-green-400"
                      : product.status === "production"
                      ? "bg-blue-500/20 text-blue-400"
                      : product.status === "development"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCard;
