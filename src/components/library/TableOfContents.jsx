/**
 * TableOfContents.jsx — Sticky right-column TOC with IntersectionObserver.
 */
import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ sections }) {
  const [activeId, setActiveId] = useState(sections?.[0]?.id || '');

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const sectionIds = sections.map((s) => s.id);
    const observers = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="article-sidebar-toc">
      <div className="article-sidebar-toc-header">
        <List size={14} color="#888780" />
        <span className="article-sidebar-toc-title">এই প্রবন্ধে</span>
      </div>
      <div className="toc-links">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`toc-link${activeId === section.id ? ' active' : ''}`}
            onClick={() => handleClick(section.id)}
          >
            <span className="toc-link-dot" />
            {section.heading}
          </button>
        ))}
      </div>
    </div>
  );
}
