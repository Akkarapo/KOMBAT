package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.Utilities.*;
import com.example.demo.src.MinionAndStrategyHierarchy.*;

import java.util.Scanner;

public class GameState {

    Hex[][] gameBoard = new Hex[8][8];
    Player  player1;
    Player  player2;
    int     nowTurn = 1;
    Configloader config;

    GameState(Minion player1FirstMinion,Minion player2FirstMinion,int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turn,int max_spawns) {
       config = new Configloader(spawn_cost,hex_purchase_cost,init_budget,init_hp,turn_budget,max_budget,interest_pct,max_turn,max_spawns);

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                gameBoard[i][j] = new Hex(i+1,j+1);
            }

        }

        player1 = new Player("001",config.getInitBudget(),config.getMaxSpawns(),player1FirstMinion, gameBoard[7][7]);
        gameBoard[7][7].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][7].setMinion(player1FirstMinion,player1.getPlayerNumber());


        player2= new Player("002",config.getInitBudget(),config.getMaxSpawns(),player2FirstMinion, gameBoard[0][0]);
        gameBoard[0][0].setOwnerName(player2.getPlayerNumber());
        gameBoard[0][0].setMinion(player2FirstMinion,player2.getPlayerNumber());

    }

    void GameStart(){
        while(nowTurn<config.getMaxTurns()){
            Player  currentPlayer = (nowTurn % 2 == 0) ? player1 : player2;
            boolean playing = true;

            System.out.println("________________________________");
            System.out.println("Turn "+nowTurn+" \n");

            while(playing) {
                System.out.println("Choices");
                System.out.println("1.Show your hex");
                System.out.println("2.Show your nearby hex");
                System.out.println("3.Buy hex");
                System.out.println("4.Spawn Minion");
                System.out.println("5.Move Minion");
                System.out.println("6.Attack");
                System.out.println("7.Exit");
                System.out.println("Your Choice:");

                Scanner Choice = new Scanner(System.in);
                int playerChoice = Choice.nextInt();

                Hex[] currPlayerHex = currentPlayer.getOwnHex();
                int     usingCol;
                int     usingRow;
                int     usingCol2;
                int     usingRow2;

                if(playerChoice == 1){

                    for (Hex playerHex : currPlayerHex) {
                        System.out.print(playerHex.getRow() + "," + playerHex.getCol()+"Minion:"+playerHex.hasMinion());
                    }
                }
                else if(playerChoice == 2){
                    System.out.println("Please enter hex row:");
                    Scanner uRow = new Scanner(System.in);
                    usingRow = uRow.nextInt();
                    System.out.println("Please enter hex col:");
                    Scanner uCol = new Scanner(System.in);
                    usingCol = uCol.nextInt();


                }
                else if(playerChoice == 3){
                    System.out.println("Please enter hex row:");
                    Scanner uRow = new Scanner(System.in);
                    usingRow = uRow.nextInt();
                    System.out.println("Please enter hex col:");
                    Scanner uCol = new Scanner(System.in);
                    usingCol = uCol.nextInt();

                    if(gameBoard[usingRow][usingCol].isOwned()||currentPlayer.getBudget()< config.getHexPurchaseCost()) System.out.println("Can't buy hex");
                    else{
                        gameBoard[usingRow][usingCol].setOwnerName(currentPlayer.getPlayerNumber());
                        currentPlayer.useBudget(config.getHexPurchaseCost());
                        currentPlayer.getHex(gameBoard[usingRow][usingCol]);
                    }
                }
                else if(playerChoice == 4){//spawn
                    System.out.println("Please enter hex row:");
                    Scanner uRow = new Scanner(System.in);
                    usingRow = uRow.nextInt();
                    System.out.println("Please enter hex col:");
                    Scanner uCol = new Scanner(System.in);
                    usingCol = uCol.nextInt();

                    if(gameBoard[usingRow][usingCol].getOwnerName()!=currentPlayer.getPlayerNumber() || currentPlayer.getBudget()< config.getSpawnCost()) System.out.println("Can't spawn minion");
                    else{
                        Minion minion = new Minion(config.getInitHP());
                        gameBoard[usingRow][usingCol].setMinion(minion,currentPlayer.getPlayerNumber());
                        currentPlayer.useBudget(config.getSpawnCost());
                        currentPlayer.spawnMinion(minion,usingRow,usingCol);
                    }
                }
                else if(playerChoice == 5){//move
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
                    if(gameBoard[usingRow][usingCol].getOwnerName()!=currentPlayer.getPlayerNumber() || gameBoard[usingRow2][usingCol2].getOwnerName()!=currentPlayer.getPlayerNumber()||gameBoard[usingRow][usingCol].hasMinion()) System.out.println("Can't move minion");
                    else if(!gameBoard[usingRow2][usingCol2].hasMinion()) System.out.println("Don't have minion");
                    else{
                        gameBoard[usingRow][usingCol].setMinion(gameBoard[usingRow2][usingCol2].getMinion(),currentPlayer.getPlayerNumber());
                        gameBoard[usingRow2][usingCol2].removeMinion();

                    }
                }
                else if(playerChoice == 6){//attack
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

                    if(!gameBoard[usingRow][usingCol].hasMinion()){
                        System.out.println("Don't have target in this hex");
                    }
                    else if (!gameBoard[usingRow2][usingCol2].hasMinion()) {
                        System.out.println("Don't have attacker in this hex");
                    }
                    else{
                        gameBoard[usingRow][usingCol].attackMinionInHex(gameBoard[usingRow2][usingCol2].getMinionAttack());

                        if(gameBoard[usingRow][usingCol].isMinionDead()){
                            gameBoard[usingRow][usingCol].removeMinion();
                            if(gameBoard[usingRow][usingCol].getOwnerName()=="001") player1.removeMinion(usingRow,usingCol);
                            else if(gameBoard[usingRow][usingCol].getOwnerName()=="002") player2.removeMinion(usingRow,usingCol);
                            }
                        }
                    }

                else if(playerChoice == 7){

                    if(nowTurn % 2 == 0) player2 = currentPlayer;
                    else player1 = currentPlayer;

                    playing = false;
                }
            }

            nowTurn++;
            System.out.println("________________________________");
        }
    }
}
