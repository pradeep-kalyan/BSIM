"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, PlusCircle, Rocket, LayoutDashboard } from "lucide-react";
import { getProductsByCompany } from "@/app/_actions/products";
import { product } from "@prisma/client";
import CreateProduct from "../../_components/CreateProduct";
import ProductsCard from "../../_components/ProductsCard";

const Page = ({ params }: { params: Promise<{ companyID: string }> }) => {
  const resolvedParams = React.use(params);
  const [products, setProducts] = useState<product[]>([]);
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
    fetchProducts(); // Refresh the product list

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg font-medium">
            Loading products...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 px-4 relative">
      {/* Header Section */}
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
            <span className="font-medium">Product created successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center items-center w-full mt-8"
            >
              <CreateProduct
                companyID={resolvedParams.companyID}
                onSuccess={handleProductCreated}
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
                companyID={resolvedParams.companyID}
                onSuccess={handleProductCreated}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Page;
