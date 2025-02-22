package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.Utilities.*;
import com.example.demo.src.MinionAndStrategyHierarchy.*;

import java.util.Scanner;
import java.util.HashSet;
import java.util.Set;
import static java.lang.Math.*;

public class GameState {

    Hex[][] gameBoard = new Hex[8][8];
    Player  player1;
    Player  player2;
    int     nowTurn = 1;
    Configloader config;
    boolean spawnMinionPerTurn;
    boolean buyHexPerTurn;

    GameState(int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turn,int max_spawns) {
       config = new Configloader(spawn_cost,hex_purchase_cost,init_budget,init_hp,turn_budget,max_budget,interest_pct,max_turn,max_spawns);

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                gameBoard[i][j] = new Hex(i,j);
            }

        }

        player1 = new Player("001",config.getInitBudget(),config.getMaxSpawns());
        gameBoard[6][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[6][7].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][5].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][7].setOwnerName(player1.getPlayerNumber());

        player2= new Player("002",config.getInitBudget(),config.getMaxSpawns());
        gameBoard[0][0].setOwnerName(player2.getPlayerNumber());
        gameBoard[0][1].setOwnerName(player2.getPlayerNumber());
        gameBoard[0][2].setOwnerName(player2.getPlayerNumber());
        gameBoard[1][0].setOwnerName(player2.getPlayerNumber());
        gameBoard[1][1].setOwnerName(player2.getPlayerNumber());
    }

    void GameStart(){
        while(nowTurn<=config.getMaxTurns()){

            if(nowTurn>1){
                player1.getMoreBudget(GetMoreMoney(config.getInterestPct(),player1.getBudget(),nowTurn,config.getTurnBudget()));
                player2.getMoreBudget(GetMoreMoney(config.getInterestPct(),player2.getBudget(),nowTurn,config.getTurnBudget()));
            }

            Player  currentPlayer = !(nowTurn % 2 == 0) ? player1 : player2;
            boolean playing = true;
            buyHexPerTurn   = true;
            spawnMinionPerTurn = true;

            Set<Hex> currPlayerHex = new HashSet<>();

            for(int i = 0; i < 8;i++) {
                for(int j = 0; j < 8; j++) {
                    if(gameBoard[i][j].getOwnerName() == currentPlayer.getPlayerNumber()){
                        currPlayerHex.add(new Hex(gameBoard[i][j].getRow(),gameBoard[i][j].getCol()));
                    }
                }
            }

            Set<Hex> NearbySet = calculateNearbyHexes(currPlayerHex);

            System.out.println("\n________________________________");
            System.out.println("Player : " + (!(nowTurn % 2 == 0) ? "1" : "2"));
            System.out.println("\nTurn "+nowTurn+" / 20");
            System.out.println("________________________________\n");
            showBoard(gameBoard,currentPlayer.getPlayerNumber());

            while(playing) {

                System.out.println("\n--------------------------------------------\n");
                System.out.println("Your budget: "+currentPlayer.getBudget());

                System.out.println("\n--------------------------------------------\n");
                System.out.println("\nChoices");
                System.out.println("1.Show your nearby hex");
                System.out.println("2.Buy hex ("+config.getHexPurchaseCost()+"$)");
                System.out.println("3.Spawn Minion ("+config.getSpawnCost()+"$)");
                System.out.println("4.Move Minion");
                System.out.println("5.Attack");
                System.out.println("6.End Turn");
                System.out.println("Your Choice:\n");

                Scanner Choice = new Scanner(System.in);
                int playerChoice = Choice.nextInt();

                int     usingCol;
                int     usingRow;
                int     usingCol2;
                int     usingRow2;


                //Nearby
                if(playerChoice == 1){
                    for (Hex hex : NearbySet) System.out.println(hex); // จะใช้ toString() ที่กำหนดไว้ใน Hex
                }

                //Buy hex
                else if(playerChoice == 2){
                    if(!buyHexPerTurn) System.out.println("You already buy hex this turn");
                    else if(currentPlayer.getBudget()<1 + config.getHexPurchaseCost()) System.out.println("U R too POOR");
                    else{
                        System.out.println("Please enter hex row:");
                        Scanner uRow = new Scanner(System.in);
                        usingRow = uRow.nextInt();
                        System.out.println("Please enter hex col:");
                        Scanner uCol = new Scanner(System.in);
                        usingCol = uCol.nextInt();

                        currentPlayer.useBudget(1);

                        if(gameBoard[usingRow][usingCol].isOwned()) System.out.println("\nHex already has owner\n");
                        else if(currentPlayer.getBudget()< config.getHexPurchaseCost()) System.out.println("\nNot enough budget\n");
                        else if(!NearbySet.contains(new Hex(usingRow,usingCol))) System.out.println("\nThis hex is too far\n");
                        else{
                            gameBoard[usingRow][usingCol].setOwnerName(currentPlayer.getPlayerNumber());
                            currentPlayer.useBudget(config.getHexPurchaseCost());
                            currPlayerHex.add(new Hex(usingRow,usingCol));
                            NearbySet = calculateNearbyHexes(currPlayerHex);

                            buyHexPerTurn = false;

                            showBoard(gameBoard,currentPlayer.getPlayerNumber());
                        }
                    }
                }

                //Spawn Minion
                else if(playerChoice == 3){
                    if(!spawnMinionPerTurn) System.out.println("You already spawn minion this turn");
                    else if(currentPlayer.getBudget()<1 + config.getSpawnCost()) System.out.println("U R too POOR");
                    else{
                        System.out.println("Please enter hex row:");
                        Scanner uRow = new Scanner(System.in);
                        usingRow = uRow.nextInt();
                        System.out.println("Please enter hex col:");
                        Scanner uCol = new Scanner(System.in);
                        usingCol = uCol.nextInt();

                        currentPlayer.useBudget(1);

                        if(gameBoard[usingRow][usingCol].getOwnerName()!=currentPlayer.getPlayerNumber() ) System.out.println("\nNot your hex\n");
                        else if(currentPlayer.getBudget()< config.getSpawnCost()) System.out.println("\nNot enough budget\n");
                        else{
                            Minion minion = new ShadowWarden(currentPlayer.getPlayerNumber(),config.getInitHP());
                            gameBoard[usingRow][usingCol].setMinion(minion);
                            currentPlayer.useBudget(config.getSpawnCost());
                            spawnMinionPerTurn = false;

                            showBoard(gameBoard,currentPlayer.getPlayerNumber());
                        }
                    }
                }

                //move minion
                else if(playerChoice == 4){
                    if(currentPlayer.getBudget()<1) System.out.println("U R too POOR");
                    else{
                        System.out.println("Please enter target hex row:");
                        Scanner uRow = new Scanner(System.in);
                        usingRow = uRow.nextInt();
                        System.out.println("Please enter target hex col:");
                        Scanner uCol = new Scanner(System.in);
                        usingCol = uCol.nextInt();
                        System.out.println("Please enter minion now hex row:");
                        Scanner uRow2 = new Scanner(System.in);
                        usingRow2 = uRow2.nextInt();
                        System.out.println("Please enter minion now hex col:");
                        Scanner uCol2 = new Scanner(System.in);
                        usingCol2 = uCol2.nextInt();

                        currentPlayer.useBudget(1);

                        if(gameBoard[usingRow][usingCol].hasMinion()) System.out.println("Already have minion in target hex");
                        else if(!gameBoard[usingRow2][usingCol2].hasMinion()) System.out.println("Don't have minion to move");
                        else if(abs(usingRow-usingRow2)>1||abs(usingCol-usingCol2)>1) System.out.println("\nThis hex is too far\n");
                        else if(!gameBoard[usingRow2][usingCol2].canMoveMinion()) System.out.println("Minion out of move");
                        else{
                            //gameBoard[usingRow][usingCol].moveMinion();
                            gameBoard[usingRow][usingCol].setMinion(gameBoard[usingRow2][usingCol2].getMinion());
                            gameBoard[usingRow2][usingCol2].removeMinion();

                            showBoard(gameBoard,currentPlayer.getPlayerNumber());
                        }
                    }
                }
                else if(playerChoice == 5){//attack
                    if(currentPlayer.getBudget()<1) System.out.println("U R too POOR");
                    else{
                        System.out.println("Please enter target hex row:");
                        Scanner uRow = new Scanner(System.in);
                        usingRow = uRow.nextInt();
                        System.out.println("Please enter target hex col:");
                        Scanner uCol = new Scanner(System.in);
                        usingCol = uCol.nextInt();
                        System.out.println("Please enter Attacker hex row:");
                        Scanner uRow2 = new Scanner(System.in);
                        usingRow2 = uRow2.nextInt();
                        System.out.println("Please enter Attacker hex col:");
                        Scanner uCol2 = new Scanner(System.in);
                        usingCol2 = uCol2.nextInt();

                        currentPlayer.useBudget(1);

                        if(!gameBoard[usingRow][usingCol].hasMinion()) System.out.println("Don't have target in this hex");
                        else if (!gameBoard[usingRow2][usingCol2].hasMinion()) System.out.println("Don't have attacker in this hex");
                        else if(abs(usingRow-usingRow2)>1||abs(usingCol-usingCol2)>1) System.out.println("\nThis hex is too far\n");
                        else{
                            gameBoard[usingRow][usingCol].attackMinionInHex(gameBoard[usingRow2][usingCol2].getMinionAttack());
                            if(gameBoard[usingRow][usingCol].isMinionDead()) gameBoard[usingRow][usingCol].removeMinion();
                        }
                    }
                }
                else if(playerChoice == 6){

                    if(nowTurn % 2 == 0) player2 = currentPlayer;
                    else player1 = currentPlayer;

                    playing = false;
                }
                else{
                    System.out.println("Invalid choice");
                }
            }

            nowTurn++;
            System.out.println("\n________________________________\n");
        }

        checkWinner(gameBoard);

    }

    private static Set<Hex> calculateNearbyHexes(Set<Hex> currPlayerHex) {
        Set<Hex> nearbySet = new HashSet<>();

        for (Hex hex : currPlayerHex) {
            Set<Hex> neighbors = Nearby.getNearby(hex.getRow(), hex.getCol());

            // เพิ่มพิกัดใกล้เคียงที่ไม่มีใน currPlayerHex
            for (Hex neighbor : neighbors) {
                if (!currPlayerHex.contains(neighbor)) {
                    nearbySet.add(neighbor);
                }
            }
        }
        return nearbySet;
    }

    private static double GetMoreMoney(int Interest,long playerBudget,int nowTurn,int TurnBudget){
        return  (((double) Interest /100*log10(playerBudget)*nowTurn)+TurnBudget);
    }

    private void moveMinion(int targetRow,int targetCol,int nowRow,int nowCol){

    }

    private static void checkWinner(Hex[][] gameBoard){
        int player1Minion=0,p1MinionSumHP=0;
        int player2Minion=0,p2MinionSumHP=0;

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if(gameBoard[i][j].hasMinion()){
                    if(gameBoard[i][j].getMinion().getOwnerName()=="001"){
                        player1Minion++;
                        p1MinionSumHP += gameBoard[i][j].getMinion().getMinionNowHP();
                    }
                    else if(gameBoard[i][j].getMinion().getOwnerName()=="002"){
                        player2Minion++;
                        p2MinionSumHP += gameBoard[i][j].getMinion().getMinionNowHP();
                    }
                }
            }
        }

        if(player1Minion>player2Minion) System.out.println("Player 1 wins!");
        else if(player2Minion>player1Minion) System.out.println("Player 2 wins!");
        else if(p1MinionSumHP>p2MinionSumHP) System.out.println("Player 1 wins!");
        else if(p2MinionSumHP>p1MinionSumHP) System.out.println("Player 2 wins!");
        else System.out.println("Draw!");
    }

    private static void showBoard(Hex[][] gameBoard,String PlayerName){

        for (int i = 0; i < 48; i++) {
            for (int j = 0; j < 8; j++) {
                if ((i % 6 == 3) && (j % 2 == 0)) {
                    System.out.printf("[%d, %d]           ", (i / 6), j);
                } else if ((i % 6 == 0) && (j % 2 == 1)) {
                    System.out.printf("[%d, %d]           ", (i / 6), j);
                } else if (((i % 6 == 4) && (j % 2 == 0))||((i % 6 == 1) && (j % 2 == 1))) {
                    System.out.print( "Owner :  ");
                    if(gameBoard[i/6][j].getOwnerName()=="001") System.out.print("P1        ");
                    else if(gameBoard[i/6][j].getOwnerName()=="002") System.out.print("P2        ");
                    else System.out.print("None    ");
                }
                else if (((i % 6 == 5)&& (j % 2 == 0))||((i % 6 == 2) && (j % 2 == 1))) {
                    System.out.print("Minion : ");
                    if(gameBoard[i/6][j].hasMinion() && gameBoard[i/6][j].getMinion().getOwnerName()==PlayerName ) System.out.print("Has Minion");
                    else if (!gameBoard[i/6][j].hasMinion()&&gameBoard[i/6][j].getOwnerName()==PlayerName) System.out.print("Empty     ");
                    else System.out.print("Unknown ");
                }
                else {
                    System.out.print("                 ");
                }
            }
            System.out.println();
        }
    }

}
