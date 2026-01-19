// Toast messages and notifications
export const MESSAGES = {
  // Success messages
  SUCCESS: {
    CATEGORY_CREATED: 'تم إضافة الفئة بنجاح',
    CATEGORY_UPDATED: 'تم تحديث الفئة بنجاح',
    CATEGORY_DELETED: 'تم حذف الفئة بنجاح',
    PRODUCT_CREATED: 'تم إضافة المنتج بنجاح',
    PRODUCT_UPDATED: 'تم تحديث المنتج بنجاح',
    PRODUCT_DELETED: 'تم حذف المنتج بنجاح',
    PRODUCT_ADDED_TO_CART: 'تم إضافة المنتج إلى السلة',
    USER_ROLES_UPDATED: 'تم تحديث الأدوار بنجاح',
    USER_DELETED: 'تم حذف المستخدم بنجاح',
    ORDER_STATUS_UPDATED: 'تم تحديث حالة الطلب بنجاح',
    PAYMENT_SUCCESS: 'تم الدفع بنجاح!',
  },

  // Error messages
  ERROR: {
    CATEGORY_CREATE_FAILED: 'فشل في إضافة الفئة',
    CATEGORY_UPDATE_FAILED: 'فشل في تحديث الفئة',
    CATEGORY_DELETE_FAILED: 'فشل في حذف الفئة',
    CATEGORY_NAME_REQUIRED: 'اسم الفئة مطلوب',
    INVALID_EMAIL: 'البريد الإلكتروني غير صالح',
    PASSWORD_MISMATCH: 'كلمات المرور غير متطابقة',
    OTP_LENGTH: 'رمز التحقق يجب أن يكون 6 أرقام',
    PASSWORD_MIN_LENGTH: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    OTP_SEND_FAILED: 'فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.',
    PASSWORD_RESET_FAILED: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.',
    PRODUCT_CREATE_FAILED: 'فشل في إضافة المنتج',
    PRODUCT_UPDATE_FAILED: 'فشل في تحديث المنتج',
    PRODUCT_DELETE_FAILED: 'فشل في حذف المنتج',
    PRODUCT_FIELDS_REQUIRED: 'الرجاء ملء الحقول المطلوبة: الاسم، الوصف، والفئة',
    PRODUCT_VARIANT_REQUIRED: 'الرجاء إضافة متغير واحد على الأقل بحجم وسعر',
    REQUIRED_FIELDS_MISSING: 'الرجاء ملء الحقول المطلوبة',
    USER_ROLE_REQUIRED: 'يجب اختيار دور واحد على الأقل',
    USER_ROLES_UPDATE_FAILED: 'فشل في تحديث الأدوار',
    USER_DELETE_FAILED: 'فشل في حذف المستخدم',
    ORDER_STATUS_UPDATE_FAILED: 'فشل تحديث حالة الطلب',
    PAYMENT_FAILED: 'فشلت عملية الدفع',
    INVALID_IMAGE: 'يرجى اختيار صورة صالحة',
    IMAGE_TOO_LARGE: 'حجم الصورة كبير جداً (الحد الأقصى 5MB)',
    CATEGORIES_LOAD_FAILED: 'حدث خطأ في تحميل الفئات',
    PRODUCTS_LOAD_FAILED: 'حدث خطأ في تحميل المنتجات',
    ORDERS_LOAD_FAILED: 'حدث خطأ في تحميل الطلبات',
    ORDER_DETAILS_LOAD_FAILED: 'حدث خطأ في تحميل تفاصيل الطلب',
    IMAGE_FILE_TOO_LARGE: (fileName: string) => `${fileName} كبير جداً (الحد الأقصى 5MB)`,
    NOT_VALID_IMAGE: (fileName: string) => `${fileName} ليس صورة صالحة`,
    STATS_LOAD_FAILED: 'فشل تحميل الإحصائيات',
    USERS_LOAD_FAILED: 'حدث خطأ في تحميل المستخدمين',
    PRODUCT_NOT_FOUND: 'المنتج غير موجود',
  },

  // Confirmation messages
  CONFIRM: {
    DELETE_CATEGORY: 'هل أنت متأكد من حذف الفئة',
    DELETE_PRODUCT: 'هل أنت متأكد من حذف المنتج',
    DELETE_USER: 'هل أنت متأكد من حذف المستخدم',
  },

  // Empty states
  EMPTY: {
    NO_CATEGORIES: 'لا توجد فئات. ابدأ بإضافة فئة جديدة.',
    NO_PRODUCTS: 'لا توجد منتجات. ابدأ بإضافة منتج جديد.',
    NO_PRODUCTS_AVAILABLE: 'لا توجد منتجات متاحة',
    NO_CATEGORIES_AVAILABLE: 'لا توجد فئات متاحة',
    NO_SEARCH_RESULTS: 'لم يتم العثور على نتائج',
    NO_USERS: 'لا يوجد مستخدمين',
    NO_ORDERS: 'لا توجد طلبات',
    CART_EMPTY: 'السلة فارغة',
    NO_REVIEWS: 'لا توجد تقييمات لهذا المنتج حتى الآن',
    NO_PHONE: 'لم يتم إضافة رقم هاتف',
    NO_ADDRESSES: 'لم تقم بإضافة أي عناوين بعد',
    NO_ORDER_REVIEWS: 'لم تقم بكتابة أي تقييمات بعد',
    PLEASE_LOGIN: 'يرجى تسجيل الدخول',
  },

  // Checkout messages
  CHECKOUT: {
    ERROR_SHIPPING_ADDRESS: 'يرجى إدخال عنوان الشحن بالكامل',
    ERROR_PAYMENT_METHOD: 'يرجى اختيار طريقة الدفع',
    ERROR_WALLET_PHONE: 'يرجى إدخال رقم المحفظة',
    ORDER_CREATED: 'تم إنشاء الطلب بنجاح',
    ORDER_ERROR: 'حدث خطأ أثناء معالجة الطلب',
    PROCESSING_ORDER: 'جاري معالجة الطلب...',
  },

  // Info messages
  INFO: {
    FORGOT_PASSWORD_DESC: 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق',
    RESET_PASSWORD_DESC: 'أدخل رمز التحقق المرسل إلى',
    IMAGE_MAX_SIZE: 'الحد الأقصى: 5MB، الأنواع المدعومة: JPG, PNG, GIF, WebP',
    IMAGE_MULTIPLE: 'الحد الأقصى: 5MB لكل صورة، يمكنك رفع عدة صور',
    TAGS_SEPARATOR: 'افصل الوسوم بفاصلة',
    DESCRIPTION_MAX_LENGTH: 'وصف الفئة (اختياري، حد أقصى 500 حرف)',
    AVAILABLE_STOCK: (count: number) => `متوفر ${count} قطعة`,
    OUT_OF_STOCK: 'غير متوفر',
    REVIEWS_COUNT: (count: number) => `(${count} تقييم)`,
    LOADING: 'جاري التحميل...',
    PROCESSING: 'جاري المعالجة...',
    LOGGING_IN: 'جاري تسجيل الدخول...',
  },
};

// Helper function to format dynamic messages
export const formatMessage = (message: string, value: string): string => {
  return `${message} "${value}"؟`;
};
