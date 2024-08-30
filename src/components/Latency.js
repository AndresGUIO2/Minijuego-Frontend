import React, { useEffect, useState } from 'react';
import NetworkManager from '../services/NetworkManager';

const Latency = () => {
    const [latency, setLatency] = useState(null);

    useEffect(() => {
        const networkManager = new NetworkManager();

        const handleLatency = (latency) => {
            setLatency(latency);
        };

        networkManager.onlatency = handleLatency;

        return () => {
            networkManager.close();
        };
    }, []);

    return (
        <div>
            <h2>Latency: {latency !== null ? `${latency} ms` : 'Calculando...'}</h2>
        </div>
    );
};

export default Latency;
