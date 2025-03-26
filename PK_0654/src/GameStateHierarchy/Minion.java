package com.example.demo.PK_0654.src.GameStateHierarchy;

public class Minion {
    private String          ownerName;
    private final int       minionType;
    private int             minionNumber;
    private final String    minionName;
    private final int       minionMaxHP;
    private int             minionNowHP;
    private final int       minionDEF;
    private boolean         isDead = false;

    private String          MinionStrategy;


    public Minion(String ownerName,String minionName,int minionMaxHP, int minionDEF,String MinionStrategy,int minionType) {
        this.ownerName = ownerName;
        this.minionName = minionName;
        this.minionType = minionType;

        this.minionMaxHP = minionMaxHP;
        this.minionNowHP = minionMaxHP;
        this.minionDEF = minionDEF;

        this.MinionStrategy = MinionStrategy;
    }

    public Minion(Minion cloneMinion) {
        this.ownerName = cloneMinion.getOwnerName();
        this.minionName = cloneMinion.getMinionName();
        this.minionMaxHP = cloneMinion.getMinionMaxHP();
        this.minionNowHP = minionMaxHP;
        this.minionDEF = cloneMinion.getMinionDEF();
        this.MinionStrategy = cloneMinion.getMinionStrategy();
        this.minionType = cloneMinion.getMinionType();
    }

    public String getMinionStrategy() {
        return MinionStrategy;
    }

    public void setMinionStrategy(String MinionStrategy) {
        this.MinionStrategy = MinionStrategy;
    }

    public int getMinionType() { return minionType; }
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
