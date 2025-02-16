package com.example.demo.src.GameStateHierarchy;
import com.example.demo.src.MinionAndStrategyHierarchy.*;

public class Player {
    Minion[]    minions;
    Minion[]    minionsHistory;
    int         ownMinionIndex;
    Hex[]       ownHex = new Hex[64];
    int         ownHexIndex = 0;
    long        budget;
    String      PlayerNumber;

    public Player(String PlayerNumber,long budget,int maxMinion,Minion firstMinion,Hex startHex) {
        this.PlayerNumber = PlayerNumber;
        this.budget = budget;

        this.minions = new Minion[maxMinion];
        for (int i = 1; i < maxMinion; i++) {
            this.minions[i] = null;
        }
        this.minions[0] = firstMinion;
        this.minionsHistory = minions;
        ownMinionIndex += 1;

        for (int i = 1; i < 64; i++) {
            this.ownHex[i] = null;
        }
        ownHex[0] = startHex;
        ownHexIndex += 1;

    }



    void getHex(Hex newOwnHex){
        ownHex[ownHexIndex] = newOwnHex;
        ownHexIndex += 1;
    }

    void spawnMinion(Minion minion,int row, int col){

    }
    void useBudget(int paymentBudget){
        budget -= paymentBudget;
    }
    //long getMoreBudget;

    Hex[] getOwnHex(){
        Hex[] ownHex = new Hex[ownHexIndex];
        for(int i=0;i<ownHexIndex;i++) ownHex[i] = this.ownHex[i];
        return ownHex;
    }

    public long getBudget() {
        return (long) budget;
    }

    public String getPlayerNumber() {
        return PlayerNumber;
    }

    public void removeMinion(int row, int col){}


}
