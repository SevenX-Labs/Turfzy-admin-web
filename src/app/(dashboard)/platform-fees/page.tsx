"use client";

import { useState } from "react";
import { DollarSign, Percent, ShieldCheck, FileText, Settings } from "lucide-react";

export default function PlatformFeesPage() {
  const [commission, setCommission] = useState(15);
  const [gatewayFee, setGatewayFee] = useState(2);
  const [gstRate, setGstRate] = useState(18);

  const mockFeeLogs = [
    { id: "TXN-901", date: "May 20, 2025", bookingId: "#4587", grossAmount: "₹1,200", commissionPaid: "₹180", gatewayCost: "₹24" },
    { id: "TXN-902", date: "May 19, 2025", bookingId: "#4585", grossAmount: "₹1,500", commissionPaid: "₹225", gatewayCost: "₹30" },
    { id: "TXN-903", date: "May 18, 2025", bookingId: "#4583", grossAmount: "₹1,200", commissionPaid: "₹180", gatewayCost: "₹24" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Platform Fees</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Configure transaction fees, billing policies, and track platform earnings</p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Edit configuration */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#ece8f8] space-y-6 text-left">
          <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-[#241c3d]">Fee Configuration</h3>
          </div>

          {/* Commision setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5b4e79]">
              <label>Platform Commission (%)</label>
              <span>{commission}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-[#f1effb] rounded-lg appearance-none"
            />
            <p className="text-[10px] text-[#8a7fa8]">Rate deducted from each online booking before payouts.</p>
          </div>

          {/* Gateway charges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5b4e79]">
              <label>Razorpay Gateway Fee (%)</label>
              <span>{gatewayFee}%</span>
            </div>
            <input
              type="number"
              value={gatewayFee}
              onChange={(e) => setGatewayFee(Number(e.target.value))}
              className="w-full rounded-xl border border-[#ece8f8] py-2 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
            />
            <p className="text-[10px] text-[#8a7fa8]">Standard credit/debit card transaction charges.</p>
          </div>

          {/* GST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5b4e79]">
              <label>Applicable GST Rate (%)</label>
              <span>{gstRate}%</span>
            </div>
            <input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
              className="w-full rounded-xl border border-[#ece8f8] py-2 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
            />
          </div>

          <button className="w-full rounded-xl bg-purple-600 py-3 text-center text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
            Save Fee Configuration
          </button>
        </div>

        {/* Right Card: Earnings history logs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#ece8f8] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#f6f4fd] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-[#241c3d]">Recent Transactions log</h3>
            </div>
          </div>

          <div className="space-y-4">
            {mockFeeLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3.5 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] text-left">
                <div>
                  <p className="text-xs font-bold text-[#241c3d]">{log.id} · Booking {log.bookingId}</p>
                  <p className="text-[9px] font-semibold text-[#8a7fa8] mt-0.5">Gross Booking Value: {log.grossAmount} · {log.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-purple-600">+{log.commissionPaid}</p>
                  <p className="text-[9px] font-semibold text-[#8a7fa8] mt-0.5">Gateway cost: {log.gatewayCost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
