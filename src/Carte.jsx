import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Fix obligatoire : icônes Leaflet cassées avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icône orange pour les arrêts les plus proches (Exercice 1)
const iconeProche = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône par défaut (bleue)
const iconeDefaut = new L.Icon.Default();

// Formule de Haversine : distance GPS en km
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Composant bouton "Centrer sur ma position" (Exercice 2)
function BoutonCentrer({ position }) {
  const map = useMap();

  function centrer() {
    if (position) {
      map.setView(position, 15);
    }
  }

  return (
    <button className="bouton-centrer" onClick={centrer}>
      📍 Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretsProches, setArretsProches] = useState([]);

  const DAKAR = [14.6928, -17.4467];

  // 1. Charger les arrêts depuis Flask
  useEffect(() => {
    fetch('http://localhost:5000/arrets')
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error('Erreur arrêts :', err));
  }, []);

  // 2. Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log('Géolocalisation refusée')
      );
    }
  }, []);

  // 3. Calculer les 3 arrêts les plus proches (Exercice 3)
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const avecDistances = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0],
          positionUtilisateur[1],
          a.lat,
          a.lon
        )
      }));

      const triees = avecDistances.sort((a, b) => a.distance - b.distance);
      setArretsProches(triees.slice(0, 3));
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrêts</h2>

      {arretsProches.length > 0 && (
        <div className="arrets-proches">
          <p className="arrets-proches-titre">🚏 Arrêts les plus proches :</p>
          <ol>
            {arretsProches.map(a => (
              <li key={a.id}>
                <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
              </li>
            ))}
          </ol>
        </div>
      )}

      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {positionUtilisateur && <BoutonCentrer position={positionUtilisateur} />}

        {arrets.map(a => (
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            icon={arretsProches.some(ap => ap.id === a.id) ? iconeProche : iconeDefaut}
          >
            <Popup>
              <strong>{a.nom}</strong><br />
              Lignes : {a.lignes.join(', ')}
            </Popup>
          </Marker>
        ))}

        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;