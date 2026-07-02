package com.petcare.service;

import com.petcare.dto.CatalogUpdate;
import com.petcare.dto.ServicoView;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import org.jboss.logging.Logger;
import java.util.stream.Collectors;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@ApplicationScoped
public class ServiceCatalogBroadcaster {

    private static final Logger LOG = Logger.getLogger(ServiceCatalogBroadcaster.class);
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
        String payload = toJson(new CatalogUpdate(action, servico));
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

    private String toJson(CatalogUpdate update) {
        ServicoView s = update.servico();
        String featuresJson = s.features() == null
                ? "[]"
                : s.features().stream().map(this::jsonString).collect(Collectors.joining(",", "[", "]"));
        return "{"
                + "\"action\":" + jsonString(update.action()) + ","
                + "\"servico\":{"
                + "\"id\":" + jsonString(s.id()) + ","
                + "\"petshopId\":" + jsonString(s.petshopId()) + ","
                + "\"name\":" + jsonString(s.name()) + ","
                + "\"category\":" + jsonString(s.category()) + ","
                + "\"duration\":" + jsonString(s.duration()) + ","
                + "\"price\":" + s.price() + ","
                + "\"description\":" + jsonString(s.description()) + ","
                + "\"features\":" + featuresJson
                + "}"
                + "}";
    }

    private String jsonString(String value) {
        if (value == null) {
            return "null";
        }
        return "\"" + value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t") + "\"";
    }
}
