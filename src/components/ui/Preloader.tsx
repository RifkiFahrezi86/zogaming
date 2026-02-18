'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoaded) return null;

    return (
        <div className={`preloader ${isLoaded ? 'loaded' : ''}`}>
            <div className="preloader-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
