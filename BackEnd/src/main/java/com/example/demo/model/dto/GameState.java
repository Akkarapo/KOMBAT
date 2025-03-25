package com.example.demo.model.dto;

import java.util.Map;

public class GameState {
    private int budget;
    private int opponentLoc;
    private Map<String, Integer> nearby;
    private int random;

    public GameState() {
    }

    public GameState(int budget, int opponentLoc, Map<String, Integer> nearby, int random) {
        this.budget = budget;
        this.opponentLoc = opponentLoc;
        this.nearby = nearby;
        this.random = random;
    }

    public int getBudget() {
        return budget;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }

    public int getOpponentLoc() {
        return opponentLoc;
    }

    public void setOpponentLoc(int opponentLoc) {
        this.opponentLoc = opponentLoc;
    }

    public Map<String, Integer> getNearby() {
        return nearby;
    }

    public void setNearby(Map<String, Integer> nearby) {
        this.nearby = nearby;
    }

    public int getRandom() {
        return random;
    }

    public void setRandom(int random) {
        this.random = random;
    }

    @Override
    public String toString() {
        return "GameState{" +
                "budget=" + budget +
                ", opponentLoc=" + opponentLoc +
                ", nearby=" + nearby +
                ", random=" + random +
                '}';
    }
}
