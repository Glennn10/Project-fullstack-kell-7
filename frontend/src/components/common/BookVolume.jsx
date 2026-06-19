import fallbackCover from '../../assets/hero.png';
import '../../styles/components/book-volume.css';

const BookVolume = ({ cover, title, className = '', draggable = false, children = null }) => (
  <div className={`physical-book${className ? ` ${className}` : ''}`}>
    {children ? <div className="physical-book__cover physical-book__cover--custom">{children}</div> : (
      <img
        src={cover || fallbackCover}
        alt={`Sampul ${title}`}
        className="physical-book__cover"
        draggable={draggable}
        loading="lazy"
        onError={(event) => { event.currentTarget.src = fallbackCover; }}
      />
    )}
    <i className="physical-book__spine" aria-hidden="true" />
  </div>
);

export default BookVolume;
