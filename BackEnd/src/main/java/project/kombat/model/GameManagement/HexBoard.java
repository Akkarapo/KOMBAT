package project.kombat.model.GameManagement;


import project.kombat.model.MinionAndStrategyHierarchy.*;

public class HexBoard {
    Hex[][] hexBoard = new Hex[8][8];

    public HexBoard(int rowSpawnP1, int colSpawnP1, Player spawnP1, int rowSpawnP2, int colSpawnP2, Player spawnP2) {
        setOwner(rowSpawnP1, colSpawnP1, spawnP1);
        setOwner(rowSpawnP2, colSpawnP2, spawnP2);
    }

    boolean isOwned(int row, int col){
        return hexBoard[row][col].isOwned();
    }

    void setOwner(int row, int col, Player owner){

    }
    void setMinion(int row, int col,Minion minion){

    }
    void removeMinion(int row, int col){

    }

}
