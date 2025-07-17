"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  PlusCircle,
  Rocket,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { getProductsByCompany } from "@/app/_actions/products";
import { product } from "@prisma/client";
import CreateProduct from "../../_components/CreateProduct";
import ProductPerf from "../../_components/ProductPerf";
import { useRouter } from "next/navigation";

type TabType = "create" | "performance";

const Page = ({ params }: { params: Promise<{ companyID: string }> }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [products, setProducts] = useState<product[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProductsByCompany(resolvedParams.companyID);
      setProducts(data);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setInitialLoad(false);
    }
  };

  const handleProductCreated = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      // Redirect to catalog page after success message
      router.push(`/products/catalog/${resolvedParams.companyID}`);
    }, 2000); // Reduced timeout to 2 seconds for better UX
  };

  const handlePerformanceCreated = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      // Redirect to catalog page with performance tab after success message
      router.push(
        `/products/catalog/${resolvedParams.companyID}?tab=performance`
      );
    }, 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="h-full text-white py-10 px-4 relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 border border-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {activeTab === "create"
                ? "Product created successfully!"
                : "Performance data created successfully!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-slate-800/60 backdrop-blur-sm rounded-full p-1 border border-slate-700/40 shadow-inner shadow-slate-800/40">
          {[
            {
              key: "create",
              label: "Create Product",
              icon: PlusCircle,
              color: "blue",
            },
            {
              key: "performance",
              label: "Manage Performance",
              icon: BarChart3,
              color: "purple",
            },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeTab === key
                  ? `bg-${color}-500 text-white shadow-md shadow-${color}-500/30`
                  : "text-slate-400 hover:text-white hover:bg-slate-700/40"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center w-full min-h-[500px] flex-col"
            >
              <CreateProduct
                companyID={resolvedParams.companyID}
                onSuccess={handleProductCreated}
              />
            </motion.div>
          )}

          {activeTab === "performance" && (
            <ProductPerf
              products={products}
              company_id={resolvedParams.companyID}
              onSuccess={handlePerformanceCreated}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] -translate-x-1/2 -translate-y-1/2 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Page;
