package com.example.demo.model.dto;

public class StrategyRequest {
    private String strategy;
    private GameState gameState;

    public StrategyRequest() {
    }

    public StrategyRequest(String strategy, GameState gameState) {
        this.strategy = strategy;
        this.gameState = gameState;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public GameState getGameState() {
        return gameState;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }
}
