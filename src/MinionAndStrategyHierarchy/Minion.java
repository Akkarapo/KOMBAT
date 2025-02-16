package com.example.demo.src.MinionAndStrategyHierarchy;

public class Minion {
    int minionMaxHP;
    int minionNowHP;
    int minionATK;
    int minionDEF;
    int minionMaxHexMovement;
    int minionNowHexMovement;
    boolean canMove;
    //int minionAttackRange;

    boolean isDead = false;
    //boolean alreadyUseSkill;

    public Minion(int minionMaxHP) {
        this.minionMaxHP = minionMaxHP;
        this.minionNowHP = minionMaxHP;
        canMove = true;
    }

    public int minionAttack(){
        return minionATK;
    }

    public void minionHasAttacked(int damage){
        this.minionNowHP -= damage;
        if(this.minionNowHP <= 0) isDead = true;
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

        if(minionNowHexMovement == 0) canMove = false;
    }

    boolean canMove(){
        return canMove;
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
