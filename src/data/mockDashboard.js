/**
 * Mock data for the Protiker General Citizen Dashboard.
 * All Bengali strings are stored here — components import from this file.
 */

export const mockUser = {
  id: 1,
  name: 'রফিকুল ইসলাম',
  email: 'rafiq@email.com',
  role: 'citizen',
  division: 'ঢাকা',
  preferredLanguage: 'bn',
  createdAt: '2025-05-28',
};

export const mockStats = {
  totalSessions: 5,
  totalDocuments: 3,
  savedCases: 2,
  daysActive: 7,
};

export const mockSessions = [
  {
    id: 1,
    category: 'শ্রম অধিকার',
    severity: 'serious',
    severityIconBg: '#FAEEDA',
    severityIconColor: '#EF9F27',
    tagBg: '#FAEEDA',
    tagColor: '#854F0B',
    preview: 'আমার মালিক তিন মাস ধরে বেতন দিচ্ছেন না। আমি কী করতে পারি?',
    date: 'আজ, ১০:৩০ AM',
    messages: '৮টি বার্তা',
  },
  {
    id: 2,
    category: 'বাড়িভাড়া',
    severity: 'moderate',
    severityIconBg: '#E1F5EE',
    severityIconColor: '#1D9E75',
    tagBg: '#E1F5EE',
    tagColor: '#0F6E56',
    preview: 'বাড়িওয়ালা আমাকে নোটিশ ছাড়াই বের করে দিতে চাইছেন।',
    date: 'গতকাল, ৩:১৫ PM',
    messages: '৫টি বার্তা',
  },
  {
    id: 3,
    category: 'ভোক্তা অধিকার',
    severity: 'low',
    severityIconBg: '#E6F1FB',
    severityIconColor: '#378ADD',
    tagBg: '#E6F1FB',
    tagColor: '#185FA5',
    preview: 'অনলাইনে কেনা পণ্য নষ্ট ছিল, ফেরত দিতে অস্বীকার করছে।',
    date: '৩ দিন আগে',
    messages: '৩টি বার্তা',
  },
];

export const mockDocuments = [
  {
    id: 1,
    name: 'বকেয়া বেতন দাবি নোটিশ',
    iconBg: '#E1F5EE',
    iconColor: '#1D9E75',
    status: 'ডাউনলোড করা হয়েছে',
    statusBg: '#E1F5EE',
    statusColor: '#0F6E56',
    date: 'আজ, ১১:২০ AM',
  },
  {
    id: 2,
    name: 'অবৈধ উচ্ছেদ অভিযোগপত্র',
    iconBg: '#E6F1FB',
    iconColor: '#378ADD',
    status: 'তৈরি হয়েছে',
    statusBg: '#E6F1FB',
    statusColor: '#185FA5',
    date: 'গতকাল',
  },
  {
    id: 3,
    name: 'জিডি আবেদন (থানা)',
    iconBg: '#FAEEDA',
    iconColor: '#EF9F27',
    status: 'খসড়া',
    statusBg: '#FAEEDA',
    statusColor: '#854F0B',
    date: '৩ দিন আগে',
  },
];

export const mockTips = [
  {
    text: 'কোনো শ্রমিককে বিনা নোটিশে চাকরি থেকে বরখাস্ত করা যায় না। মালিককে অবশ্যই ১ মাসের আগাম নোটিশ বা বেতন দিতে হবে।',
    law: 'বাংলাদেশ শ্রম আইন ২০০৬, ধারা ২৬',
  },
  {
    text: 'বাড়িওয়ালা ভাড়াটেকে উচ্ছেদ করতে চাইলে আদালতের মাধ্যমে করতে হবে। নিজে এসে জোরপূর্বক বের করলে তা বেআইনি।',
    law: 'বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১',
  },
  {
    text: 'ভোক্তা অধিকার লঙ্ঘন হলে ৩০ দিনের মধ্যে ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে (DNCRP) অভিযোগ করতে পারবেন।',
    law: 'ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯',
  },
  {
    text: 'পুলিশ গ্রেফতার করলে আপনার ২৪ ঘণ্টার মধ্যে ম্যাজিস্ট্রেটের সামনে হাজির করার অধিকার আছে। এর বেশি আটকে রাখা বেআইনি।',
    law: 'ফৌজদারি কার্যবিধি ১৮৯৮',
  },
];

export const quickChips = [
  { emoji: '💰', text: 'বেতন পাচ্ছি না' },
  { emoji: '🏠', text: 'বাড়িভাড়া সমস্যা' },
  { emoji: '👩', text: 'পারিবারিক সহিংসতা' },
  { emoji: '🛒', text: 'ভোক্তা অধিকার' },
  { emoji: '👮', text: 'পুলিশ হয়রানি' },
  { emoji: '🌾', text: 'জমি বিরোধ' },
  { emoji: '💍', text: 'তালাক ও বিবাহ' },
  { emoji: '⚙️', text: 'শ্রমিক অধিকার' },
  { emoji: '👶', text: 'শিশু অধিকার' },
  { emoji: '♿', text: 'প্রতিবন্ধী অধিকার' },
];
