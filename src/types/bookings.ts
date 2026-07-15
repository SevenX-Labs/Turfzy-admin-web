export type BookingStatus = "PENDING_APPROVAL" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "PENDING";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type RefundStatus = "NONE" | "INITIATED" | "PROCESSED" | "FAILED";

export interface BookingUser {
  phone: string;
  userProfile?: {
    name: string;
  } | null;
}

export interface BookingTurf {
  name: string;
  city: string;
}

export interface BookingItem {
  id: string;
  userId: string;
  turfId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationMins: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentType: string;
  amount: number;
  groundCharge: number;
  platformFee: number;
  depositAmount: number;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  visitedAt?: string | null;
  checkedInByOwnerId?: string | null;
  scannedDevice?: string | null;
  scanIpAddress?: string | null;
  razorpayRefundId?: string | null;
  refundStatus: RefundStatus;
  refundAmount: number;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  notes?: string | null;
  playersCount?: number | null;
  createdAt: string;
  updatedAt: string;
  user: BookingUser;
  turf: BookingTurf;
}

export interface BookingStats {
  TOTAL: number;
  PENDING: number;
  PENDING_APPROVAL: number;
  CONFIRMED: number;
  COMPLETED: number;
  CANCELLED: number;
  NO_SHOW: number;
  REFUNDED: number;
  REJECTED: number;
}

export interface BookingListResponse {
  success: boolean;
  data: {
    bookings: BookingItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface BookingDetailsResponse {
  success: boolean;
  data: BookingItem & {
    user: {
      id: string;
      phone: string;
      email?: string | null;
      userProfile: {
        name: string;
        avatarUrl?: string | null;
      };
    };
    turf: {
      id: string;
      name: string;
      city: string;
      address: string;
      owner: {
        name: string;
        email: string;
        contactNumber: string;
      };
    };
    rating?: {
      rating: number;
      comment?: string | null;
      createdAt: string;
    } | null;
  };
}

export interface BookingStatsResponse {
  success: boolean;
  data: BookingStats;
}
