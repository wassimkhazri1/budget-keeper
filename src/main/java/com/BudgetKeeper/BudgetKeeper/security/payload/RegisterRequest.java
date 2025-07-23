package com.BudgetKeeper.BudgetKeeper.security.payload;

public record RegisterRequest(String email, String password, String firstName, String lastName) {}
