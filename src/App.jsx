import React, { useState, useEffect } from 'react';
import CollaboratorCard from './components/CollaboratorCard';
import './index.css';

// Importa dinámicamente todos los archivos JSON en la carpeta colaboradores usando Vite
const jsonFiles = import.meta.glob('./collaborators/*.json', { eager: true });

function App() {
  const [collaborators, setCollaborators] = useState([]);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    // Almacena los colaboradores excluyendo la plantilla
    const loadedCollaborators = Object.keys(jsonFiles)
      .filter(path => !path.includes('_plantilla.json'))
      .map(path => jsonFiles[path].default || jsonFiles[path]);

    setCollaborators(loadedCollaborators);

    const canvas = document.getElementById("matrixCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = 250;

    const letters = "01";
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 40, 85, 0.08)"; // 🔵 azul institucional fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFB81C"; // 🟡 amarillo Duoc
      ctx.font = fontSize + "px monospace";

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;

        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });
    };

    const interval = setInterval(draw, 60);
    return () => clearInterval(interval);
  }, []);

  const uniqueSections = [...new Set(collaborators.map(c => c.Seccion).filter(Boolean))].sort();
  const availableSections = ['Todas', ...uniqueSections];

  const filteredCollaborators = filter === 'Todas'
    ? collaborators
    : collaborators.filter(c => c.Seccion === filter || c.Seccion === "Profesor");

  return (
    <div className="app-container">

      <header className="app-header matrix-enhanced">
        <canvas id="matrixCanvas"></canvas>

        <h1 className="glow-title">
          Aquí se forjan los mejores desarrolladores FullStack
        </h1>

        <div className="course-info">
          <h2>Generación 2026 · Duoc UC</h2>
          <p className="course-subtitle">
            Desarrollo FullStack III — Estrategias de Branching y Gestión de Componentes
          </p>
        </div>

        <p className="institutional-motto">
          Código, disciplina y trabajo en equipo.
        </p>

        <div className="quote-container">
          <p className="inspiration-quote">
            "Cada commit cuenta una historia. Cada merge construye el legado."
          </p>
        </div>
      </header>

      <main className="app-main">
        {collaborators.length > 0 && (
          <div className="filter-container">
            <span className="filter-label">Filtrar por Sección:</span>
            <div className="filter-buttons">
              {availableSections.map(sec => (
                <button
                  key={sec}
                  className={`filter-btn ${filter === sec ? 'active' : ''}`}
                  onClick={() => setFilter(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="collaborators-grid">
          {filteredCollaborators.length > 0 ? (
            filteredCollaborators.map((collab, index) => (
              <CollaboratorCard key={index} data={collab} />
            ))
          ) : (
            <div className="empty-message">
              <p>No hay colaboradores para mostrar.</p>
              <p>¡Añade tu tarjeta mediante un Pull Request!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Duoc UC - Clase de Git y Branching</p>
      </footer>
    </div>
  );
}

export default App;
