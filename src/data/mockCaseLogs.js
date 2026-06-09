export const mockCases = [
  {
    id          : "case-001",
    title       : "বেতন না পাওয়া — ABC Garments",
    category    : "শ্রম অধিকার",
    categorySlug: "labour",
    severity    : "serious",
    caseStatus  : "notice_sent",
    problem     : "আমি একজন শ্রমিক। আমার মালিক আমাকে তিন মাস ধরে বেতন দিচ্ছেন না। আমি কী করতে পারি?",
    createdAt   : "2026-06-07T10:30:00",
    deadlineDate: "2026-07-07",
    deadlineNote: "ঘটনার ১২ মাসের মধ্যে মামলা করতে হবে",
    shareToken  : "share-abc123",
    documents   : [
      {
        id    : "doc-001",
        name  : "বকেয়া বেতন দাবি নোটিশ",
        status: "downloaded",
        format: "pdf",
        iconBg   : "#E1F5EE",
        iconColor: "#1D9E75"
      }
    ],
    contacts: [
      {
        id         : 2,
        name       : "BLAST",
        type       : "ngo",
        contactedAt: "2026-06-09T14:00:00",
        method     : "phone"
      }
    ],
    timeline: [
      {
        id        : "evt-001",
        type      : "chat_started",
        title     : "Proti-র সাথে কথোপকথন শুরু",
        description: "শ্রম অধিকার বিষয়ে AI পরামর্শ নেওয়া হয়েছে।",
        createdAt : "2026-06-07T10:30:00"
      },
      {
        id        : "evt-002",
        type      : "document_created",
        title     : "বকেয়া বেতন নোটিশ তৈরি হয়েছে",
        description: "Document Automator দিয়ে আইনি নোটিশ তৈরি করা হয়েছে।",
        createdAt : "2026-06-08T11:20:00",
        documentId: "doc-001"
      },
      {
        id        : "evt-003",
        type      : "status_changed",
        title: "স্ট্যাটাস আপডেট",
        description: "সমস্যা চিহ্নিত → নোটিশ পাঠানো",
        createdAt : "2026-06-08T15:00:00",
        oldStatus : "identified",
        newStatus : "notice_sent"
      },
      {
        id        : "evt-004",
        type      : "center_contacted",
        title     : "BLAST-এ যোগাযোগ করা হয়েছে",
        description: "ফোনে পরামর্শ নেওয়া হয়েছে।",
        createdAt : "2026-06-09T14:00:00",
        centerId  : 2,
        centerName: "BLAST"
      },
      {
        id        : "evt-005",
        type      : "note_added",
        title     : "নোট যোগ করা হয়েছে",
        description: "BLAST জানিয়েছে শ্রম আদালতে সরাসরি আবেদন করতে পারি।",
        createdAt : "2026-06-09T15:30:00"
      }
    ]
  },
  {
    id          : "case-002",
    title       : "বাড়িভাড়া বিরোধ — মিরপুর",
    category    : "বাড়িভাড়া",
    categorySlug: "house-rent",
    severity    : "moderate",
    caseStatus  : "identified",
    problem     : "বাড়িওয়ালা আমাকে নোটিশ ছাড়াই বের করে দিতে চাইছেন।",
    createdAt   : "2026-06-05T15:20:00",
    deadlineDate: null,
    deadlineNote: null,
    shareToken  : "share-def456",
    documents   : [
      {
        id    : "doc-002",
        name  : "অবৈধ উচ্ছেদ অভিযোগপত্র",
        status: "generated",
        format: "pdf",
        iconBg   : "#E6F1FB",
        iconColor: "#378ADD"
      }
    ],
    contacts: [],
    timeline: [
      {
        id        : "evt-006",
        type      : "chat_started",
        title     : "Proti-র সাথে কথোপকথন শুরু",
        description: "বাড়িভাড়া বিষয়ে পরামর্শ নেওয়া।",
        createdAt : "2026-06-05T15:20:00"
      },
      {
        id        : "evt-007",
        type      : "document_created",
        title     : "অভিযোগপত্র তৈরি হয়েছে",
        description: "ম্যাজিস্ট্রেট বরাবর অভিযোগপত্র।",
        createdAt : "2026-06-06T10:00:00",
        documentId: "doc-002"
      }
    ]
  },
  {
    id          : "case-003",
    title       : "ভোক্তা অধিকার — অনলাইন প্রতারণা",
    category    : "ভোক্তা অধিকার",
    categorySlug: "consumer-rights",
    severity    : "low",
    caseStatus  : "resolved",
    problem     : "অনলাইনে কেনা পণ্য নষ্ট ছিল, ফেরত দিতে অস্বীকার করছে।",
    createdAt   : "2026-05-28T09:00:00",
    deadlineDate: null,
    deadlineNote: null,
    shareToken  : "share-ghi789",
    documents   : [],
    contacts    : [],
    timeline    : [
      {
        id        : "evt-008",
        type      : "chat_started",
        title     : "কথোপকথন শুরু",
        description: "ভোক্তা অধিকার পরামর্শ।",
        createdAt : "2026-05-28T09:00:00"
      },
      {
        id        : "evt-009",
        type      : "status_changed",
        title     : "কেস সমাধান হয়েছে",
        description: "সমস্যা চিহ্নিত → সমাধান হয়েছে",
        createdAt : "2026-06-01T16:00:00",
        oldStatus : "identified",
        newStatus : "resolved"
      }
    ]
  }
];

export const mockStats = {
  totalCases   : 3,
  activeCases  : 2,
  resolvedCases: 1,
  totalDocs    : 2
};
