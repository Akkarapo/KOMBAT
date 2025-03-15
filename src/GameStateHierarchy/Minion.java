package com.example.demo.src.GameStateHierarchy;

public class Minion {
    private final String    ownerName;
    private final String    minionName;
    private final int       minionMaxHP;
    private int             minionNowHP;
    private final int       minionATK = 1;
    private final int       minionDEF;
    private final int       minionMaxHexMovement = 1;
    private int             minionNowHexMovement;
    private int             minionAttackRange = 1;
    private boolean         isDead = false;
    //boolean alreadyUseSkill;

    public Minion(String ownerName,String minionName,int minionMaxHP, int minionDEF) {
        this.ownerName = ownerName;
        this.minionName = minionName;

        this.minionMaxHP = minionMaxHP;
        this.minionNowHP = minionMaxHP;
        this.minionDEF = minionDEF;
        //this.minionMaxHexMovement = minionMaxHexMovement;
        this.minionNowHexMovement = minionMaxHexMovement;

    }

    public int minionAttack(){
        return minionATK;
    }

    public void minionHasAttacked(int damage){
        damage -= getMinionDEF();
        if(damage<1)    damage = 1;
        minionNowHP -= damage;
        if(minionNowHP <= 0) isDead = true;
    }

    public void healMinion(int heal){
        if (heal + minionNowHP > minionMaxHP) minionNowHP = minionMaxHP;
        else minionNowHP += heal;
    }

    public String getMinionName(){  return minionName;  }

    public void moveMinion(){ if(minionNowHexMovement>0) minionNowHexMovement -= 1;}

    public boolean canMove(){return getMinionNowHexMovement()>0;}

    public void resetNowHexMovement(){ minionNowHexMovement = minionMaxHexMovement;}

    public String getOwnerName() {return ownerName;}

    public boolean isDead(){return isDead;}

    public int getMinionNowHP(){return minionNowHP;}

    public int getMinionMaxHP() {return minionMaxHP;}

    int getMinionDEF(){return minionDEF;}

    int getMinionNowHexMovement(){return minionNowHexMovement;}

    public int getMinionAttackRange(){return minionAttackRange;}

    public int getMinionATK() {return minionATK;}

}
