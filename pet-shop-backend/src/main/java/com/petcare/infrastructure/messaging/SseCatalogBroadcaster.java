package com.petcare.infrastructure.messaging;

import com.petcare.application.dto.output.ServicoView;
import com.petcare.infrastructure.messaging.CatalogUpdate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import org.jboss.logging.Logger;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@ApplicationScoped
public class SseCatalogBroadcaster {

    private static final Logger LOG = Logger.getLogger(SseCatalogBroadcaster.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final ConcurrentMap<String, SseEventSink> sinks = new ConcurrentHashMap<>();

    public String register(SseEventSink sink, String petshopId) {
        String id = UUID.randomUUID().toString();
        sinks.put(petshopId + ":" + id, sink);
        return id;
    }

    public void unregister(String id, String petshopId) {
        sinks.remove(petshopId + ":" + id);
    }

    public void unregisterByPetshop(String petshopId) {
        sinks.entrySet().removeIf(entry -> entry.getKey().startsWith(petshopId + ":"));
    }

    public void broadcast(Sse sse, ServicoView servico, String action, String petshopId) {
        String payload;
        try {
            payload = MAPPER.writeValueAsString(new CatalogUpdate(action, servico));
        } catch (JsonProcessingException e) {
            LOG.error("Falha ao serializar CatalogUpdate para JSON. Causa: " + e.getMessage());
            return;
        }
        sinks.entrySet().removeIf(entry -> {
            if (!entry.getKey().startsWith(petshopId + ":")) {
                return false;
            }
            try {
                entry.getValue().send(sse.newEventBuilder().data(String.class, payload).build());
                return false;
            } catch (Exception e) {
                LOG.warn("Falha ao enviar SSE, removendo sink. Causa: " + e.getMessage());
                return true;
            }
        });
    }
}
