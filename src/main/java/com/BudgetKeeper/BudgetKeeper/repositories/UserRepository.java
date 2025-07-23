package com.BudgetKeeper.BudgetKeeper.repositories;

import com.BudgetKeeper.BudgetKeeper.models.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
