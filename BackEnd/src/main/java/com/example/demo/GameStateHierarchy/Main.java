package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.MinionAndStrategyHierarchy.Minion;

import java.util.Scanner;


public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        System.out.println("\n-------------------------------\nSetting Cost");
        System.out.print("\nMinion Spawn cost : ");
        int setSpawnCost = sc.nextInt();
        System.out.print("Hex cost : ");
        int setHexPurchaseCost = sc.nextInt();
        System.out.print("Start budget : ");
        int setInitBudget = sc.nextInt();
        System.out.print("Turn budget : ");
        int setTurnBudget = sc.nextInt();
        System.out.print("Max budget : ");
        int setMaxBudget = sc.nextInt();
        System.out.print("Interest : ");
        int setInterest = sc.nextInt();
        System.out.print("Max turns : ");
        int setMaxTurn = sc.nextInt();
        System.out.print("Max minions : ");
        int setMaxMinions = sc.nextInt();
        System.out.print("Minion HP : ");
        int setMinionHP = sc.nextInt();

        GameState PlayGame = new GameState(setSpawnCost, setHexPurchaseCost, setInitBudget, setMinionHP, setTurnBudget, setMaxBudget, setInterest, setMaxTurn, setMaxMinions);
        PlayGame.GameStart();
    }
}