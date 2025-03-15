package com.example.demo.src.GameStateHierarchy;


public class Player {
    double      budget;
    String      PlayerNumber;
    String      PlayerType;
    int         maxMinions;
    int         nowMinions;

    public Player(String PlayerNumber,String PlayerType,long budget,int maxMinions) {
        this.PlayerNumber = PlayerNumber;
        this.PlayerType = PlayerType;
        this.budget = budget;
        this.maxMinions = maxMinions;
        nowMinions = 0;
    }

    void useBudget(int paymentBudget){
        budget -= paymentBudget;
    }

    public long getBudget() {return (long) budget;}

    public void getMoreBudget(double budget){
        this.budget += budget;
    }

    public String getPlayerNumber() {return PlayerNumber;}

    public String getPlayerType() {return PlayerType;}

}
