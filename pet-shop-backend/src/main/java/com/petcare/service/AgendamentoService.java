package com.petcare.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.petcare.dto.AgendamentoAvailabilityView;
import com.petcare.dto.AgendamentoRequest;
import com.petcare.model.Agendamento;
import com.petcare.model.AppointmentStatus;
import com.petcare.model.Pet;
import com.petcare.model.Servico;
import com.petcare.model.Usuario;
import com.petcare.repository.AgendamentoRepository;
import com.petcare.repository.PetRepository;
import com.petcare.repository.ServicoRepository;
import com.petcare.repository.UsuarioRepository;
import com.petcare.rest.ApiException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Regras de agendamento: criacao, listagem por perfil, cancelamento.
 */
@ApplicationScoped
public class AgendamentoService {

    private static final Pattern DURATION_PATTERN = Pattern.compile("(\\d+)");
    private static final int DEFAULT_DURATION_MINUTES = 60;
    private static final int SLOT_STEP_MINUTES = 30;
    private static final LocalTime DAY_START = LocalTime.of(9, 0);
    private static final LocalTime DAY_END = LocalTime.of(18, 0);
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    @Inject
    AgendamentoRepository agendamentos;

    @Inject
    PetRepository pets;

    @Inject
    UsuarioRepository usuarios;

    @Inject
    ServicoRepository servicos;

    @Inject
    NotificationService notificationService;

    /** Cria um agendamento para um pet do tutor logado. */
    public Agendamento create(Usuario tutor, AgendamentoRequest req) {
        Pet pet = pets.findById(req.petId())
                .orElseThrow(() -> ApiException.notFound("Pet nao encontrado."));

        LocalDateTime scheduledAt = parseDateTime(req.dateTime());
        if (!scheduledAt.isAfter(LocalDateTime.now())) {
            throw ApiException.badRequest("Agende apenas para datas futuras.");
        }

        // Garante que o pet pertence ao tutor logado (multi-tenant / escopo).
        if (!tutor.getId().equals(pet.getOwnerUserId())) {
            throw ApiException.forbidden("Pet nao pertence ao tutor logado.");
        }

        // O petshop alvo precisa existir.
        if (!usuarios.existsByPetshopId(req.petshopId())) {
            throw ApiException.badRequest("Petshop informado nao existe.");
        }

        Servico servico = servicos.findById(req.serviceId())
                .orElseThrow(() -> ApiException.badRequest("Servico informado nao existe."));
        if (!req.petshopId().equals(servico.getPetshopId())) {
            throw ApiException.badRequest("Servico nao pertence ao petshop selecionado.");
        }

        int durationMinutes = parseDurationMinutes(servico.getDuration());
        if (hasConflict(req.petshopId(), scheduledAt, durationMinutes, null)) {
            throw ApiException.badRequest("Horario indisponivel para este petshop e servico.");
        }

        Agendamento item = new Agendamento();
        item.setId(Ids.newId("svc"));
        item.setUserId(tutor.getId());
        item.setTutor(tutor.getName());
        item.setTutorAddress(tutor.getAddress());
        item.setPetshopId(req.petshopId());
        item.setPetId(pet.getId());
        item.setPet(pet.getName());
        item.setDateTime(scheduledAt.toString());
        item.setType(req.type());
        item.setServiceId(req.serviceId());
        item.setService(req.service());
        item.setDurationMinutes(durationMinutes);
        item.setStatus(AppointmentStatus.SCHEDULED.label());
        return agendamentos.insert(item);
    }

    public AgendamentoAvailabilityView availability(String petshopId, String serviceId, String date) {
        if (petshopId == null || petshopId.isBlank()) {
            throw ApiException.badRequest("Informe o petshopId.");
        }
        if (serviceId == null || serviceId.isBlank()) {
            throw ApiException.badRequest("Informe o serviceId.");
        }
        if (!usuarios.existsByPetshopId(petshopId)) {
            throw ApiException.badRequest("Petshop informado nao existe.");
        }

        Servico servico = servicos.findById(serviceId)
                .orElseThrow(() -> ApiException.badRequest("Servico informado nao existe."));
        if (!petshopId.equals(servico.getPetshopId())) {
            throw ApiException.badRequest("Servico nao pertence ao petshop informado.");
        }

        int durationMinutes = parseDurationMinutes(servico.getDuration());
        List<String> dates = new ArrayList<>();
        LocalDate startDate = LocalDate.now();

        for (int i = 0; i < 14; i++) {
            LocalDate candidate = startDate.plusDays(i);
            List<String> slots = availableTimesForDate(petshopId, candidate, durationMinutes);
            if (!slots.isEmpty()) {
                dates.add(candidate.toString());
            }
        }

        LocalDate selectedDate = (date != null && !date.isBlank())
                ? parseDate(date)
                : (dates.isEmpty() ? null : LocalDate.parse(dates.get(0)));
        List<String> times = selectedDate == null
                ? List.of()
                : availableTimesForDate(petshopId, selectedDate, durationMinutes);

        return new AgendamentoAvailabilityView(dates, times);
    }

    /** Historico do tutor para um pet (ou todos os pets se petId == null). */
    public List<Agendamento> listForTutor(String userId, String petId) {
        return agendamentos.findByUserId(userId).stream()
                .filter(a -> petId == null || petId.equals(a.getPetId()))
                .sorted(Comparator.comparing(Agendamento::getDateTime,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    /** Agenda recebida por um petshop (owner). */
    public List<Agendamento> listForPetshop(String petshopId) {
        return agendamentos.findByPetshopId(petshopId).stream()
                .sorted(Comparator.comparing(Agendamento::getDateTime,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    /** Cancelamento pelo tutor: so o dono do agendamento, e so se Agendado. */
    public Agendamento cancelByTutor(String userId, String serviceId) {
        Agendamento item = agendamentos.findById(serviceId)
                .orElseThrow(() -> ApiException.notFound("Agendamento nao encontrado."));

        if (!userId.equals(item.getUserId())) {
            throw ApiException.forbidden("Voce nao pode cancelar este agendamento.");
        }
        if (!AppointmentStatus.SCHEDULED.label().equals(item.getStatus())) {
            throw ApiException.badRequest("Apenas servicos agendados podem ser cancelados.");
        }

        item.setStatus(AppointmentStatus.CANCELLED.label());
        return agendamentos.update(item);
    }

    /** Cancelamento pelo petshop: so do proprio petshop; delega notificacao. */
    public Agendamento cancelByPetshop(String petshopId, String serviceId) {
        Agendamento item = agendamentos.findById(serviceId)
                .orElseThrow(() -> ApiException.notFound("Agendamento nao encontrado."));

        if (!petshopId.equals(item.getPetshopId())) {
            throw ApiException.forbidden("Agendamento nao pertence a este petshop.");
        }
        if (!AppointmentStatus.SCHEDULED.label().equals(item.getStatus())) {
            throw ApiException.badRequest("Apenas servicos agendados podem ser cancelados.");
        }

        item.setStatus(AppointmentStatus.CANCELLED.label());
        item.setCanceledBy("petshop");
        Agendamento updated = agendamentos.update(item);

        notificationService.sendAppointmentCancelled(updated);

        return updated;
    }

    private LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            throw ApiException.badRequest("Data invalida. Use o formato YYYY-MM-DD.");
        }
    }

    private LocalDateTime parseDateTime(String value) {
        try {
            return LocalDateTime.parse(value);
        } catch (Exception ex) {
            try {
                return OffsetDateTime.parse(value).toLocalDateTime();
            } catch (Exception nested) {
                throw ApiException.badRequest("Data/hora invalida. Use formato ISO-8601.");
            }
        }
    }

    private int parseDurationMinutes(String duration) {
        if (duration == null || duration.isBlank()) {
            return DEFAULT_DURATION_MINUTES;
        }

        Matcher matcher = DURATION_PATTERN.matcher(duration);
        if (!matcher.find()) {
            return DEFAULT_DURATION_MINUTES;
        }

        int minutes = Integer.parseInt(matcher.group(1));
        return minutes > 0 ? minutes : DEFAULT_DURATION_MINUTES;
    }

    private int resolveDurationMinutes(Agendamento item, Map<String, Integer> cache) {
        if (item.getDurationMinutes() != null && item.getDurationMinutes() > 0) {
            return item.getDurationMinutes();
        }

        String serviceId = item.getServiceId();
        if (serviceId != null && !serviceId.isBlank()) {
            Integer cached = cache.get(serviceId);
            if (cached != null) {
                return cached;
            }
            int resolved = servicos.findById(serviceId)
                    .map(Servico::getDuration)
                    .map(this::parseDurationMinutes)
                    .orElse(DEFAULT_DURATION_MINUTES);
            cache.put(serviceId, resolved);
            return resolved;
        }

        return DEFAULT_DURATION_MINUTES;
    }

    private boolean hasConflict(String petshopId, LocalDateTime start, int durationMinutes, String ignoreId) {
        LocalDateTime end = start.plusMinutes(durationMinutes);
        Map<String, Integer> durationCache = new HashMap<>();

        for (Agendamento existing : agendamentos.findByPetshopId(petshopId)) {
            if (!AppointmentStatus.SCHEDULED.label().equals(existing.getStatus())) {
                continue;
            }
            if (ignoreId != null && ignoreId.equals(existing.getId())) {
                continue;
            }

            LocalDateTime existingStart;
            try {
                existingStart = parseDateTime(existing.getDateTime());
            } catch (Exception ex) {
                continue;
            }

            int existingDuration = resolveDurationMinutes(existing, durationCache);
            LocalDateTime existingEnd = existingStart.plusMinutes(existingDuration);

            boolean overlaps = start.isBefore(existingEnd) && end.isAfter(existingStart);
            if (overlaps) {
                return true;
            }
        }

        return false;
    }

    private List<String> availableTimesForDate(String petshopId, LocalDate date, int durationMinutes) {
        List<String> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (LocalTime slot = DAY_START; !slot.plusMinutes(durationMinutes).isAfter(DAY_END); slot = slot
                .plusMinutes(SLOT_STEP_MINUTES)) {
            LocalDateTime candidate = LocalDateTime.of(date, slot);
            if (!candidate.isAfter(now)) {
                continue;
            }
            if (!hasConflict(petshopId, candidate, durationMinutes, null)) {
                result.add(slot.format(TIME_FORMAT));
            }
        }

        return result;
    }
}
