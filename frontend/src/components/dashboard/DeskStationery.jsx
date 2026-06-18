import '../../styles/components/desk-stationery.css';

const defaultItems = ['ruler', 'writing-tools', 'highlighter', 'clips', 'stapler', 'pencil-cup'];

const DeskStationery = ({ items = defaultItems, className = '' }) => {
  const visibleItems = new Set(items);

  return (
    <div className={`desk-stationery${className ? ` ${className}` : ''}`} aria-hidden="true">
      {visibleItems.has('ruler') && (
        <span className="desk-ruler"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
      )}
      {visibleItems.has('writing-tools') && (
        <span className="desk-writing-tools"><i /><b /></span>
      )}
      {visibleItems.has('highlighter') && (
        <span className="desk-highlighter"><i /><b /></span>
      )}
      {visibleItems.has('clips') && (
        <span className="desk-clips"><i /><i /><i /></span>
      )}
      {visibleItems.has('stapler') && (
        <span className="desk-stapler"><i /><b /></span>
      )}
      {visibleItems.has('pencil-cup') && (
        <span className="desk-pencil-cup">
          <i className="desk-pencil desk-pencil--one" />
          <i className="desk-pencil desk-pencil--two" />
          <i className="desk-pencil desk-pencil--three" />
          <b />
        </span>
      )}
    </div>
  );
};

export default DeskStationery;
