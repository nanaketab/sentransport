import { useState, useEffect } from 'react';
import './Meteo.css';

function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [previsions, setPrevisions] = useState([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_OWM_KEY;

    if (!API_KEY) {
      setErreur('Cle API manquante (.env)');
      return;
    }

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=Dakar&appid=${API_KEY}` +
      `&units=metric&lang=fr`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Erreur : ' + r.status);
        return r.json();
      })
      .then(data => {
        setMeteo({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          condition: data.weather[0].main,
          humidite: data.main.humidity,
          icone: data.weather[0].icon,
        });
      })
      .catch(err => setErreur(err.message));
  }, []);

  // Exercice 2 : prévisions à 5 jours, on garde les 3 prochains jours
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_OWM_KEY;
    if (!API_KEY) return;

    const url =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?q=Dakar&appid=${API_KEY}` +
      `&units=metric&lang=fr`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        // L'API renvoie des prévisions toutes les 3h.
        // On prend une prévision par jour (vers midi) pour les 3 prochains jours.
        const parJour = {};
        data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          const heure = item.dt_txt.split(' ')[1];
          if (heure === '12:00:00' && !parJour[date]) {
            parJour[date] = item;
          }
        });

        const jours = Object.keys(parJour).slice(0, 3).map(date => {
          const item = parJour[date];
          return {
            date,
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            icone: item.weather[0].icon,
          };
        });

        setPrevisions(jours);
      })
      .catch(err => console.error('Erreur prevision :', err));
  }, []);

  function getAlerte(condition) {
    if (condition === 'Rain' || condition === 'Drizzle') {
      return {
        message: 'Pluie detectee - risque de retards',
        classe: 'alerte-pluie'
      };
    }
    if (condition === 'Thunderstorm') {
      return {
        message: 'Orage en cours - soyez prudents',
        classe: 'alerte-orage'
      };
    }
    return null;
  }

  function formatJour(dateStr) {
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const d = new Date(dateStr);
    return jours[d.getDay()];
  }

  if (erreur) {
    return (
      <div className="meteo meteo-erreur">
        <p>Meteo indisponible</p>
        <p className="meteo-detail">{erreur}</p>
      </div>
    );
  }

  if (!meteo) {
    return <div className="meteo">Chargement meteo...</div>;
  }

  const alerte = getAlerte(meteo.condition);

  return (
    <div className="meteo">
      <div className="meteo-info">
        <img
          src={`https://openweathermap.org/img/wn/${meteo.icone}@2x.png`}
          alt={meteo.description}
          className="meteo-icone"
        />
        <div>
          <span className="meteo-temp">
            {meteo.temperature}&deg;C
          </span>
          <span className="meteo-desc">
            {meteo.description}
          </span>
        </div>
        <span className="meteo-humidite">
          Humidite : {meteo.humidite}%
        </span>
      </div>

      {alerte && (
        <div className={`meteo-alerte ${alerte.classe}`}>
          {alerte.message}
        </div>
      )}

      {previsions.length > 0 && (
        <div className="meteo-previsions">
          {previsions.map(p => (
            <div key={p.date} className="meteo-prevision-jour">
              <span className="meteo-prevision-nom">{formatJour(p.date)}</span>
              <img
                src={`https://openweathermap.org/img/wn/${p.icone}.png`}
                alt={p.description}
                className="meteo-prevision-icone"
              />
              <span className="meteo-prevision-temp">{p.temperature}&deg;C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Meteo;