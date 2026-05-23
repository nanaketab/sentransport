
import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import ListeLignes from './ListeLignes';
import Footer from './Footer';
import StatReseau from './StatReseau';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) throw new Error("Erreur : " + response.status);
        return response.json();
      })
      .then(data => { setLignes(data); setChargement(false); })
      .catch(error => { setErreur(error.message); setChargement(false); });
  }

  function handleClickLigne(ligne) {
    fetch("http://localhost:5000/lignes/" + ligne.id)
      .then(response => response.json())
      .then(data => setLigneSelectionnee(data));
  }

  useEffect(() => { chargerLignes(); }, []);

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <button onClick={chargerLignes} className="btn-recharger">
          🔄 Recharger
        </button>
        <StatReseau lignes={lignes} />
        <ListeLignes lignes={lignes} onClickLigne={handleClickLigne} />
        {ligneSelectionnee && (
          <div className="detail-ligne">
            <h3>Ligne {ligneSelectionnee.numero} — {ligneSelectionnee.depart} → {ligneSelectionnee.arrivee}</h3>
            <p>{ligneSelectionnee.arrets} arrêts</p>
            <ul>
              {ligneSelectionnee.listeArrets.map((arret, i) => (
                <li key={i}>{arret}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;