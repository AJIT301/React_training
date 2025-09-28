import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import '../styles/FetchAPI.css';

function getContinent([lon, lat]) {
    if (lat >= 35 && lat <= 72 && lon >= -25 && lon <= 45) return "Europe";
    if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -65) return "USA";
    if (lat >= -10 && lat <= 55 && lon >= 60 && lon <= 150) return "Asia";
    return "Other";
}

function SteamCS2Api() {
    const [relays, setRelays] = useState([]);
    const [region, setRegion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pops, setPops] = useState({}); // store fetched pops

    const abortControllerRef = useRef(null);

    const fetchRelays = useCallback(async (selectedRegion) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/steamconfig', { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
            const data = await response.json();

            const fetchedPops = data.pops || {};
            setPops(fetchedPops);

            const validRegions = Object.entries(fetchedPops)
                .filter(([, info]) => info.relays && info.relays.length > 0)
                .map(([code, info]) => ({ code, desc: info.desc, geo: info.geo }));

            const regionToUse = selectedRegion || validRegions[0]?.code;
            setRegion(regionToUse);
            setRelays(fetchedPops[regionToUse]?.relays || []);

        } catch (err) {
            if (err.name !== 'AbortError') setError(err.message);
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, []);

    useEffect(() => {
        fetchRelays(region);
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [fetchRelays, region]);

    const groupedOptions = useMemo(() => {
        const groups = {};
        Object.entries(pops).forEach(([code, info]) => {
            if (!info.relays || info.relays.length === 0) return; // skip empty
            const continent = getContinent(info.geo);
            if (!groups[continent]) groups[continent] = [];
            groups[continent].push({ code, desc: info.desc });
        });
        return groups;
    }, [pops]);

    const RelayTable = useMemo(() => {
        if (!relays.length) return null;
        return (
            <table className="fa-table">
                <thead>
                    <tr>
                        <th>IP</th>
                        <th>Port Range</th>
                    </tr>
                </thead>
                <tbody>
                    {relays.map((r, idx) => (
                        <tr key={idx}>
                            <td>{r.ipv4}</td>
                            <td>{r.port_range ? `${r.port_range[0]} - ${r.port_range[1]}` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }, [relays]);

    return (
        <div className="fa-container">
            <h1>Steam CS2 Relay Viewer</h1>
            <label>
                Region:
                <select className="fa-input" value={region} onChange={e => setRegion(e.target.value)}>
                    {Object.entries(groupedOptions).map(([continent, regions]) => (
                        <optgroup key={continent} label={`--${continent}--`}>
                            {regions.map(r => (
                                <option key={r.code} value={r.code}>{r.desc}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </label>
            <button className="fa-button" onClick={() => fetchRelays(region)} disabled={loading}>
                {loading ? 'Fetching…' : 'Refetch'}
            </button>
            {error && <div className="fa-error">Error: {error}</div>}
            {!loading && !error && relays.length === 0 && (
                <div className="fa-status fa-status-error">No relays found</div>
            )}
            {RelayTable}
        </div>
    );
}

export default SteamCS2Api;
