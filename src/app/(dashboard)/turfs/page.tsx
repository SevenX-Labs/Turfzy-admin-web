"use client";

import { useState } from "react";
import { Search, MapPin, Plus, Star, ShieldAlert, Sparkles } from "lucide-react";

interface TurfItem {
  id: string;
  name: string;
  location: string;
  city: "Mumbai" | "Pune" | "Thane" | "Nashik";
  pricePerHour: number;
  rating: number;
  status: "Approved" | "Pending";
  ownerName: string;
  image: string;
  sports: string[];
}

const dummyTurfs: TurfItem[] = [
  {
    id: "TRF-201",
    name: "Elite Arena",
    location: "Andheri West",
    city: "Mumbai",
    pricePerHour: 1200,
    rating: 4.8,
    status: "Approved",
    ownerName: "Rohit Sharma",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&h=300&fit=crop&q=80",
    sports: ["Football", "Cricket"],
  },
  {
    id: "TRF-202",
    name: "Playground Sports",
    location: "Kothrud",
    city: "Pune",
    pricePerHour: 800,
    rating: 4.5,
    status: "Approved",
    ownerName: "Sandeep Patil",
    image: "https://images.unsplash.com/photo-1489945052260-4f21d52268b9?w=500&h=300&fit=crop&q=80",
    sports: ["Football", "Basketball"],
  },
  {
    id: "TRF-203",
    name: "Turf World",
    location: "Ghodbunder Road",
    city: "Thane",
    pricePerHour: 1500,
    rating: 4.9,
    status: "Approved",
    ownerName: "Amit Verma",
    image: "https://images.unsplash.com/photo-1518605333140-552d48123fad?w=500&h=300&fit=crop&q=80",
    sports: ["Football", "Cricket", "Tennis"],
  },
  {
    id: "TRF-204",
    name: "Goal Station",
    location: "Nashik Road",
    city: "Nashik",
    pricePerHour: 900,
    rating: 4.2,
    status: "Approved",
    ownerName: "Vikram Singh",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&h=300&fit=crop&q=80",
    sports: ["Football"],
  },
  {
    id: "TRF-205",
    name: "Green Field Arena",
    location: "Bandra Kurla Complex",
    city: "Mumbai",
    pricePerHour: 2000,
    rating: 0.0,
    status: "Pending",
    ownerName: "Vinay Kumar",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&h=300&fit=crop&q=80",
    sports: ["Cricket", "Football"],
  },
  {
    id: "TRF-206",
    name: "Victory Turf",
    location: "Hinjewadi Phase 2",
    city: "Pune",
    pricePerHour: 1000,
    rating: 0.0,
    status: "Pending",
    ownerName: "Milind Soman",
    image: "https://images.unsplash.com/photo-1524191632731-067f967cc996?w=500&h=300&fit=crop&q=80",
    sports: ["Football", "Cricket"],
  },
];

export default function TurfsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Pending">("All");
  const [cityFilter, setCityFilter] = useState<"All" | "Mumbai" | "Pune" | "Thane" | "Nashik">("All");

  const filteredTurfs = dummyTurfs.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesCity = cityFilter === "All" || t.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241c3d]">Turfs Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5">Manage arena listings, rates, and approval applications</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          Add New Turf
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Total Listed</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">865</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Approved</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">820</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Pending Review</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">45</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#ece8f8] flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
            <input
              type="text"
              placeholder="Search turfs, location, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {(["All", "Approved", "Pending"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === tab
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                    : "bg-[#f8f7fd] text-[#5b4e79] hover:bg-[#f3effc]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* City Filter Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f6f4fd]">
          <span className="text-xs font-bold text-[#8a7fa8] self-center mr-2">City:</span>
          {(["All", "Mumbai", "Pune", "Thane", "Nashik"] as const).map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                cityFilter === city
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-white text-[#5b4e79] border border-[#ece8f8] hover:bg-[#f8f7fd]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Turf Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTurfs.map((turf) => (
          <div
            key={turf.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#ece8f8] shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col"
          >
            {/* Visual Header */}
            <div className="relative h-44 w-full bg-purple-50 overflow-hidden">
              <img src={turf.image} alt={turf.name} className="h-full w-full object-cover" />
              
              {/* Badge Status */}
              <span className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md ${
                turf.status === "Approved"
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white animate-pulse"
              }`}>
                {turf.status}
              </span>

              {/* Price Tag */}
              <span className="absolute bottom-4 left-4 bg-[#241c3d]/80 backdrop-blur-md text-white rounded-lg px-2.5 py-1 text-[11px] font-bold">
                ₹{turf.pricePerHour.toLocaleString()}/hr
              </span>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-[#241c3d] line-clamp-1">{turf.name}</h3>
                  {turf.rating > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{turf.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#5b4e79] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#a79fc0]" />
                  {turf.location}, {turf.city}
                </p>

                <p className="text-[11px] text-[#8a7fa8] font-medium">
                  Owner: <span className="font-bold text-[#5b4e79]">{turf.ownerName}</span>
                </p>
              </div>

              {/* Sports tags & actions */}
              <div className="pt-3 border-t border-[#f6f4fd] flex items-center justify-between">
                <div className="flex gap-1">
                  {turf.sports.map((sport) => (
                    <span key={sport} className="rounded-md bg-purple-50 border border-purple-100 text-[#7c3aed] text-[9px] font-bold px-2 py-0.5">
                      {sport}
                    </span>
                  ))}
                </div>
                <button className="rounded-xl border border-[#ece8f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                  Edit Turf
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTurfs.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-[#ece8f8] p-12 text-center text-sm font-semibold text-[#8a7fa8]">
            No turfs found matching your filter selection.
          </div>
        )}
      </div>
    </div>
  );
}
