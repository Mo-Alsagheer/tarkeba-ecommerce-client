// Status labels and badge texts
export const STATUS = {
  // Order status
  ORDER: {
    PENDING: 'قيد الانتظار',
    PROCESSING: 'قيد المعالجة',
    SHIPPED: 'تم الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
    REFUNDED: 'تم الاسترجاع',
    ON_HOLD: 'معلق',
    CONFIRMED: 'مؤكد',
  },

  // Payment status
  PAYMENT: {
    PENDING: 'في انتظار الدفع',
    PAID: 'مدفوع',
    FAILED: 'فشل الدفع',
    REFUNDED: 'تم الاسترجاع',
    CASH_ON_DELIVERY: 'الدفع عند الاستلام',
  },

  // User status
  USER: {
    ACTIVE: 'نشط',
    INACTIVE: 'غير نشط',
    VERIFIED: 'موثق',
    NOT_VERIFIED: 'غير موثق',
    SUSPENDED: 'موقوف',
  },

  // User roles
  ROLES: {
    ADMIN: 'مدير',
    MODERATOR: 'مشرف',
    CUSTOMER: 'عميل',
  },

  // Product status
  PRODUCT: {
    ACTIVE: 'نشط',
    INACTIVE: 'غير نشط',
    OUT_OF_STOCK: 'نفد المخزون',
    FEATURED: 'مميز',
    ON_SALE: 'تخفيض',
    NEW: 'جديد',
  },

  // Category status
  CATEGORY: {
    ACTIVE: 'نشطة',
    INACTIVE: 'غير نشطة',
  },

  // Stock status
  STOCK: {
    IN_STOCK: 'متوفر',
    OUT_OF_STOCK: 'غير متوفر',
    LOW_STOCK: 'كمية محدودة',
  },
};

// Sort options
export const SORT_OPTIONS = {
  DEFAULT: 'الافتراضي',
  PRICE_LOW_HIGH: 'السعر: الأقل أولاً',
  PRICE_HIGH_LOW: 'السعر: الأعلى أولاً',
  NEWEST: 'الأحدث',
  HIGHEST_RATED: 'الأعلى تقييماً',
  BEST_SELLING: 'الأكثر مبيعاً',
  NAME_A_Z: 'الاسم: أ - ي',
  NAME_Z_A: 'الاسم: ي - أ',
};

// Currency
export const CURRENCY = {
  EGP: 'EGP',
  SAR: 'ر.س',
  USD: '$',
  DEFAULT: 'EGP',
};

// Units
export const UNITS = {
  ML: 'مل',
  PIECE: 'قطعة',
  KG: 'كجم',
};
