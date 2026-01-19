// Page titles and headings
export const TITLES = {
  // Admin pages
  ADMIN: {
    DASHBOARD: 'لوحة التحكم',
    SIDEBAR: 'لوحة الإدارة',
    CATEGORIES: 'إدارة الفئات',
    PRODUCTS: 'إدارة المنتجات',
    USERS: 'إدارة المستخدمين',
    ORDERS: 'الطلبات',
    ORDER_DETAILS: 'تفاصيل الطلب',
    CREATE_CATEGORY: 'إضافة فئة جديدة',
    EDIT_CATEGORY: 'تعديل الفئة',
    CREATE_PRODUCT: 'إضافة منتج جديد',
    EDIT_PRODUCT: 'تعديل المنتج',
  },

  // Dashboard stats
  DASHBOARD_STATS: {
    TOTAL_SALES: 'إجمالي المبيعات',
    ORDERS: 'الطلبات',
    PRODUCTS: 'المنتجات',
    USERS: 'المستخدمين',
  },

  // Public pages
  PUBLIC: {
    ALL_PRODUCTS: 'جميع المنتجات',
    CATEGORIES: 'الفئات',
    PRODUCT_NOT_FOUND: 'المنتج غير موجود',
    CHECKOUT: 'إتمام الطلب',
    CART_EMPTY: 'السلة فارغة',
    PAYMENT_SUCCESS: 'تم الدفع بنجاح!',
    PAYMENT_FAILED: 'فشلت عملية الدفع',
    FORGOT_PASSWORD: 'نسيت كلمة المرور؟',
    RESET_PASSWORD: 'إعادة تعيين كلمة المرور',
  },

  // Account pages
  ACCOUNT: {
    PROFILE: 'الملف الشخصي',
    ORDERS: 'طلباتي',
    ORDER_DETAILS: 'تفاصيل الطلب',
    ADDRESSES: 'عناويني',
    REVIEWS: 'تقييماتي',
    MY_ORDERS: 'طلباتي',
  },

  // Component titles
  COMPONENTS: {
    CUSTOMER_REVIEWS: 'تقييمات العملاء',
    SEARCH_AND_FILTER: 'البحث والفلتر',
    SHOPPING_CART: 'سلة التسوق',
    ORDER_SUMMARY: 'ملخص الطلب',
    SHIPPING_INFO: 'معلومات الشحن',
    CUSTOMER_INFO: 'بيانات العميل',
    ORDER_STATUS: 'حالة الطلب',
    SHIPPING_ADDRESS: 'عنوان الشحن',
    CART: 'السلة',
    CART_EMPTY: 'السلة فارغة',
    CHECKOUT: 'إتمام الطلب',
    PRODUCT_NOT_FOUND: 'المنتج غير موجود',
    SIZE_SELECTION: 'الحجم',
    CATEGORY: 'الفئة',
    QUANTITY: 'الكمية',
    TOTAL: 'الإجمالي',
    DESCRIPTION: 'الوصف',
  },

  // Hero section
  HERO: {
    MAIN_TITLE: 'اكتشف عالم',
    MAIN_TITLE_HIGHLIGHT: 'العطور الفاخرة',
    SUBTITLE: 'تجربة فريدة من العطور العربية والعالمية المميزة',
  },

  // Footer sections
  FOOTER: {
    ABOUT: 'عن تركيبة',
    QUICK_LINKS: 'روابط سريعة',
    CUSTOMER_SERVICE: 'خدمة العملاء',
    CONTACT: 'تواصل معنا',
    COPYRIGHT: 'جميع الحقوق محفوظة',
  },

  // Home page sections
  HOME: {
    FEATURED_PRODUCTS: 'منتجات مميزة',
    NEW_ARRIVALS: 'وصل حديثاً',
    BROWSE_BY_CATEGORY: 'تصفح حسب الفئة',
    BEST_SELLERS: 'الأكثر مبيعاً',
    MENS_PERFUMES: 'عطور رجالية',
    WOMENS_PERFUMES: 'عطور نسائية',
    SELECT_FAVORITE_CATEGORY: 'اختر الفئة المفضلة لديك',
  },

  // Product detail page
  PRODUCT_DETAIL: {
    DESCRIPTION: 'الوصف',
    SIZE: 'الحجم',
    CATEGORY: 'الفئة',
  },
};

// Page descriptions/subtitles
export const DESCRIPTIONS = {
  PUBLIC: {
    ALL_PRODUCTS: 'تصفح مجموعتنا الكاملة من العطور',
    CATEGORIES: 'تصفح جميع فئات العطور المتاحة',
    NO_PRODUCTS_CURRENTLY: 'لا توجد منتجات متاحة حالياً',
    BEST_SELECTION: 'اختيارنا الخاص من أفضل العطور',
    MENS_COLLECTION: 'تشكيلة مميزة من العطور الرجالية الفاخرة',
    WOMENS_COLLECTION: 'أرقى العطور النسائية التي تلامس الروح',
  },

  FOOTER: {
    ABOUT_TARKEBA: 'احصل على أفضل التركيبات العطرية من أفضل العطور. كل تركيبة لها رائحة مميزة بتحكي قصتك أنت.',
    ABOUT: 'متجر تركيبة هو وجهتك الأولى للعطور الفاخرة في الشرق الأوسط. نقدم لكم أفضل العطور العربية والعالمية بجودة عالية وأسعار منافسة.',
    ABOUT_TARKEBA_TITLE: 'عن تركيبة',
    COPYRIGHT: 'جميع الحقوق محفوظة',
  },

  CART: {
    EMPTY: 'لم تقم بإضافة أي منتجات بعد',
  },

  PROFILE: {
    INFO: 'قم بتحديث معلوماتك الشخصية وعنوان بريدك الإلكتروني.',
    MY_INFO: 'معلوماتي الشخصية',
  },

  AUTH: {
    AUTHENTICATING: 'يرجى الانتظار بينما نقوم بتسجيل دخولك...',
    LOADING: 'جاري التحميل...',
    LOADING_DATA: 'جاري تحميل البيانات...',
    AUTHENTICATING_TITLE: 'جاري المصادقة',
  },

  // Page numbers
  PAGINATION: {
    PAGE_OF: (page: number, total: number) => `صفحة ${page} من ${total}`,
  },
};
