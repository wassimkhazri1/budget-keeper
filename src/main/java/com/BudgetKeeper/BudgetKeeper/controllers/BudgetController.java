package com.BudgetKeeper.BudgetKeeper.controllers;

import com.BudgetKeeper.BudgetKeeper.models.Budget;
import com.BudgetKeeper.BudgetKeeper.models.Transaction;
import com.BudgetKeeper.BudgetKeeper.models.User;
import com.BudgetKeeper.BudgetKeeper.repositories.BudgetRepository;
import com.BudgetKeeper.BudgetKeeper.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React app
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Budget> getUserBudgets(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return budgetRepository.findByUser(user);
    }
    
    @GetMapping("/{category}")
    public Optional<Budget> getUserBudgetsbyCategory(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String category) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return budgetRepository.findByUserAndCategory(user, category);
    }

    @PostMapping
    public Budget createBudget(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Budget budget) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        budget.setUser(user);
        return budgetRepository.save(budget);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        // Trouver l'utilisateur
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        // Trouver le Budget et vérifier qu'elle appartient à l'utilisateur
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget non trouvée"));
        
        if (!budget.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vous n'êtes pas autorisé à supprimer ce budget");
        }
        
        // Supprimer la transaction
        budgetRepository.delete(budget);
        
        return ResponseEntity.ok().build();
    }
}
