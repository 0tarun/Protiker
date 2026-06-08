/**
 * Mock data for Protiker Feature 2 — Smart Document Automator.
 * Document list, stats, and status configuration.
 */

export const mockDocuments = [
  {
    id: 'doc-001',
    templateSlug: 'unpaid-salary-notice',
    name: 'বকেয়া বেতন দাবি নোটিশ',
    status: 'downloaded',
    generationMethod: 'chat_linked',
    language: 'bn',
    format: 'pdf',
    createdAt: '2026-06-07T10:30:00',
    downloadCount: 2,
    iconBg: '#E1F5EE',
    iconColor: '#1D9E75',
  },
  {
    id: 'doc-002',
    templateSlug: 'illegal-eviction-complaint',
    name: 'অবৈধ উচ্ছেদ অভিযোগপত্র',
    status: 'generated',
    generationMethod: 'standalone',
    language: 'bn',
    format: 'pdf',
    createdAt: '2026-06-06T15:20:00',
    downloadCount: 0,
    iconBg: '#E6F1FB',
    iconColor: '#378ADD',
  },
  {
    id: 'doc-003',
    templateSlug: 'general-diary-draft',
    name: 'জিডি আবেদন (থানা)',
    status: 'draft',
    generationMethod: 'standalone',
    language: 'bn',
    format: 'pdf',
    createdAt: '2026-06-04T09:00:00',
    downloadCount: 0,
    iconBg: '#FAEEDA',
    iconColor: '#EF9F27',
  },
];

export const mockDocStats = {
  totalDocs: 3,
  downloaded: 1,
  drafts: 1,
  submitted: 1,
};

export const docStatusConfig = {
  draft: {
    bg: '#FAEEDA',
    color: '#854F0B',
    text: 'খসড়া · Draft',
  },
  generated: {
    bg: '#E6F1FB',
    color: '#185FA5',
    text: 'তৈরি হয়েছে · Generated',
  },
  downloaded: {
    bg: '#E1F5EE',
    color: '#0F6E56',
    text: 'ডাউনলোড · Downloaded',
  },
  submitted: {
    bg: '#EAF3DE',
    color: '#3B6D11',
    text: 'জমা দেওয়া · Submitted',
  },
};
