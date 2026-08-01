import { useEffect, useRef, useState } from 'react';

export function useServiceCatalogStream(petshopId, onUpdate) {
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!petshopId) {
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const url = `${baseUrl}/api/servicos/catalogo/stream?petshopId=${encodeURIComponent(petshopId)}`;

    const connect = () => {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      retryCountRef.current = 0;

      eventSource.addEventListener('open', () => {
        setConnected(true);
        retryCountRef.current = 0;
      });

      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onUpdate(data);
          setConnected(true);
        } catch (error) {
          console.error('Erro ao parsear SSE:', error);
        }
      };

      const scheduleReconnect = (retryCount) => {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (eventSourceRef.current) {
            connect();
          }
        }, delay);
      };

      const handleError = () => {
        setConnected(false);
        retryCountRef.current += 1;
        console.warn(`SSE disconnected, attempt ${retryCountRef.current} reconnect...`);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        scheduleReconnect(retryCountRef.current);
      };

      eventSource.addEventListener('message', handleMessage);
      eventSource.addEventListener('error', handleError);
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [petshopId, onUpdate]);

  return connected;
}
