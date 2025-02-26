package com.example.demo.src.MinionAndStrategyHierarchy;

public class ShadowWarden extends Minion {

    public ShadowWarden(String PlayerName,int minionMaxHP) {
        super(PlayerName,minionMaxHP,30,10,2);
    }

    @Override
    public int minionAttack(){
        return 2;
    }

    
}
