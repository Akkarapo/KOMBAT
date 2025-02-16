package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.MinionAndStrategyHierarchy.Minion;

public class Main {
    public static void main(String[] args) {

        int MinionMaxHP = 100;

        Minion p1Minion = new Minion(MinionMaxHP);
        Minion p2Minion = new Minion(MinionMaxHP);

        GameState PlayGame = new GameState(p1Minion, p2Minion, 100, 1000, 10000, MinionMaxHP, 100, 100000, 10, 20, 30);
        PlayGame.GameStart();
    }
}