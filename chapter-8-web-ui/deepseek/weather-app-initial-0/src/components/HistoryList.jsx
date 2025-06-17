export default function HistoryList({ history, onSelect }) {
    if (!history || history.length === 0) {
      return <p>No history available.</p>;
    }
  
    return (
      <div className="history-section">
        <h2>Previous Searches</h2>
        <div className="history-items">
          {history.map((item) => (
            <div 
              key={item.timestamp} 
              className="history-item"
              onClick={() => onSelect(item.latitude, item.longitude, item.days, item.city)}
            >
              <p>{item.city} ({item.latitude}, {item.longitude})</p>
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }