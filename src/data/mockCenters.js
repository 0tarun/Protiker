export const mockUserLocation = {
  latitude: 23.6238,
  longitude: 90.5000,
  label: "নারায়ণগঞ্জ, ঢাকা"
};

export const mockCenters = [
  {
    id: 1,
    name_bn: "জাতীয় আইনগত সহায়তা সংস্থা",
    name_en: "National Legal Aid Services Organisation",
    short_name: "NLASO",
    slug: "nlaso-dhaka",
    center_type: "government_legal_aid",
    division: "ঢাকা",
    district: "ঢাকা",
    address_bn: "বার কাউন্সিল ভবন, ঢাকা",
    latitude: 23.7280,
    longitude: 90.3988,
    is_free: true,
    has_women_desk: true,
    has_wheelchair_access: false,
    languages_supported: "bn,en",
    verified: "verified",
    avg_safety_rating: 4.2,
    total_ratings: 89,
    description_bn: "রাষ্ট্রীয় আইনি সহায়তা প্রতিষ্ঠান। নিম্ন আয়ের মানুষদের বিনামূল্যে আইনি সেবা প্রদান করে।",
    specializations: [
      { category: "শ্রম অধিকার", level: "secondary" },
      { category: "নারী অধিকার", level: "secondary" },
      { category: "পারিবারিক সহিংসতা", level: "secondary" },
      { category: "জমি ও সম্পত্তি", level: "secondary" }
    ],
    contacts: [
      { type: "toll_free", value: "16699", label_bn: "হেল্পলাইন", is_primary: true },
      { type: "website", value: "https://nlaso.gov.bd", label_bn: "ওয়েবসাইট", is_primary: false }
    ],
    hours: [
      { day: 0, opens: "09:00", closes: "17:00", closed: false },
      { day: 1, opens: "09:00", closes: "17:00", closed: false },
      { day: 2, opens: "09:00", closes: "17:00", closed: false },
      { day: 3, opens: "09:00", closes: "17:00", closed: false },
      { day: 4, opens: "09:00", closes: "17:00", closed: false },
      { day: 5, opens: null, closes: null, closed: true },
      { day: 6, opens: null, closes: null, closed: true }
    ],
    isRecommended: true,
    matchReason: "category_match",
    matchScore: 0.92,
    distanceKm: 2.3,
    ratings: {
      staff_friendliness: 4.1,
      wait_time: 3.8,
      ease_of_process: 4.0,
      felt_safe: 4.5
    },
    recentReviews: [
      {
        stars: 5,
        comment: "কর্মীরা খুব সহযোগী ছিলেন। আমার শ্রম মামলায় বিনামূল্যে সাহায্য করেছেন।",
        date: "২০২৬-০৫-১৫"
      },
      {
        stars: 4,
        comment: "একটু অপেক্ষা করতে হয়েছিল কিন্তু সেবা ভালো।",
        date: "২০২৬-০৪-২৮"
      }
    ]
  },
  {
    id: 2,
    name_bn: "বাংলাদেশ লিগ্যাল এইড অ্যান্ড সার্ভিসেস ট্রাস্ট",
    name_en: "Bangladesh Legal Aid and Services Trust",
    short_name: "BLAST",
    slug: "blast-dhaka",
    center_type: "ngo",
    division: "ঢাকা",
    district: "ঢাকা",
    address_bn: "১/১ সেনবাড়ি, সার্কিট হাউস রোড, ঢাকা",
    latitude: 23.7320,
    longitude: 90.3870,
    is_free: true,
    has_women_desk: true,
    has_wheelchair_access: false,
    languages_supported: "bn,en",
    verified: "verified",
    avg_safety_rating: 4.5,
    total_ratings: 134,
    description_bn: "বাংলাদেশের শীর্ষস্থানীয় আইনি সহায়তা এনজিও। শ্রমিক, নারী ও সুবিধাবঞ্চিতদের জন্য বিনামূল্যে আইনি সেবা।",
    specializations: [
      { category: "শ্রম অধিকার", level: "primary" },
      { category: "নারী অধিকার", level: "primary" },
      { category: "মানবাধিকার", level: "primary" }
    ],
    contacts: [
      { type: "phone", value: "+880-2-8315185", label_bn: "প্রধান কার্যালয়", is_primary: true },
      { type: "whatsapp", value: "+880-1711-000000", label_bn: "WhatsApp", is_primary: false },
      { type: "website", value: "https://blast.org.bd", label_bn: "ওয়েবসাইট", is_primary: false }
    ],
    hours: [
      { day: 0, opens: "09:00", closes: "17:00", closed: false },
      { day: 1, opens: "09:00", closes: "17:00", closed: false },
      { day: 2, opens: "09:00", closes: "17:00", closed: false },
      { day: 3, opens: "09:00", closes: "17:00", closed: false },
      { day: 4, opens: "09:00", closes: "17:00", closed: false },
      { day: 5, opens: null, closes: null, closed: true },
      { day: 6, opens: null, closes: null, closed: true }
    ],
    isRecommended: true,
    matchReason: "specialization_match",
    matchScore: 0.88,
    distanceKm: 3.1,
    ratings: {
      staff_friendliness: 4.6,
      wait_time: 4.2,
      ease_of_process: 4.4,
      felt_safe: 4.7
    },
    recentReviews: []
  },
  {
    id: 3,
    name_bn: "আইন ও সালিশ কেন্দ্র",
    name_en: "Ain o Salish Kendra",
    short_name: "ASK",
    slug: "ask-dhaka",
    center_type: "ngo",
    division: "ঢাকা",
    district: "ঢাকা",
    address_bn: "২৬/৩ শ্যামলী, ঢাকা ১২০৭",
    latitude: 23.7510,
    longitude: 90.3840,
    is_free: true,
    has_women_desk: true,
    has_wheelchair_access: true,
    languages_supported: "bn,en",
    verified: "verified",
    avg_safety_rating: 4.3,
    total_ratings: 76,
    description_bn: "নারী অধিকার ও মানবাধিকার বিষয়ে বিশেষজ্ঞ সংস্থা।",
    specializations: [
      { category: "নারী অধিকার", level: "primary" },
      { category: "পারিবারিক সহিংসতা", level: "primary" },
      { category: "শিশু অধিকার", level: "primary" },
      { category: "পুলিশ ও গ্রেফতার", level: "primary" }
    ],
    contacts: [
      { type: "phone", value: "+880-2-9123751", label_bn: "অফিস ফোন", is_primary: true },
      { type: "email", value: "ask@askbd.org", label_bn: "ইমেইল", is_primary: false },
      { type: "website", value: "https://askbd.org", label_bn: "ওয়েবসাইট", is_primary: false }
    ],
    hours: [
      { day: 0, opens: "09:30", closes: "17:30", closed: false },
      { day: 1, opens: "09:30", closes: "17:30", closed: false },
      { day: 2, opens: "09:30", closes: "17:30", closed: false },
      { day: 3, opens: "09:30", closes: "17:30", closed: false },
      { day: 4, opens: "09:30", closes: "17:30", closed: false },
      { day: 5, opens: null, closes: null, closed: true },
      { day: 6, opens: null, closes: null, closed: true }
    ],
    isRecommended: false,
    distanceKm: 5.7,
    ratings: {
      staff_friendliness: 4.4,
      wait_time: 4.0,
      ease_of_process: 4.2,
      felt_safe: 4.5
    },
    recentReviews: []
  },
  {
    id: 4,
    name_bn: "ঢাকা জেলা জজ আদালত",
    name_en: "Dhaka District Court",
    short_name: null,
    slug: "dhaka-district-court",
    center_type: "court",
    division: "ঢাকা",
    district: "ঢাকা",
    address_bn: "পুরানা পল্টন, ঢাকা ১০০০",
    latitude: 23.7280,
    longitude: 90.4150,
    is_free: false,
    has_women_desk: false,
    has_wheelchair_access: true,
    languages_supported: "bn",
    verified: "verified",
    avg_safety_rating: 3.6,
    total_ratings: 201,
    description_bn: "ঢাকার প্রধান দেওয়ানি ও ফৌজদারি আদালত।",
    specializations: [
      { category: "জমি ও সম্পত্তি", level: "primary" },
      { category: "শ্রম অধিকার", level: "secondary" }
    ],
    contacts: [
      { type: "phone", value: "+880-2-9559988", label_bn: "অফিস", is_primary: true }
    ],
    hours: [
      { day: 0, opens: "10:00", closes: "16:30", closed: false },
      { day: 1, opens: "10:00", closes: "16:30", closed: false },
      { day: 2, opens: "10:00", closes: "16:30", closed: false },
      { day: 3, opens: "10:00", closes: "16:30", closed: false },
      { day: 4, opens: "10:00", closes: "16:30", closed: false },
      { day: 5, opens: null, closes: null, closed: true },
      { day: 6, opens: null, closes: null, closed: true }
    ],
    isRecommended: false,
    distanceKm: 7.2,
    ratings: {
      staff_friendliness: 3.2,
      wait_time: 3.0,
      ease_of_process: 3.5,
      felt_safe: 4.2
    },
    recentReviews: []
  },
  {
    id: 5,
    name_bn: "নারায়ণগঞ্জ সদর মডেল থানা",
    name_en: "Narayanganj Sadar Model Police Station",
    short_name: null,
    slug: "narayanganj-sadar-thana",
    center_type: "police_station",
    division: "ঢাকা",
    district: "নারায়ণগঞ্জ",
    address_bn: "সদর রোড, নারায়ণগঞ্জ",
    latitude: 23.6239,
    longitude: 90.4998,
    is_free: true,
    has_women_desk: true,
    has_wheelchair_access: false,
    languages_supported: "bn",
    verified: "community",
    avg_safety_rating: 3.2,
    total_ratings: 34,
    description_bn: "স্থানীয় পুলিশ স্টেশন। জিডি দায়ের ও অভিযোগ জানানোর জন্য।",
    specializations: [
      { category: "পুলিশ ও গ্রেফতার", level: "primary" },
      { category: "নারী অধিকার", level: "secondary" }
    ],
    contacts: [
      { type: "phone", value: "01769-693399", label_bn: "থানা ফোন", is_primary: true }
    ],
    hours: [
      { day: 0, opens: "00:00", closes: "23:59", closed: false },
      { day: 1, opens: "00:00", closes: "23:59", closed: false },
      { day: 2, opens: "00:00", closes: "23:59", closed: false },
      { day: 3, opens: "00:00", closes: "23:59", closed: false },
      { day: 4, opens: "00:00", closes: "23:59", closed: false },
      { day: 5, opens: "00:00", closes: "23:59", closed: false },
      { day: 6, opens: "00:00", closes: "23:59", closed: false }
    ],
    isRecommended: false,
    distanceKm: 0.4,
    ratings: {
      staff_friendliness: 3.0,
      wait_time: 3.4,
      ease_of_process: 3.1,
      felt_safe: 3.2
    },
    recentReviews: []
  }
];
