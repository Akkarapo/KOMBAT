package com.example.demo.src.GameStateHierarchy;

public class Minion {
    private String          ownerName;
    private int             minionNumber;
    private final String    minionName;
    private final int       minionMaxHP;
    private int             minionNowHP;
    private final int       minionDEF;
    private boolean         isDead = false;


    public Minion(String ownerName,String minionName,int minionMaxHP, int minionDEF) {
        this.ownerName = ownerName;
        this.minionName = minionName;

        this.minionMaxHP = minionMaxHP;
        this.minionNowHP = minionMaxHP;
        this.minionDEF = minionDEF;
    }

    public Minion(Minion cloneMinion) {
        this.ownerName = cloneMinion.getOwnerName();
        this.minionName = cloneMinion.getMinionName();
        this.minionMaxHP = cloneMinion.getMinionMaxHP();
        this.minionNowHP = minionMaxHP;
        this.minionDEF = cloneMinion.getMinionDEF();

    }

    public void setOwnerName(String ownerName) { this.ownerName = ownerName;}
    public void setMinionNumber(int minionNumber) { this.minionNumber = minionNumber;}

    public void minionHasAttacked(int damage){
        damage -= getMinionDEF();
        if(damage<1)    damage = 1;
        minionNowHP -= damage;
        if(minionNowHP <= 0) isDead = true;
    }

    public int getMinionNumber(){ return minionNumber;}
    public String getMinionName(){  return minionName;  }

    public String getOwnerName() {return ownerName;}

    public boolean isDead(){return isDead;}

    public int getMinionNowHP(){return minionNowHP;}

    public int getMinionMaxHP() {return minionMaxHP;}

    int getMinionDEF(){return minionDEF;}

}
