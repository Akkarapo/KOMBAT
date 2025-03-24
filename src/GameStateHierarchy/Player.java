package com.example.demo.src.GameStateHierarchy;

import java.util.HashMap;
import java.util.Map;

public class Player {
    private double      budget;
    private final String      PlayerNumber;
    private final String      PlayerType;
    private int         countSpawnedMinions;
    private Map<Integer, int[]> spawnedMinion = new HashMap<>();

    public Player(String PlayerNumber,String PlayerType,long budget) {
        this.PlayerNumber = PlayerNumber;
        this.PlayerType = PlayerType;
        this.budget = budget;
        countSpawnedMinions = 0;
    }

    public void spawnNewMinion(int[] minionHex) {
        countSpawnedMinions++;
        spawnedMinion.put(countSpawnedMinions, minionHex);
    }

    public void deleteMinion(int minionNumber) { spawnedMinion.remove(minionNumber); }
    public void changeMinionHex(int minionNumber, int[] minionHex) { spawnedMinion.put(minionNumber, minionHex);}
    public int getNowMinionPlayerHave() { return spawnedMinion.size(); }
    public int getCountSpawnedMinions(){return countSpawnedMinions;}

    public Map<Integer, int[]> minionsPlayerHave(){return spawnedMinion;}

    void useBudget(int paymentBudget){budget -= paymentBudget;}

    public long getBudget() {return (long) budget;}

    public void getMoreBudget(double budget,long maxBudget){
        this.budget += budget;
        if(this.budget > maxBudget) this.budget = maxBudget;
    }

    public String getPlayerNumber() {return PlayerNumber;}

    public String getPlayerType() {return PlayerType;}

}
