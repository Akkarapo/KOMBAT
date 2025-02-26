package com.example.demo.src.MinionAndStrategyHierarchy;
//skill turn ละครั้ง
public class Minion {
    private final String ownerName;
    private int minionMaxHP;
    private int minionNowHP;
    private final int minionATK;
    private final int minionDEF;
    private final int minionMaxHexMovement;
    private int minionNowHexMovement;
    //int minionAttackRange;

    boolean isDead = false;
    //boolean alreadyUseSkill;

    public Minion(String ownerName,int minionMaxHP, int minionATK, int minionDEF,int minionMaxHexMovement) {
        this.ownerName = ownerName;

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

    public void moveMinion(){ if(minionNowHexMovement>0) minionNowHexMovement -= 1;}

    public boolean canMove(){
        return getMinionNowHexMovement()>0;
    }

    public void resetNowHexMovement(){ minionNowHexMovement = minionMaxHexMovement;}

    public String getOwnerName() {return ownerName;}

    public boolean isDead(){
        return isDead;
    }

    public int getMinionNowHP(){
        return minionNowHP;
    }

    int getMinionDEF(){
        return minionDEF;
    }

    int getMinionNowHexMovement(){
        return minionNowHexMovement;
    }

    public int getMinionATK() {return minionATK;}

    //int getMinionMaxHexMovement(){return minionMaxHexMovement;}
    //int getMinionMaxHP(){return minionMaxHP;}
}
