import React from 'react';
import { HiOutlineTag, HiOutlinePlus } from "react-icons/hi";

const ScholarshipsDiscounts: React.FC = () => {
  const schemes = [
    { name: "Merit Scholarship", type: "Percentage", value: "25%", criteria: "GPA > 9.0" },
    { name: "Early Bird Discount", type: "Fixed", value: "₹5,000", criteria: "Payment before June" },
    { name: "Sports Excellence", type: "Percentage", value: "50%", criteria: "National Level Player" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Concessions</h1>
          <p className="text-gray-500 text-sm">Manage scholarship programs and special discounts.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition">
          <HiOutlinePlus /> Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <HiOutlineTag className="text-6xl text-indigo-900" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{scheme.name}</h3>
            <div className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded mb-4 uppercase">
              {scheme.type} Based
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Discount Value</p>
                <p className="text-2xl font-black text-indigo-600">{scheme.value}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Criteria</p>
                <p className="text-sm text-gray-600 italic">{scheme.criteria}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsDiscounts;