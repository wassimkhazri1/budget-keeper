package com.BudgetKeeper.BudgetKeeper.controllers;

import com.BudgetKeeper.BudgetKeeper.models.Transaction;
import com.BudgetKeeper.BudgetKeeper.models.User;
import com.BudgetKeeper.BudgetKeeper.repositories.TransactionRepository;
import com.BudgetKeeper.BudgetKeeper.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React app
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
	

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

//    private static final List<String> CATEGORIES_AUTORISEES = List.of(
//    	    "Loyer", "Électricité", "Restaurant", "Épicerie", "Transport", "Loisirs", "Courses", "École","Autre"
//    	);

    
    
    @GetMapping
    public List<Transaction> getUserTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return transactionRepository.findByUser(user);
    }

    @PostMapping
    public Transaction createTransaction(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Transaction transaction) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        // Validation de la catégorie
//        if (!CATEGORIES_AUTORISEES.contains(transaction.getCategory())) {
//            throw new IllegalArgumentException("Catégorie invalide : " + transaction.getCategory());
//        }
        
        transaction.setUser(user);
        transaction.setDate(new Date());
        return transactionRepository.save(transaction);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        // Trouver l'utilisateur
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        // Trouver la transaction et vérifier qu'elle appartient à l'utilisateur
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vous n'êtes pas autorisé à supprimer cette transaction");
        }
        
        // Supprimer la transaction
        transactionRepository.delete(transaction);
        
        return ResponseEntity.ok().build();
    }
}
