package com.example.demo.src.MinionAndStrategyHierarchy;

public class ShadowWarden extends Minion {

    public ShadowWarden(int minionMaxHP) {
        super(minionMaxHP,minionMaxHP/5,minionMaxHP/10,2);
    }

    @Override
    public int minionAttack(){
        return minionATK*2;
    }
}
