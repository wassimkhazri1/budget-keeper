package com.BudgetKeeper.BudgetKeeper.controllers;

import com.BudgetKeeper.BudgetKeeper.models.User;
import com.BudgetKeeper.BudgetKeeper.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React app
@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	// 🔎 Obtenir les infos du user connecté
	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
		return userRepository.findByEmail(userDetails.getUsername()).map(user -> ResponseEntity.ok().body(user))
				.orElse(ResponseEntity.notFound().build());
	}

	// ✏️ (Optionnel) Mettre à jour ses infos
	@PutMapping("/me")
	public ResponseEntity<?> updateUser(@AuthenticationPrincipal UserDetails userDetails,
			@RequestBody User updatedUser) {
		return userRepository.findByEmail(userDetails.getUsername()).map(user -> {
			user.setFirstName(updatedUser.getFirstName());
			user.setLastName(updatedUser.getLastName());
			return ResponseEntity.ok().body(userRepository.save(user));
		}).orElse(ResponseEntity.notFound().build());
	}
}
