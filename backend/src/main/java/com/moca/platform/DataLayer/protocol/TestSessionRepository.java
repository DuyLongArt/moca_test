package com.moca.platform.DataLayer.protocol;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestSessionRepository extends JpaRepository<TestSessionEntity, UUID> {

    List<TestSessionEntity> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    List<TestSessionEntity> findByDoctorIdAndStatusOrderBySubmittedAtAsc(
            UUID doctorId, TestSessionStatus status);
}
