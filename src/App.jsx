import './App.css'
import Header from './Header'
import Footer from './Footer'
import Statistique from './Statistique'
import Statistique2 from './Statistique2'
import Statistique3 from './Statistique3'

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide à trouver
        votre ligne de bus à Dakar.</p>
        <div className="stats">
          <Statistique />
          <Statistique2 />
          <Statistique3 />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App