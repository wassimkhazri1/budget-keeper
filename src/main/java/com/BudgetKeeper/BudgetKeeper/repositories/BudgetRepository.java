package com.BudgetKeeper.BudgetKeeper.repositories;

import com.BudgetKeeper.BudgetKeeper.models.Budget;
import com.BudgetKeeper.BudgetKeeper.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
	List<Budget> findByUser(User user);

	@Query("SELECT b FROM Budget b WHERE b.user = :user AND b.category = :category")
	Optional<Budget> findByUserAndCategory(@Param("user") User user, @Param("category") String category);
}
