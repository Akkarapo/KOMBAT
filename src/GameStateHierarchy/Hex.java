package com.example.demo.src.GameStateHierarchy;

import java.util.Objects;

public class Hex {
    //Player owner;
    private String ownerName;
    private Minion minion;
    private final int row;
    private final int col;

    public Hex(int row, int col){
        this.row = row;
        this.col = col;
        this.ownerName = "";
        this.minion = null;
    }

    public void setMinion(Minion minion){
            this.minion = minion;
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

    public boolean isMinionDead(){
        return minion.isDead();
    }

    public Minion getMinion() { return minion;  }

    public int getRow() {   return row; }

    public int getCol() {   return col; }


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
    /*
    @Override
    public String toString() {
        return "Hex[" + row + "," + col + "]";
    }*/
}
