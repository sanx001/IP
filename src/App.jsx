import React, { useState, useEffect } from "react";
import Map, { Popup, Marker } from "react-map-gl";
import { RiMapPin2Fill } from "react-icons/ri";
import "./App.css";
import TracingLoader from "./TracingLoader";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FucHIwMDEiLCJhIjoiY21kam9pOXo1MG9sNzJrc2Nkb2JmcG9weSJ9.tuSiMvVehhrxVtugaPyiPg";

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function App() {
  const [ip, setIP] = useState("");
  const [location, setLocation] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);



const getMyIPLocation = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://ipinfo.io/json?token=8507a77ccd3e73");
    const data = await res.json();
    const [latitude, longitude] = data.loc.split(',').map(Number);

    const formatted = {
      ...data,
      latitude,
      longitude,
      country_name: data.country,
      region: data.region,
      city: data.city,
      org: data.org
    };
setTimeout(() => {
  document.querySelector('.hud-loader')?.classList.add('fade-out');
}, 9000); // after 3 seconds

    setTimeout(() => {
      setUserLoc(formatted);  // Move this inside timeout
      setLocation(formatted); // Show data only after 4 seconds
      setLoading(false);      // Stop loader
    }, 9000);

  } catch (error) {
    console.error("Failed to fetch user location:", error);
    setLoading(false);
  }
};


const getIPLocation = async () => {
  if (!ip) return;
  setLoading(true);
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json?token=8507a77ccd3e73`);
    const data = await res.json();
    const [latitude, longitude] = data.loc.split(',').map(Number);

    const formatted = {
      ...data,
      latitude,
      longitude,
      country_name: data.country,
      region: data.region,
      city: data.city,
      org: data.org
    };
    setTimeout(() => {
  document.querySelector('.hud-loader')?.classList.add('fade-out');
}, 9000); // after 3 seconds


    setTimeout(() => {
      setLocation(formatted);
      setLoading(false);  // ✅ Stop loader
    }, 9000);

  } catch (error) {
    console.error("Failed to fetch IP location:", error);
    setLoading(false); // ✅ Ensure loader stops on error
  }
};




  const handleReset = () => {
    setLocation(null);
    setShowInput(false);
    setIP("");
    setShowPopup(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLoc({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ip: "You",
        });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (
      userLoc &&
      location &&
      userLoc.latitude &&
      userLoc.longitude &&
      location.latitude &&
      location.longitude
    ) {
      const dist = getDistance(
        userLoc.latitude,
        userLoc.longitude,
        location.latitude,
        location.longitude
      );
      setDistance(dist.toFixed(2));
    }
  }, [userLoc, location]);

 useEffect(() => {
  
  const forward = document.getElementById("forwardVideo");
  const reverse = document.getElementById("reverseVideo");

  if (!forward || !reverse) return;

  // Ensure both are ready before starting
  const startLoop = () => {
    forward.currentTime = 0;
    reverse.currentTime = 0;

    forward.classList.add("active");
    reverse.classList.remove("active");

    forward.play().catch(() => {});
  };

  // Wait for user interaction to allow autoplay (avoids AbortError)
  const handleUserGesture = () => {
    startLoop();
    window.removeEventListener("click", handleUserGesture);
  };
  window.addEventListener("click", handleUserGesture);

  // Handle forward video end → switch to reverse
  forward.onended = () => {
    reverse.currentTime = 0;
    reverse.classList.add("active");
    forward.classList.remove("active");

    // Next frame play
    requestAnimationFrame(() => {
      reverse.play().catch(console.error);
    });
  };

  // Handle reverse video end → switch to forward
  reverse.onended = () => {
    forward.currentTime = 0;
    forward.classList.add("active");
    reverse.classList.remove("active");

    requestAnimationFrame(() => {
      forward.play().catch(console.error);
    });
  };

  return () => {
    forward.onended = null;
    reverse.onended = null;
    window.removeEventListener("click", handleUserGesture);
  };
}, []);




  return (
    <>
     <div className="video-container">
  <video
    id="forwardVideo"
    className="video-layer"
    muted
    playsInline
    autoPlay
    preload="auto"
  >
    <source src="src/assets/v.mp4" type="video/mp4" />
  </video>
  <video
    id="reverseVideo"
    className="video-layer"
    muted
    playsInline
    preload="auto"
  >
    <source src="src/assets/r.mp4" type="video/mp4" />
  </video>
</div>
  {/* <video className="v" autoPlay loop muted playsInline>
  <source src="src/assets/v.mp4" type="video/webm" />
  Your browser does not support the video tag.
</video> */}
    {loading && <TracingLoader />}
      <div className="app-container">
  {!location ? (
    <div className="center-screen">
      
        <div className="merge">
          <span className="globe"> </span>
        

        <h1 className="title ">📡 IP ADDRESS LOCATOR</h1>
        </div>
        {!showInput ? (
          <div className="btn-group">
                        <button class='primary-btn' onClick={() => setShowInput(true)}>🔍 Enter IP Address</button>
            <button class='secondary-btn' onClick={getMyIPLocation}>📍 Find My Location</button>
          </div>
        ) : (
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter IP address"
              value={ip}
              onChange={(e) => setIP(e.target.value)}
            />
            <div className="input-buttons">
              <button className="back-button" onClick={() => {
                setShowInput(false);
                setIP("");
              }}>
                ← Back
              </button>
              <button class='search' onClick={getIPLocation}>Search</button>
            </div>
          </div>
          
        )}
      
    </div>
        ) : (
          <div className="result-view">
            <div className="info-panel glass">
              <h2>📡INTERNET PROTOCOL INFO</h2>
              <p><strong>🌐 IP:</strong> {location.ip}</p>
              <p><strong>🏙️ City:</strong> {location.city}</p>
              <p><strong>🗺️ Region:</strong> {location.region}</p>
              <p><strong>🌍 Country:</strong> {location.country_name}</p>
              <p><strong>📮 Postal:</strong> {location.postal}</p>
              <p><strong>⏰ Timezone:</strong> {location.timezone}</p>
              <p><strong>🏢  Org:</strong> {location.org}</p>
              {distance && (
                <p style={{ fontWeight: "bold", color: "#00ff66" }}>
                  📍 Distance from your location: {distance} km
                </p>
              )}
              <button className="back-btn" onClick={handleReset}>⬅ Back</button>
            </div>

            <div className="map-container">
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  zoom: 13,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              >
                {Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude) && (
                  <>
                    <Marker
                      latitude={location.latitude}
                      longitude={location.longitude}
                      anchor="bottom"
                      onClick={() => setShowPopup(true)}
                    >
                      <div style={{ transform: "translate(-50%, -100%)" }}>
                        <RiMapPin2Fill
                          size={40}
                          color="red"
                          style={{ filter: "drop-shadow(0 0 6px rgba(255,0,0,0.6))" }}
                        />
                      </div>
                    </Marker>
                    {showPopup && (
                      <Popup
                        latitude={location.latitude}
                        longitude={location.longitude}
                        anchor="bottom"
                        onClose={() => setShowPopup(false)}
                        closeOnClick={false}
                      >
                        📍 {location.city}, {location.country_name}
                      </Popup>
                    )}
                  </>
                )}

                {userLoc && location.ip !== userLoc.ip && Number.isFinite(userLoc.latitude) && Number.isFinite(userLoc.longitude) && (
                  <>
                    <Marker
                      latitude={userLoc.latitude}
                      longitude={userLoc.longitude}
                      anchor="bottom"
                    >
                      <div style={{ transform: "translate(-50%, -100%)" }}>
                        <RiMapPin2Fill
                          size={40}
                          color="blue"
                          style={{ filter: "drop-shadow(0 0 6px rgba(0,0,255,0.6))" }}
                        />
                      </div>
                    </Marker>
                    <Popup
                      latitude={userLoc.latitude}
                      longitude={userLoc.longitude}
                      anchor="bottom"
                      closeOnClick={false}
                    >
                      📍 You are here
                    </Popup>
                  </>
                )}
              </Map>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
