package com.petcare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.petcare.dto.AgendamentoRequest;
import com.petcare.dto.AgendamentoAvailabilityView;
import com.petcare.model.Agendamento;
import com.petcare.model.Pet;
import com.petcare.model.Servico;
import com.petcare.model.Usuario;
import com.petcare.repository.AgendamentoRepository;
import com.petcare.repository.PetRepository;
import com.petcare.repository.ServicoRepository;
import com.petcare.repository.UsuarioRepository;
import com.petcare.rest.ApiException;

class AgendamentoServiceTest {

    private AgendamentoService service;
    private AgendamentoRepository agendamentos;
    private PetRepository pets;
    private UsuarioRepository usuarios;
    private ServicoRepository servicos;

    @BeforeEach
    void setUp() {
        service = new AgendamentoService();
        agendamentos = mock(AgendamentoRepository.class);
        pets = mock(PetRepository.class);
        usuarios = mock(UsuarioRepository.class);
        servicos = mock(ServicoRepository.class);

        service.agendamentos = agendamentos;
        service.pets = pets;
        service.usuarios = usuarios;
        service.servicos = servicos;
        service.notificationService = mock(NotificationService.class);
    }

    @Test
    void createBloqueiaQuandoHorarioSobrepoeAgendamentoExistente() {
        Usuario tutor = tutor("user-1");
        Pet pet = pet("pet-1", "user-1", "Luna");
        Servico servico = servico("svc-1", "petshop-1", "60 min");

        Agendamento existente = new Agendamento();
        existente.setId("ag-existente");
        existente.setPetshopId("petshop-1");
        existente.setDateTime("2099-01-10T10:00:00");
        existente.setStatus("Agendado");
        existente.setServiceId("svc-1");
        existente.setDurationMinutes(60);

        AgendamentoRequest req = new AgendamentoRequest(
                "pet-1",
                "petshop-1",
                "2099-01-10T10:30:00",
                "Banho",
                "svc-1",
                "Banho Completo");

        when(pets.findById("pet-1")).thenReturn(Optional.of(pet));
        when(usuarios.existsByPetshopId("petshop-1")).thenReturn(true);
        when(servicos.findById("svc-1")).thenReturn(Optional.of(servico));
        when(agendamentos.findByPetshopId("petshop-1")).thenReturn(List.of(existente));

        ApiException ex = assertThrows(ApiException.class, () -> service.create(tutor, req));

        assertEquals(400, ex.getStatus());
        assertEquals("Horario indisponivel para este petshop e servico.", ex.getMessage());
        verify(agendamentos, never()).insert(any());
    }

    @Test
    void createPermiteQuandoHorarioNaoSobrepoe() {
        Usuario tutor = tutor("user-1");
        Pet pet = pet("pet-1", "user-1", "Luna");
        Servico servico = servico("svc-1", "petshop-1", "60 min");

        Agendamento existente = new Agendamento();
        existente.setId("ag-existente");
        existente.setPetshopId("petshop-1");
        existente.setDateTime("2099-01-10T10:00:00");
        existente.setStatus("Agendado");
        existente.setServiceId("svc-1");
        existente.setDurationMinutes(60);

        AgendamentoRequest req = new AgendamentoRequest(
                "pet-1",
                "petshop-1",
                "2099-01-10T11:30:00",
                "Banho",
                "svc-1",
                "Banho Completo");

        when(pets.findById("pet-1")).thenReturn(Optional.of(pet));
        when(usuarios.existsByPetshopId("petshop-1")).thenReturn(true);
        when(servicos.findById("svc-1")).thenReturn(Optional.of(servico));
        when(agendamentos.findByPetshopId("petshop-1")).thenReturn(List.of(existente));
        when(agendamentos.insert(any(Agendamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Agendamento created = service.create(tutor, req);

        assertNotNull(created.getId());
        assertEquals("svc-1", created.getServiceId());
        assertEquals(60, created.getDurationMinutes());
        assertEquals("petshop-1", created.getPetshopId());

        ArgumentCaptor<Agendamento> captor = ArgumentCaptor.forClass(Agendamento.class);
        verify(agendamentos).insert(captor.capture());
        assertEquals("2099-01-10T11:30", captor.getValue().getDateTime());
    }

    @Test
    void availabilityRetornaHorariosLivresSemSobreposicao() {
        Servico servico = servico("svc-1", "petshop-1", "60 min");

        Agendamento conflito = new Agendamento();
        conflito.setId("ag-1");
        conflito.setPetshopId("petshop-1");
        conflito.setDateTime("2099-01-10T10:00:00");
        conflito.setStatus("Agendado");
        conflito.setServiceId("svc-1");
        conflito.setDurationMinutes(60);

        when(usuarios.existsByPetshopId("petshop-1")).thenReturn(true);
        when(servicos.findById("svc-1")).thenReturn(Optional.of(servico));
        when(agendamentos.findByPetshopId("petshop-1")).thenReturn(List.of(conflito));

        AgendamentoAvailabilityView result = service.availability("petshop-1", "svc-1", "2099-01-10");

        assertNotNull(result.availableDates());
        assertTrue(result.availableTimes().contains("09:00"));
        assertTrue(result.availableTimes().contains("11:00"));
        assertTrue(result.availableTimes().contains("17:00"));
        assertTrue(!result.availableTimes().contains("10:00"));
        assertTrue(!result.availableTimes().contains("10:30"));
    }

    @Test
    void availabilityComDateInvalidaRetornaBadRequest() {
        Servico servico = servico("svc-1", "petshop-1", "60 min");

        when(usuarios.existsByPetshopId("petshop-1")).thenReturn(true);
        when(servicos.findById("svc-1")).thenReturn(Optional.of(servico));

        ApiException ex = assertThrows(ApiException.class,
                () -> service.availability("petshop-1", "svc-1", "10-01-2099"));

        assertEquals(400, ex.getStatus());
        assertEquals("Data invalida. Use o formato YYYY-MM-DD.", ex.getMessage());
    }

    private static Usuario tutor(String id) {
        Usuario user = new Usuario();
        user.setId(id);
        user.setName("Ana");
        user.setAddress("Rua A");
        return user;
    }

    private static Pet pet(String id, String ownerUserId, String name) {
        Pet pet = new Pet();
        pet.setId(id);
        pet.setOwnerUserId(ownerUserId);
        pet.setName(name);
        return pet;
    }

    private static Servico servico(String id, String petshopId, String duration) {
        Servico servico = new Servico();
        servico.setId(id);
        servico.setPetshopId(petshopId);
        servico.setDuration(duration);
        servico.setName("Banho Completo");
        servico.setCategory("bath");
        return servico;
    }
}
