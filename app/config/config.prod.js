module.exports = {
  baseUrl: 'http://section.cyberatest.com.au',
  apiUrl: 'http://api.develop.cyberatest.com.au/api',
  accesses: {
    Cybera: {
      Merchant: 'Merchant',
      Campaign: 'Campaign',
      Discount: 'Discount',
      Staff: 'Staff',
      Report: 'Report',
      FileManager: 'FileManager',
    },
    Merchant: {
      Order: 'Order',
      Message: 'Message',
      Product: 'Product',
      PlanManagement: 'PlanManagement',
      SubscriptionManagement: 'SubscriptionManagement',
      StaffManagement: 'StaffManagement',
      ShippingManagement: 'ShippingManagement',
      Blog: 'Blog',
      Staff: 'Staff',
      Report: 'Report',
      Extension: 'Extension',
      FileManager: 'FileManager',
      PaymentManagement: 'PaymentManagement',
      ShopManagement: 'ShopManagement',
      CustomerManagement: 'CustomerManagement',
      WebsiteManager: 'WebsiteManager',
    },
  },

  roles: {
    Merchant: 'Merchant',
    Cybera: 'Cybera',
    MerchantOrCybera: 'MerchantOrCybera',
  },

  facebookApi: {
    appId: '1829979540605581',
    xfbml: false,
    cookie: false,
    reAuthenticate: false,
    scope: 'email',
    autoLoad: true,
    fields: 'name, email ,picture',
    version: '2.7',
    language: 'en_US',
  },

  defaultCountryID: 573,

  plans: [
    {
      Id: 1,
      Name: 'Web Only',
      Price: 19,
      PricePerYear: 205,
      SubTitle: '(no e-commerce)',
      storage: 1,
      isEcommerce: false,
    },
    {
      Id: 2,
      Name: 'Business',
      Price: 29,
      PricePerYear: 315,
      SubTitle: '',
      storage: 5,
      products: 100,
      isEcommerce: true,
    },
    {
      Id: 3,
      Name: 'Enterprise',
      Price: 65,
      PricePerYear: 745,
      SubTitle: '',
      storage: 20,
      products: 500,
      isEcommerce: true,
    },
    {
      Id: 4,
      Name: 'Unlimited',
      Price: 145,
      PricePerYear: 1699,
      SubTitle: '',
      storage: 'Unlimited',
      products: 'Unlimited',
      isEcommerce: true,
      isFreePremiumTemplate: true,
    },
  ],

  allowedFileTypes: {
    font: ['TTF', 'OTF', 'WOFF', 'WOFF2'],
    image: ['JPEG', 'PNG', 'GIF', 'JPG'],
    video: ['AVI', 'MPEG', 'MPG', 'MPE', 'MP4', 'MKV', 'WEBM', 'MOV', 'OGV', 'VOB', 'M4V', '3GP', 'DIVX', 'XVID'],
    document: ['DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'ODT', 'ODP', 'PDF'],
  },
};
