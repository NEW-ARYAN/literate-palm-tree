// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Optional: Use default CSS or add customized CSS below
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const App = () => {
  // --- MOCK DATA SIMULATIONS ---
  // In production, these will use Firebase (useFirestore) or FastAPI WebSockets.
  const [sosAlerts, setSosAlerts] = useState([
    { id: 1, title: 'Medical Emergency', loc: [30.73, 76.77], status: 'Critical', desc: 'Heart patient, Ward 7 Badali' },
    { id: 2, title: 'Structure Collapse', loc: [30.70, 76.71], status: 'Moderate', desc: 'Building tremor, Sector 15' },
    { id: 3, title: 'Trapped Family', loc: [30.76, 76.78], status: 'Critical', desc: 'Flooded house, near Sutlej bank' },
  ]);

  const [units, setUnits] = useState([
    { id: 'NDRF-1', type: 'Rescue Boat', loc: [30.735, 76.775], status: 'En Route' },
    { id: 'MED-3', type: 'Ambulance', loc: [30.705, 76.715], status: 'Available' },
    { id: 'POL-A1', type: 'Patrol Car', loc: [30.762, 76.782], status: 'On Site' },
  ]);

  const [iotSensors] = useState({
    riverLevel: 8.4,
    floodDanger: 94, // % 
    seismic: 2.1,
  });

  // Center on Badali, Punjab
  const initialMapCenter = [30.73, 76.77]; 

  return (
    <div className="disasterlink-app">
      {/* 1. TOP HEADER & KPI BAR */}
      <header className="app-header">
        <div className="header-branding">
          <h1>DisasterLink AI</h1>
          <span className="location-badge">Operational Command: Badali, Punjab, India</span>
        </div>
        <div className="kpi-bar">
          <div className="kpi-card critical">Active SOS: {sosAlerts.filter(a => a.status === 'Critical').length}</div>
          <div className="kpi-card">Available Units: {units.filter(u => u.status === 'Available').length}</div>
          <div className="kpi-card iot-danger">Flood Danger: {iotSensors.floodDanger}%</div>
        </div>
      </header>

      <main className="dashboard-layout">
        {/* 2. LEFT SIDEBAR: SOS ALERTS FEED */}
        <aside className="sos-feed">
          <h2>Real-time SOS Triage (AI Optimized)</h2>
          <div className="alert-list">
            {sosAlerts.map(alert => (
              <div key={alert.id} className={`alert-card ${alert.status.toLowerCase()}`}>
                <h3>{alert.title}</h3>
                <p>{alert.desc}</p>
                <div className="alert-actions">
                  <span className="status-tag">{alert.status}</span>
                  <button className="dispatch-btn">Dispatch Nearest Unit</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 3. CENTER: INTERACTIVE GIS MAP */}
        <section className="map-view">
          <h2>Unified Multi-Agency GIS Map</h2>
          <MapContainer center={initialMapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Render SOS Incidents */}
            {sosAlerts.map(alert => (
              <Marker key={`sos-${alert.id}`} position={alert.loc}>
                <Popup>
                  <strong>SOS: {alert.title}</strong><br/>
                  {alert.desc}<br/>
                  Status: {alert.status}
                </Popup>
              </Marker>
            ))}
            {/* Render Rescue Units (Simple Circle for variation) */}
            {units.map(unit => (
               <Marker key={`unit-${unit.id}`} position={unit.loc}>
                <Popup>
                  <strong>UNIT: {unit.id} ({unit.type})</strong><br/>
                  Status: {unit.status}
                </Popup>
               </Marker>
            ))}
          </MapContainer>
        </section>

        {/* 4. RIGHT SIDEBAR: COORDINATION & IOT FEED */}
        <aside className="coord-panel">
          <div className="agency-matrix">
            <h2>Agency Matrix (NDRF Command)</h2>
            <div className="resource-list">
               <div className="resource">Boats: 12 Active / 4 Avail</div>
               <div className="resource">Ambulances: 8 Active / 3 Avail</div>
               <div className="resource">Shelter Beds: 360 Available</div>
            </div>
          </div>
          <div className="iot-feed">
            <h2>IoT Sensor Network</h2>
            <p>Sutlej River Level: {iotSensors.riverLevel}m (DANGER)</p>
            <progress value={iotSensors.riverLevel} max="10"></progress>
            <p>Seismic Activity: {iotSensors.seismic} Richter</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;