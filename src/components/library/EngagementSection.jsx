/**
 * EngagementSection.jsx — Helpful / Not Helpful voting section.
 */
import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import libraryService from '../../services/libraryService';

export default function EngagementSection({ article }) {
  const [helpfulCount, setHelpfulCount] = useState(article.helpfulCount || 0);
  const [notHelpfulCount, setNotHelpfulCount] = useState(article.notHelpfulCount || 0);
  const [voted, setVoted] = useState(null); // 'helpful' | 'not_helpful'
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleHelpful = async () => {
    if (voted) return;
    setHelpfulCount((c) => c + 1);
    setVoted('helpful');
    try {
      await libraryService.voteArticle(article.id, true);
    } catch (error) {
      console.error("Failed to vote", error);
    }
  };

  const handleNotHelpful = async () => {
    if (voted) return;
    setNotHelpfulCount((c) => c + 1);
    setVoted('not_helpful');
    setShowFeedback(true);
    try {
      await libraryService.voteArticle(article.id, false);
    } catch (error) {
      console.error("Failed to vote", error);
    }
  };

  const handleFeedbackSubmit = () => {
    // In a real app, send feedbackText to backend
    setFeedbackSubmitted(true);
    setShowFeedback(false);
  };

  return (
    <div className="article-engagement">
      <p className="article-engagement-q">এই প্রবন্ধ কি আপনার কাজে লেগেছে?</p>

      <div className="article-engagement-btns">
        <button
          id="btn-helpful"
          className={`engagement-btn helpful${voted === 'helpful' ? ' selected' : ''}${voted === 'not_helpful' ? ' faded' : ''}`}
          onClick={handleHelpful}
          disabled={!!voted}
        >
          <ThumbsUp size={16} />
          👍 হ্যাঁ ({helpfulCount})
        </button>
        <button
          id="btn-not-helpful"
          className={`engagement-btn not-helpful${voted === 'not_helpful' ? ' selected' : ''}${voted === 'helpful' ? ' faded' : ''}`}
          onClick={handleNotHelpful}
          disabled={!!voted}
        >
          <ThumbsDown size={16} />
          👎 না ({notHelpfulCount})
        </button>
      </div>

      {voted === 'helpful' && (
        <p className="engagement-thank-msg">
          ধন্যবাদ! আপনার মতামত গ্রহণ করা হয়েছে।
        </p>
      )}

      {showFeedback && !feedbackSubmitted && (
        <div className="engagement-feedback-wrap">
          <p className="engagement-feedback-label">কীভাবে উন্নত করা যায় বলুন?</p>
          <textarea
            className="engagement-textarea"
            placeholder="কীভাবে উন্নত করা যায় বলুন?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <button className="engagement-submit-btn" onClick={handleFeedbackSubmit}>
            মতামত দিন
          </button>
        </div>
      )}

      {feedbackSubmitted && (
        <p className="engagement-thank-msg">ধন্যবাদ! আপনার মতামত গ্রহণ করা হয়েছে।</p>
      )}
    </div>
  );
}
