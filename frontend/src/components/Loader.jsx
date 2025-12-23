// src/components/Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 text-sm font-semibold text-center mt-4">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
