/**
 * CategoryCard.jsx — A single category card for the library home grid.
 */
import {
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility, BookOpen
} from 'lucide-react';

const ICON_MAP = {
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility,
};

export default function CategoryCard({ category, index, onClick }) {
  const Icon = ICON_MAP[category.iconKey || category.icon_key || category.icon] || BookOpen;

  return (
    <div
      className="lib-category-card"
      style={{
        animationDelay: `${index * 50}ms`,
        border: `1px solid rgba(0,0,0,0.07)`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${category.color}4D`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `rgba(0,0,0,0.07)`;
      }}
    >
      {/* Decorative blob */}
      <div
        className="lib-category-blob"
        style={{ background: category.color }}
      />

      {/* Icon */}
      <div
        className="lib-category-icon-wrap"
        style={{ background: category.lightColor || '#f0f0f0' }}
      >
        <Icon size={24} color={category.color} />
      </div>

      {/* Name */}
      <div className="lib-category-name">{category.nameBn}</div>

      {/* Count */}
      <div className="lib-category-count">{category.articleCount || 0}টি প্রবন্ধ</div>

      {/* Law reference */}
      <div className="lib-category-law" title={category.lawBn}>
        {category.lawBn}
      </div>
    </div>
  );
}
