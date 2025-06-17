// In your HistoryList component
export default function HistoryList({ history, onSelect }) {
  return (
    <div className="history-section">
      <h2>Previous Searches</h2>
      {history.map((item, index) => (
        <div 
          key={index} 
          className="history-item"
          onClick={() => onSelect(item)} // Make sure this is properly passing the item
        >
          <p>{item.city} ({item.latitude}, {item.longitude})</p>
          <small>{new Date(item.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}