import { useState, useCallback } from 'react';
import './App.css';

interface PanelData {
  id: string;
  title: string;
  icon: string;
  sections: string[];
  link: string;
}

const leftPanels: PanelData[] = [
  { id: 'mission', title: 'MISSION', icon: '◈', sections: ['Orbital Insertion', 'Trajectory Analysis', 'Window Status'], link: '#mission' },
  { id: 'research', title: 'RESEARCH', icon: '◇', sections: ['Data Collection', 'Spectroscopy', 'Signal Processing'], link: '#research' },
  { id: 'telemetry', title: 'TELEMETRY', icon: '▣', sections: ['Power: 98.7%', 'Temp: -12.4°C', 'Altitude: 408km'], link: '#telemetry' },
];

const rightPanels: PanelData[] = [
  { id: 'systems', title: 'SYSTEMS', icon: '⬡', sections: ['Thermal Control', 'Propulsion', 'Power Grid'], link: '#systems' },
  { id: 'history', title: 'HISTORY', icon: '○', sections: ['Launch Date', 'Orbit Count', 'Data Points'], link: '#history' },
  
];

interface ClickableArea {
  id: string;
  label: string;
  link: string;
}

const solarPanelAreas: ClickableArea[] = [
  { id: 'solar-1', label: 'Port Array A', link: '#solar-port-a' },
  { id: 'solar-2', label: 'Port Array B', link: '#solar-port-b' },
  { id: 'solar-3', label: 'Port Array C', link: '#solar-port-c' },
  { id: 'solar-4', label: 'Starboard Array A', link: '#solar-star-a' },
  { id: 'solar-5', label: 'Starboard Array B', link: '#solar-star-b' },
  { id: 'solar-6', label: 'Starboard Array C', link: '#solar-star-c' },
];

const satelliteBodyParts: ClickableArea[] = [
  { id: 'main-body', label: 'Core Module', link: '#core-module' },
  { id: 'dish', label: 'Communication Array', link: '#comm-array' },
  { id: 'engine', label: 'Propulsion System', link: '#propulsion' },
  { id: 'golden-foil', label: 'Thermal Protection', link: '#thermal' },
];

function UIPanel({ panel, index, side }: { panel: PanelData; index: number; side: 'left' | 'right' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={panel.link}
      className={`ui-panel ${side} depth-${index}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--delay': `${index * 0.1}s`,
        '--glow-intensity': isHovered ? '1' : '0.3',
      } as React.CSSProperties}
    >
      <div className="panel-header">
        <span className="panel-icon">{panel.icon}</span>
        <span className="panel-title">{panel.title}</span>
      </div>
      <div className="panel-grid">
        {panel.sections.map((section, i) => (
          <div key={i} className="grid-cell">
            <span className="cell-label">{section.split(':')[0]}</span>
            <span className="cell-value">
              {section.includes(':') ? section.split(':')[1] : <span className="status-dot" />}
            </span>
          </div>
        ))}
      </div>
      <div className="panel-footer">
        <span className="view-details">View Details →</span>
      </div>
      <div className="panel-reflection" />
      <div className={`panel-glow ${isHovered ? 'active' : ''}`} />
    </a>
  );
}

function Satellite() {
  const [activePart, setActivePart] = useState<string | null>(null);

  const handlePartClick = useCallback((id: string, link: string) => {
    setActivePart(id);
    console.log(`Clicked: ${id} -> ${link}`);
  }, []);

  return (
    <div className="satellite-container">
      {/* Solar Panel Wings - Left */}
      <div className="solar-wings left-wings">
        {[0, 1, 2].map((i) => (
          <button
            key={`left-${i}`}
            className={`solar-panel left-panel panel-${i}`}
            onClick={() => handlePartClick(solarPanelAreas[i].id, solarPanelAreas[i].link)}
            data-tooltip={solarPanelAreas[i].label}
            style={{ '--panel-index': i } as React.CSSProperties}
          >
            <div className="panel-surface">
              <div className="photovoltaic-grid">
                {Array.from({ length: 12 }).map((_, j) => (
                  <div key={j} className="pv-cell" />
                ))}
              </div>
              <div className="panel-edge-glow" />
              <div className="panel-frame">
                <div className="frame-hinge" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Satellite Body */}
      <div className="satellite-body">
        <button
          className={`body-segment main-body ${activePart === 'main-body' ? 'active' : ''}`}
          onClick={() => handlePartClick('main-body', '#core-module')}
          data-tooltip="Core Module"
        >
          <div className="body-surface">
            <div className="aluminum-texture" />
            <div className="panel-lines">
              <div className="line-h line-1" />
              <div className="line-h line-2" />
              <div className="line-v line-1" />
              <div className="line-v line-2" />
            </div>
            <div className="screws">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`screw screw-${i}`}>
                  <div className="screw-head" />
                </div>
              ))}
            </div>
            <div className="status-indicators">
              <div className="status-led green" />
              <div className="status-led amber" />
              <div className="status-led blue" />
            </div>
            <div className="body-label">SCS-7</div>
          </div>
        </button>

        <button
          className={`body-segment golden-foil ${activePart === 'golden-foil' ? 'active' : ''}`}
          onClick={() => handlePartClick('golden-foil', '#thermal')}
          data-tooltip="Thermal Protection"
        >
          <div className="foil-surface">
            <div className="foil-pattern">
              <div className="foil-fold" />
              <div className="foil-fold" />
              <div className="foil-fold" />
            </div>
            <div className="foil-shimmer" />
          </div>
        </button>

        <button
          className={`body-segment comm-dish ${activePart === 'dish' ? 'active' : ''}`}
          onClick={() => handlePartClick('dish', '#comm-array')}
          data-tooltip="Communication Array"
        >
          <div className="dish-surface">
            <div className="dish-parabola" />
            <div className="dish-ribs">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rib" />
              ))}
            </div>
            <div className="dish-feed" />
            <div className="dish-glow" />
          </div>
        </button>

        <button
          className={`body-segment engine ${activePart === 'engine' ? 'active' : ''}`}
          onClick={() => handlePartClick('engine', '#propulsion')}
          data-tooltip="Propulsion System"
        >
          <div className="engine-surface">
            <div className="nozzle">
              <div className="nozzle-inner" />
              <div className="nozzle-glow" />
            </div>
            <div className="engine-detail" />
          </div>
        </button>

        <div className="body-wiring">
          <svg viewBox="0 0 200 300" className="wiring-svg">
            <path d="M80,50 Q100,100 80,150" stroke="#4a9eff" strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M120,50 Q100,100 120,150" stroke="#4a9eff" strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M90,100 L90,200" stroke="#8892a8" strokeWidth="1" fill="none" />
            <path d="M110,100 L110,200" stroke="#8892a8" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Solar Panel Wings - Right */}
      <div className="solar-wings right-wings">
        {[0, 1, 2].map((i) => (
          <button
            key={`right-${i}`}
            className={`solar-panel right-panel panel-${i}`}
            onClick={() => handlePartClick(solarPanelAreas[i + 3].id, solarPanelAreas[i + 3].link)}
            data-tooltip={solarPanelAreas[i + 3].label}
            style={{ '--panel-index': i } as React.CSSProperties}
          >
            <div className="panel-surface">
              <div className="photovoltaic-grid">
                {Array.from({ length: 12 }).map((_, j) => (
                  <div key={j} className="pv-cell" />
                ))}
              </div>
              <div className="panel-edge-glow" />
              <div className="panel-frame">
                <div className="frame-hinge" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="center-bloom" />
    </div>
  );
}

function Starfield() {
  return (
    <div className="starfield">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.3 + Math.random() * 0.7,
          }}
        />
      ))}
    </div>
  );
}

function EarthGlow() {
  return (
    <div className="earth-glow">
      <div className="glow-gradient" />
      <div className="glow-atmosphere" />
    </div>
  );
}

function App() {
  const [clickedElement, setClickedElement] = useState<string | null>(null);

  const handleNavigation = useCallback((link: string, label: string) => {
    setClickedElement(label);
    console.log(`Navigate to: ${link}`);
  }, []);

  return (
    <div className="app">
      <div className="space-background">
        <Starfield />
        <EarthGlow />
        <div className="ambient-glow" />
      </div>

      <div className="hero-section">
        <div className="hero-header">
          <h1 className="hero-title">
            <span className="title-main">ORBITAL COMMAND</span>
            <span className="title-accent" />
          </h1>
          <p className="hero-subtitle">Real-time spacecraft monitoring and mission control</p>
        </div>

        <div className="interface-container">
          <div className="panel-column left-column">
            {leftPanels.map((panel, i) => (
              <UIPanel key={panel.id} panel={panel} index={i} side="left" />
            ))}
          </div>

          <div className="satellite-wrapper">
            <Satellite />
          </div>

          <div className="panel-column right-column">
            {rightPanels.map((panel, i) => (
              <UIPanel key={panel.id} panel={panel} index={i} side="right" />
            ))}
          </div>
        </div>

        <div className="status-bar">
          <div className="status-item">
            <span className="status-indicator online" />
            <span className="status-text">SYSTEM ONLINE</span>
          </div>
          <div className="status-item">
            <span className="status-label">UPTIME:</span>
            <span className="status-value">147d 08h 23m</span>
          </div>
          <div className="status-item">
            <span className="status-label">SIGNAL:</span>
            <span className="status-value excellent">EXCELLENT</span>
          </div>
          <div className="status-item">
            <span className="status-label">POSITION:</span>
            <span className="status-value">42.3°N 71.1°W</span>
          </div>
        </div>
      </div>

      {clickedElement && (
        <div className="click-feedback" onClick={() => setClickedElement(null)}>
          <div className="feedback-content">
            <span className="feedback-icon">✓</span>
            <span className="feedback-text">Selected: {clickedElement}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;