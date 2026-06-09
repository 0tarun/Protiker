import { useState } from 'react';

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontSize: 28, color: star <= (hover || rating) ? '#EF9F27' : '#D1D5DB',
            transition: 'transform 200ms ease'
          }}
          className="star-btn"
        >
          {star <= (hover || rating) ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
