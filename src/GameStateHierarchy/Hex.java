package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.MinionAndStrategyHierarchy.*;
import java.util.Objects;

public class Hex {
    //Player owner;
    String ownerName;
    Minion minion;
    int row;
    int col;

    public Hex(int row, int col){
        this.row = row;
        this.col = col;
        this.ownerName = "";
        this.minion = null;
    }

    void setMinion(Minion minion,String ownerName){
        if(getOwnerName() == ownerName){
            this.minion = minion;
        }
    }

    public void removeMinion(){
        this.minion = null;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    public String getOwnerName() {
        return ownerName;
    }

    public boolean isOwned(){
        return !(ownerName=="");
    }

    public boolean hasMinion(){
        return minion != null;
    }

    public void attackMinionInHex(int Damage){
        if (minion != null) minion.minionHasAttacked(Damage);
    }

    public boolean isMinionDead(){
        return minion.isDead();
    }

    public int getMinionAttack(){
        return minion.minionAttack();
    }

    public Minion getMinion() {
        return minion;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Hex hex = (Hex) o;
        return row == hex.row && col == hex.col;
    }

    @Override
    public int hashCode() {
        return Objects.hash(row, col);
    }

    // วิธีการแสดงผล
    @Override
    public String toString() {
        return "Hex[" + row + "," + col + "]";
    }
}
