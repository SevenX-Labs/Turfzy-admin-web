export type TurfStatus = "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "MAINTENANCE";

export interface TurfOwner {
  id?: string;
  name: string;
  contactNumber: string;
  email: string;
}

export interface TurfMaintenance {
  id: string;
  turfId: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
  createdAt: string;
}

export interface TurfRating {
  id: string;
  turfId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface TurfItem {
  id: string;
  ownerProfileId: string;
  name: string;
  description: string;
  sportsType: "FOOTBALL" | "CRICKET" | "BOTH" | string;
  turfSize: string;
  status: TurfStatus;
  isFeatured: boolean;
  featuredAt?: string | null;
  featuredBy?: string | null;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  suspendedBy?: string | null;
  address: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  openTime: string;
  closeTime: string;
  minSlotDurationMins: number;
  groundDayUrl?: string | null;
  groundNightUrl?: string | null;
  entranceUrl?: string | null;
  videoUrl?: string | null;
  floodLights: boolean;
  parking: boolean;
  washroom: boolean;
  changingRoom: boolean;
  drinkingWater: boolean;
  seatingArea: boolean;
  cafeteria: boolean;
  weekdayDayPrice: number;
  weekdayNightPrice: number;
  weekendDayPrice: number;
  weekendNightPrice: number;
  cancellationAllowedBeforeHours: number;
  cancellationRefundPercentage: number;
  paymentPreferences: string[];
  bookingApprovalType: "INSTANT" | "MANUAL" | string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  owner: TurfOwner;
  maintenanceRecords?: TurfMaintenance[];
  ratings?: TurfRating[];
}

export interface TurfListResponse {
  success: boolean;
  data: {
    turfs: TurfItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface TurfDetailsResponse {
  success: boolean;
  data: TurfItem;
}
