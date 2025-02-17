package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.MinionAndStrategyHierarchy.Minion;

public class Main {
    public static void main(String[] args) {

        GameState PlayGame = new GameState(100, 1000, 10000, 100, 100, 100000, 10, 20, 30);
        PlayGame.GameStart();
    }
}