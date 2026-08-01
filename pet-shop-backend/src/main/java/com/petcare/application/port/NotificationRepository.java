package com.petcare.application.port;

import com.petcare.domain.entity.Notificacao;
import java.util.List;

public interface NotificationRepository {
    Notificacao insert(Notificacao notificacao);
    List<Notificacao> findByUserId(String userId);
}
