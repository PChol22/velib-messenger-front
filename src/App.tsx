import { useState } from 'react';
import './App.css'
import {MapContainer, Marker, TileLayer, useMapEvent, useMapEvents} from "react-leaflet";

interface Routine {
  lat: string,
  lon: string,
  email: string,
  schedule: string,
};

const App = () => {

  const getRoutines = async (email: string) => {
    setDefEmail(email);
    const r = await fetch(import.meta.env.VITE_API_URL+'/routines/' + email);
    const result = await r.json() as Routine[];
    setRoutines(result);
  }

  const deleteRoutine = async (email: string, schedule: string) => {
   await fetch(import.meta.env.VITE_API_URL+'/deleteRoutine', {
      method: 'DELETE',
      body: JSON.stringify({
        email,
        schedule,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    getRoutines(email);
  }

  const createRoutine = async (email: string, lat: number, lon: number, hours: number, minutes: number) => {
   await fetch(import.meta.env.VITE_API_URL+'/createRoutine', {
      method: 'POST',
      body: JSON.stringify({
        email,
        lat,
        lon,
        hours,
        minutes,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    getRoutines(email);
  }

  const [email, setEmail] = useState<string>('pierre.chollet@student-cs.fr');
  const [defEmail, setDefEmail] = useState<string>('');
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const position = {lat: 48.86, lng: 2.34};

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div style={{margin: '1em'}}>
      <input onChange={(e) => setEmail(e.target.value)} value={email}></input>
      <button onClick={() => getRoutines(email)} style={{ marginLeft: '1em'}}>Get routines</button>
      {routines.length > 0 && <div style={{marginTop: '1em', border: '1px solid #cccccc', padding: '1em', width: '50%', minWidth: '300px'}}>
        <p>Your routines : </p>
        { 
          routines.map(s => (
            <p key={`${s.lat}${s.lon}${s.schedule}`}> {s.schedule} - {s.lat}°N {s.lon}°E <button onClick={() => deleteRoutine(s.email, s.schedule)}>Delete</button></p>
          ))
        }
      </div>}
      
      { defEmail && 
        <div style={{ border: '1px solid #cccccc', marginTop: '1em', padding: '1em', width: '50%', minWidth: '300px'}}>
          <p>Create a new Routine for <i>{defEmail}</i></p>
          <div>
          <p>Hours : <input onChange={(e) => setHours(+e.target.value)} value={hours}></input></p>
          <p>Minutes : <input onChange={(e) => setMinutes(+e.target.value)} value={minutes}></input></p>
          </div>
          <div style={{ marginBottom: '1em'}}>
              <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{height: '300px', width: '400px'}}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { lat !== undefined && lon !== undefined && <Marker position={[lat, lon]} />}
                <MapEvents/>
              </MapContainer>
          </div>
          <button onClick={() => createRoutine(defEmail, lat ?? 0, lon ?? 0, hours ?? 0, minutes ?? 0)}>Create !</button>
        </div>
      }
    </div>
  )
}

export default App  
