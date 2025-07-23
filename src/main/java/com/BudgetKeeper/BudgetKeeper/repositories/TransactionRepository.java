package com.BudgetKeeper.BudgetKeeper.repositories;

import com.BudgetKeeper.BudgetKeeper.models.Transaction;
import com.BudgetKeeper.BudgetKeeper.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
}
