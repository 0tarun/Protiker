export const mockResponses = {
  default: {
    messageId: 'mock-001',
    content: 'আপনার সমস্যাটা আমি বুঝেছি।',
    structuredJson: {
      severity: 'serious',
      category: 'শ্রম অধিকার',
      rights: 'বাংলাদেশ শ্রম আইন ২০০৬ এর ধারা ১৩২ অনুযায়ী আপনি অপ্রদত্ত বেতন দাবি করতে পারবেন এবং অতিরিক্ত ২৫% ক্ষতিপূরণ পাওয়ার অধিকার রাখেন।',
      steps: [
        'বেতন স্লিপ, চুক্তিপত্র ও ব্যাংক স্টেটমেন্ট সংগ্রহ করুন।',
        'মালিককে লিখিত নোটিশ পাঠান বেতন দাবিতে।',
        'স্থানীয় শ্রম আদালতে আবেদন করুন।',
        'NLASO হেল্পলাইন 16699 কল করুন।',
      ],
      laws: [
        { name: 'Bangladesh Labour Act', section: 'Section 132' },
        { name: 'Bangladesh Labour Act', section: 'Section 33' },
      ],
      freeAid: 'NLASO হেল্পলাইন: 16699 (বিনামূল্যে, সার্বক্ষণিক)',
      warnings: 'দালালকে কোনো টাকা দেবেন না। ঘটনার ১২ মাসের মধ্যে মামলা করতে হবে।',
      deadline: 'ঘটনার তারিখ থেকে সর্বোচ্চ ১২ মাস।',
      office: 'ঢাকা শ্রম আদালত, পুরানা পল্টন',
    },
  },
  'পারিবারিক সহিংসতা': {
    messageId: 'mock-dv',
    content: 'আপনার সমস্যাটা আমি বুঝেছি।',
    structuredJson: {
      severity: 'urgent',
      category: 'পারিবারিক সহিংসতা',
      rights: 'পারিবারিক সহিংসতা (প্রতিরোধ ও সুরক্ষা) আইন ২০১০ অনুযায়ী আপনি সুরক্ষা আদেশ, বসবাসের অধিকার এবং ক্ষতিপূরণ পাওয়ার অধিকার রাখেন।',
      steps: [
        'নিকটতম থানায় সাধারণ ডায়েরি (জিডি) করুন।',
        'জাতীয় জরুরি সেবা 999 নম্বরে কল করুন।',
        'নিকটতম মহিলা ও শিশু বিষয়ক অধিদপ্তরে যোগাযোগ করুন।',
        'আদালতে সুরক্ষা আদেশের আবেদন করুন।',
      ],
      laws: [
        { name: 'Domestic Violence Act', section: 'Section 3' },
        { name: 'Nari o Shishu Nirjatan Ain', section: 'Section 11' },
      ],
      freeAid: 'জাতীয় জরুরি সেবা: 999 · মহিলা হেল্পলাইন: 10921',
      warnings: 'একা প্রতিশোধ নেওয়ার চেষ্টা করবেন না। নিরাপদ স্থানে যান।',
      deadline: 'সুরক্ষা আদেশ যত দ্রুত সম্ভব আবেদন করুন।',
      office: 'নিকটতম মহিলা ও শিশু বিষয়ক কার্যালয়',
    },
  },
  'জমি বিরোধ': {
    messageId: 'mock-land',
    content: 'আপনার সমস্যাটা আমি বুঝেছি।',
    structuredJson: {
      severity: 'serious',
      category: 'জমি বিরোধ',
      rights: 'ভূমি বিরোধ নিষ্পত্তি আইন ও রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০ অনুযায়ী আপনার জমির মালিকানা রক্ষার অধিকার রয়েছে।',
      steps: [
        'জমির দলিল, খতিয়ান ও মৌজা ম্যাপ সংগ্রহ করুন।',
        'ইউনিয়ন ভূমি অফিসে অভিযোগ দাখিল করুন।',
        'প্রয়োজনে দেওয়ানি আদালতে মামলা দায়ের করুন।',
        'NLASO থেকে বিনামূল্যে আইনি সহায়তা নিন।',
      ],
      laws: [
        { name: 'SAT Act 1950', section: 'Section 96' },
        { name: 'Registration Act', section: 'Section 17' },
      ],
      freeAid: 'NLASO হেল্পলাইন: 16699',
      warnings: 'জোরপূর্বক দখল নেওয়ার চেষ্টা করবেন না।',
      deadline: 'দখল হারানোর ১২ বছরের মধ্যে মামলা করতে হবে।',
      office: 'জেলা ভূমি অফিস ও দেওয়ানি আদালত',
    },
  },
};

export function getResponseForQuery(query) {
  const q = query.toLowerCase();
  if (q.includes('সহিংসতা') || q.includes('মারধর') || q.includes('পারিবারিক'))
    return mockResponses['পারিবারিক সহিংসতা'];
  if (q.includes('জমি') || q.includes('ভূমি') || q.includes('দখল'))
    return mockResponses['জমি বিরোধ'];
  return mockResponses.default;
}
