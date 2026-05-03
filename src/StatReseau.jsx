import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((sum, l) => sum + l.arrets, 0);
  const ligneMax = lignes.reduce((max, l) => l.arrets > max.arrets ? l : max, lignes[0]);

  return (
    <div className="stat-reseau">
      <div className="stat-item">
        <span className="stat-chiffre">{totalLignes}</span>
        <span className="stat-libelle">lignes</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">{totalArrets}</span>
        <span className="stat-libelle">arrêts au total</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">{ligneMax.numero}</span>
        <span className="stat-libelle">ligne la plus longue</span>
      </div>
    </div>
  );
}

export default StatReseau;