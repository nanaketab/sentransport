import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/incidents')
      .then(r => r.json())
      .then(data => setIncidents(data))
      .catch(err => console.error('Erreur incidents :', err));
  }, []);

  if (incidents.length === 0) {
    return (
      <div className="liste-incidents">
        <h3 className="liste-incidents-titre">Incidents signalés</h3>
        <p className="liste-incidents-vide">Aucun incident signalé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="liste-incidents">
      <h3 className="liste-incidents-titre">
        Incidents signalés ({incidents.length})
      </h3>
      <ul className="liste-incidents-ul">
        {incidents.map(inc => (
          <li key={inc.id} className="liste-incidents-item">
            <span className="liste-incidents-ligne">Ligne {inc.ligne}</span>
            <span className="liste-incidents-lieu">{inc.lieu}</span>
            <p className="liste-incidents-desc">{inc.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeIncidents;