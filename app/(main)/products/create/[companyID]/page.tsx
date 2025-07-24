"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  PlusCircle,
  Rocket,
  LayoutDashboard,
} from "lucide-react";
import { getProductsByCompany } from "@/app/_actions/products";
import { product } from "@prisma/client";
import CreateProduct from "../../_components/CreateProduct";
import ProductPerf from "../../_components/ProductPerf";
import { useRouter } from "next/navigation";

type TabType = "create" | "performance";

interface PageProps {
  params: {
    companyID: string;
    simulationID: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { companyID, simulationID } = params;

  const [products, setProducts] = useState<product[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProductsByCompany(companyID);
      setProducts(data);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setInitialLoad(false);
    }
  };

  const handleProductCreated = () => {
    setSuccess(true);
    setShowForm(false);
    fetchProducts();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 px-4 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white mb-6">Products</h2>
        {products.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg transition-all duration-200 self-start sm:self-auto"
          >
            {showForm ? (
              <>
                <LayoutDashboard className="w-5 h-5" />
                View Products
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Create Product
              </>
            )}
          </motion.button>
        )}
      </div>

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
                companyID={companyID}
                simulationID={simulationID}
                onCreated={handleProductCreated}
              />
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <ProductsCard products={products} />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center w-full min-h-[500px] flex-col mt-8"
            >
              <div className="text-center mb-8 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Rocket className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Ready to Start?
                </h3>
                <p className="text-slate-300 text-lg mb-8">
                  Create your first product to begin your entrepreneurial
                  journey
                </p>
              </div>

              <CreateProduct
                companyID={companyID}
                simulationID={simulationID}
                onCreated={handleProductCreated}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] -translate-x-1/2 -translate-y-1/2 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Page;
