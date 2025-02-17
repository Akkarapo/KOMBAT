package com.example.demo.src.MinionAndStrategyHierarchy;

public class Minion {
    int minionMaxHP;
    int minionNowHP;
    int minionATK;
    int minionDEF;
    int minionMaxHexMovement;
    int minionNowHexMovement;
    //int minionAttackRange;

    boolean isDead = false;
    //boolean alreadyUseSkill;

    public Minion(int minionMaxHP, int minionATK, int minionDEF,int minionMaxHexMovement) {
        this.minionMaxHP = minionMaxHP;
        this.minionNowHP = minionMaxHP;
        this.minionATK = minionATK;
        this.minionDEF = minionDEF;
        this.minionMaxHexMovement = minionMaxHexMovement;
        this.minionNowHexMovement = minionMaxHexMovement;
    }

    public int minionAttack(){
        return minionATK;
    }

    public void minionHasAttacked(int damage){
        damage -= getMinionDEF();
        if(damage<1)    damage = 1;
        minionNowHP = damage;
        if(minionNowHP <= 0) isDead = true;
    }

    public boolean isDead(){
        return isDead;
    }

    void setMinionMaxHexMovement(int minionMaxHexMovement) {
        this.minionMaxHexMovement = minionMaxHexMovement;
        this.minionNowHexMovement = this.minionMaxHexMovement;
    }

    void moveMinion(){
        if(minionNowHexMovement>0) minionNowHexMovement -= 1;
    }

    boolean canMove(){
        return getMinionNowHexMovement()>0;
    }

    int getMinionMaxHP(){
        return minionMaxHP;
    }

    int getMinionNowHP(){
        return minionNowHP;
    }

    int getMinionDEF(){
        return minionDEF;
    }

    int getMinionMaxHexMovement(){
        return minionMaxHexMovement;
    }

    int getMinionNowHexMovement(){
        return minionNowHexMovement;
    }



}
