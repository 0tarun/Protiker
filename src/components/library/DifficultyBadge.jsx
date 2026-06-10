/**
 * DifficultyBadge.jsx — Shows difficulty level of an article.
 */
export default function DifficultyBadge({ difficulty }) {
  const labels = {
    easy: 'সহজ',
    medium: 'মাঝারি',
    advanced: 'বিস্তারিত',
  };
  return (
    <span className={`lib-difficulty-badge ${difficulty}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}
