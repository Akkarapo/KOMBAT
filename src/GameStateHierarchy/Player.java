package com.example.demo.src.GameStateHierarchy;
import com.example.demo.src.MinionAndStrategyHierarchy.*;

public class Player {
    double        budget;
    String      PlayerNumber;
    int         maxMinions;
    int         nowMinions;

    public Player(String PlayerNumber,long budget,int maxMinions) {
        this.PlayerNumber = PlayerNumber;
        this.budget = budget;
        this.maxMinions = maxMinions;
        nowMinions = 0;
    }

    void useBudget(int paymentBudget){
        budget -= paymentBudget;
    }

    public long getBudget() {
        return (long) budget;
    }

    public void getMoreBudget(double budget){
        this.budget += budget;
    }

    public String getPlayerNumber() {
        return PlayerNumber;
    }

    //public void removeMinion(int row, int col){}


}
