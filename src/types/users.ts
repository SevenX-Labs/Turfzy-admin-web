export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  city: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAuth {
  id: string;
  phone: string;
  role: string;
  isBanned: boolean;
  banReason: string | null;
  bannedAt: string | null;
  bannedBy: string | null;
  createdAt: string;
  deletedAt: string | null;
  userProfile?: UserProfile | null;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: UserAuth[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface UserDetails {
  profile: {
    id: string;
    phone: string;
    isBanned: boolean;
    banReason: string | null;
    bannedAt: string | null;
    createdAt: string;
    deletedAt: string | null;
    userProfile: UserProfile | null;
  };
  bookingHistorySummary: Record<string, number>;
  walletDetails: any | null;
  totalBookings: number;
  totalSpent: number;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
}

export interface UserDetailsResponse {
  success: boolean;
  data: UserDetails;
}

export interface UserBooking {
  id: string;
  userId: string;
  turfId: string;
  amount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  bookingDate: string;
  timeSlot: string;
  createdAt: string;
  updatedAt: string;
  turf: {
    name: string;
    city: string;
  };
}

export interface UserBookingsResponse {
  success: boolean;
  data: UserBooking[];
}
