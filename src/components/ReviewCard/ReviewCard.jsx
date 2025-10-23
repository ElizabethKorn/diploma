import "./ReviewCard.css";

const ReviewCard = ({ author, text, photo }) => {
  return (
    <div className="review-card">
      <div className="review-left">
        <img src={photo} alt={author} className="review-photo" />
      </div>
      <div className="review-right">
        <h3 className="review-author">{author}</h3>
        <p className="review-text">
          <em>"{text}"</em>
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
