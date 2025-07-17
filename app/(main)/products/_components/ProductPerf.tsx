"use client";
import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Rocket, LayoutDashboard } from "lucide-react";
import { product } from "@prisma/client";
import Inputbox from "@/ui/Input-Box";
import { createProductPerformance } from "@/app/_actions/products";

interface ProductPerfProps {
  products: product[];
  company_id: string;
  current_period?: number;
  onSuccess?: () => void;
}

const ProductPerf: React.FC<ProductPerfProps> = ({
  products,
  company_id,
  current_period,
  onSuccess,
}) => {
  const handleSubmit = async (formData: FormData) => {
    try {
      await createProductPerformance(formData);
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating product performance:", error);
      // Optionally show error message
    }
  };
  return (
    <motion.div
      key="performance-tab"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto flex flex-col gap-10"
    >
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Create Performance
          </h2>
        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[{
              icon: BarChart3,
              title: "Analytics",
              desc: "Track key metrics and performance indicators",
              color: "blue",
              button: "View Analytics",
            },
            {
              icon: Rocket,
              title: "Optimization",
              desc: "Improve product performance and efficiency",
              color: "green",
              button: "Optimize Now",
            },
            {
              icon: LayoutDashboard,
              title: "Reports",
              desc: "Generate detailed performance reports",
              color: "purple",
              button: "Generate Report",
            },
          ].map(({ icon: Icon, title, desc, color, button }) => (
            <motion.div
              key={title}
              whileHover={{ scale: 1.03 }}
              className="bg-slate-800/30 rounded-xl p-6 border border-slate-600/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">{desc}</p>
              <button
                className={`w-full bg-${color}-500/20 hover:bg-${color}-500/30 text-${color}-400 py-2 rounded-lg transition-colors`}
              >
                {button}
              </button>
            </motion.div>
          ))}
        </div> */}

        {/* Product List */}
        <form action={handleSubmit} className="flex flex-col gap-6">
          <input type="hidden" name="company_id" value={company_id} />
          <input type="hidden" name="period" value={current_period || 1} />
          <div className="flex flex-col gap-4 mb-6">
            <label htmlFor="ProductList" className="text-white">
              Select Product
            </label>
            <select
              name="productID"
              id="ProductList"
              className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {products.map((product) => (
                <option
                  className="bg-slate-800 text-white p-2 rounded-lg"
                  key={product.id}
                  value={product.id}
                >
                  {`${product.name} - ${
                    product.inventory_level || 0
                  } units available`}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Inputbox
                name={"sales"}
                label={"Sales"}
                type={"number"}
                placeholder_text={
                  "Sales Data of the Product (should be less than inventory level)"
                }
              />
              <Inputbox
                name={"revenue"}
                label={"Total Revenue"}
                type={"number"}
                props={{
                  min: 1,
                }}
                placeholder_text={"Revenue Data of the Product"}
              />

              <Inputbox
                name={"market_share"}
                label={"Market Share"}
                type={"number"}
                placeholder_text={"Market Share of the Product"}
                props={{
                  min: 0,
                  max: 100,
                  step: 0.1,
                }}
              />
              <Inputbox
                name={"customer_satisfaction"}
                label={"Customer Satisfaction"}
                type={"number"}
                placeholder_text={"Customer Satisfaction of the Product"}
                props={{
                  min: 1,
                  step: 0.1,
                  max: 10,
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
          >
            Create Performance
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProductPerf;
