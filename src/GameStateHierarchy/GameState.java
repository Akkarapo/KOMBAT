package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.Utilities.*;

import java.util.Scanner;

import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import static com.example.demo.src.Utilities.Direction.*;
import static java.lang.Math.*;

public class GameState {

    Configloader    config;
    int             GameMode;
    Hex[][]         gameBoard = new Hex[8][8];
    int             minionTypeAmount;
    Minion[]        MinionType;
    int             nowTurn = 1;

    Player          player1;
    boolean         ISp1SpawnFirstMinion;

    Player          player2;
    boolean         ISp2SpawnFirstMinion;

    Player          currentPlayer;
    boolean         spawnMinionPerTurn;
    boolean         buyHexPerTurn;

    Map<Integer, Hex>   currPlayerHex;
    Map<Integer, Hex>   NearbySet;

    Boolean         GameEnd;

    /** Set ค่าใน Config และค่าตั้งต้นสำหรับผู้เล่นทั้งสองฝั่ง
     *  @param spawn_cost           ค่าลง minion
     *  @param hex_purchase_cost    ค่าซื้อช่อง
     *  @param init_budget          เงินตั้งต้น
     *  @param init_hp              new spawn Minion HP
     *  @param turn_budget          เงินเพิ่มแต่ละตา
     *  @param max_budget           เงินสูงสุด
     *  @param interest_pct         อัตราดอกเบี้ยพื้นฐาน
     *  @param max_turn             เทิร์นสูงสุด
     *  @param max_spawns           Minion สูงสุด
     *  @param minionTypeAmount     จำนวนประเภทมินเนี่ยน
     *  @param minionName           ชื่อมินเนี่ยนแต่ละแบบ
     *  @param minionDEF            พลังป้องกันของมินเนี่ยนแต่ละแบบ
     */
    GameState(int mode, int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turn,int max_spawns, int minionTypeAmount , String[] minionName, int[] minionDEF, String[] MinionStrategy) {
       config = new Configloader(spawn_cost,hex_purchase_cost,init_budget,init_hp,turn_budget,max_budget,interest_pct,max_turn,max_spawns);

       this.GameMode    = mode;
       GameEnd          = false;

       //set row and col แต่ละช่อง
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                gameBoard[i][j] = new Hex(i,j);
            }
        }

        this.minionTypeAmount = minionTypeAmount;
        MinionType = new Minion[this.minionTypeAmount];
        for (int i = 0; i < this.minionTypeAmount; i++) {
            MinionType[i] = new Minion("000",minionName[i],config.getInitHP(),minionDEF[i],MinionStrategy[i]);
        }

        String P1Type="Human",P2Type="Human";
        if(mode == 1){P1Type = "Human";P2Type = "Human";}
        else if(mode == 2){P1Type = "Human";P2Type = "Bot";}
        else if(mode == 3){P1Type = "Bot";P2Type = "Bot";}


        //set ค่าและพื้นที่ของผู้เล่นแต่ละคน
        player1 = new Player("001",P1Type,config.getInitBudget());
        ISp1SpawnFirstMinion = false;
        gameBoard[6][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[6][7].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][5].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][7].setOwnerName(player1.getPlayerNumber());

        player2= new Player("002",P2Type,config.getInitBudget());
        ISp2SpawnFirstMinion = false;
        gameBoard[0][0].setOwnerName(player2.getPlayerNumber());
        gameBoard[0][1].setOwnerName(player2.getPlayerNumber());
        gameBoard[0][2].setOwnerName(player2.getPlayerNumber());
        gameBoard[1][0].setOwnerName(player2.getPlayerNumber());
        gameBoard[1][1].setOwnerName(player2.getPlayerNumber());
    }

    /** วน loop ดำเนินเกมจนกว่าจะครบเทิร์นสูงสุดหรือ มีผู้เล่นแพ้ไปก่อน
     *  มีการเรียกใช้คำสั่งต่างๆเพื่อดำเนินการเล่นเกม
     *  หมายเหตุ:
     *  1.จะมีการปรับปรุงย่อย Method อีกทีเนื่องจากหลายๆอย่างถูกใช้โดยตรงในนี้ โดยอาจมีมากกว่าที่เขียนเตรียมไว้ด้านล่าง
     *  2.ยังไม่ได้ check กรณีแพ้เพราะมินเนี่ยนตายหมด
     *  3.คลาสมินเนี่ยนยังบัคทำให้ยัง test การตีกันของมินเนี่ยนไม่ได้และยังจำกัดจำนวนครั้งการมูฟไม่ได้(ต้องการทำมินเนี่ยนบางตัวให้เดินได้มากกว่า 1 รอบ)
     */
    int GameStart(){
        while(nowTurn<=config.getMaxTurns()){

            if(nowTurn>1){ //เพิ่มเงินให้ผู้เล่นเมื่อเริ่มเทิร์น
                player1.getMoreBudget(GetMoreMoney(config.getInterestPct(),player1.getBudget(),nowTurn,config.getTurnBudget()),config.getMaxBudget());
                player2.getMoreBudget(GetMoreMoney(config.getInterestPct(),player2.getBudget(),nowTurn,config.getTurnBudget()),config.getMaxBudget());
            }

            //Set ค่าตั้งต้นแต่ละเทิร์นให้ผู้เล่น
            currentPlayer   = !(nowTurn % 2 == 0) ? player1 : player2;
            boolean playing         = true;
            buyHexPerTurn           = true;
            spawnMinionPerTurn      = true;

            //เก็บ Hex ที่ผู้เล่นปัจจุบันเป็นเจ้าของมาไว้ดู
            currPlayerHex = new HashMap<>();
            int index = 0;
            for (int i = 0; i < 8; i++) {
                for (int j = 0; j < 8; j++) {
                    if (gameBoard[i][j].getOwnerName() == currentPlayer.getPlayerNumber()) {
                        currPlayerHex.put(index++, new Hex(gameBoard[i][j].getRow(), gameBoard[i][j].getCol()));
                    }
                }
            }

            NearbySet = calculateNearbyHexes(currPlayerHex);

            //สำหรับแสดงผลก่อนเชื่อม
            System.out.println("\n________________________________");
            System.out.println("Player : " + (!(nowTurn % 2 == 0) ? "1" : "2"));
            System.out.println("\nTurn "+nowTurn+" / 20");
            System.out.println("________________________________\n");
            showBoard();

            if(currentPlayer.getPlayerType() == "Bot"){
                gameBot();
            }
            else if(currentPlayer.getPlayerType() == "Human"){
                while(playing) {

                    /*สำหรับทดสอบการทำงานก่อนเชื่อม โดยสั่งโดยตรงจากคีย์บอร์ด*/
                    System.out.println("\n--------------------------------------------\n");
                    System.out.println("Your budget: "+currentPlayer.getBudget());
                    System.out.println("Player : " + (!(nowTurn % 2 == 0) ? "1" : "2"));
                    System.out.print("Minion on bord are hex : ");
                    currentPlayer.minionsPlayerHave().forEach((k, v) -> System.out.print(k + ") " + "["+v[0]+","+v[1]+"]"));
                    System.out.print("\nNearby Hex  :");
                    for (Hex hex : NearbySet.values())System.out.print(" ["+hex.getRow()+","+hex.getCol()+"]");
                    System.out.println("\n--------------------------------------------\n");
                    System.out.println("\nChoices");
                    System.out.println("1.Buy hex ("+config.getHexPurchaseCost()+"$)");
                    System.out.println("2.Spawn Minion ("+config.getSpawnCost()+"$)");
                    System.out.println("3.End Turn");
                    System.out.print("Your Choice:");

                    //รับคำสั่งที่จะทดสอบ
                    Scanner Choice = new Scanner(System.in);
                    int playerChoice = Choice.nextInt();

                    int[]   targetHex;
                    int[]   nowHexCoor;

                    //Buy hex
                    if(playerChoice == 1){
                        if(!buyHexPerTurn) System.out.println("You already buy hex this turn");
                        else if(!haveEnoughMoney(currentPlayer.getBudget(),config.getHexPurchaseCost())) System.out.println("U R too POOR");
                        else{

                            for (Map.Entry<Integer, Hex> entry : NearbySet.entrySet()) {
                                System.out.println((entry.getKey()+1) + ") [" + entry.getValue().getRow() + "," + entry.getValue().getCol() + "]");
                            }

                            int hexChoice = 1;
                            while(true) {
                                System.out.print("Select hex to purchase:");
                                hexChoice = Choice.nextInt();
                                hexChoice--;
                                if (NearbySet.containsKey(hexChoice)) break;
                                else System.out.println("Invalid selection. Try again:");
                            }

                            Hex selectedHex = NearbySet.get(hexChoice);
                            targetHex = new int[]{selectedHex.getRow(), selectedHex.getCol()};
                            buyHex(targetHex);

                            if (gameBoard[targetHex[0]][targetHex[1]].getOwnerName() == currentPlayer.getPlayerNumber()) {
                                int newIndex = currPlayerHex.size();  // กำหนด index ใหม่จากขนาดของ Map
                                currPlayerHex.put(newIndex, new Hex(targetHex[0], targetHex[1]));
                            }

                            NearbySet = calculateNearbyHexes(currPlayerHex);
                        }
                    }

                    //Spawn Minion
                    else if(playerChoice == 2){
                        if(currentPlayer.getCountSpawnedMinions()==config.getMaxSpawns()) System.out.println("Minion spawn limit reached");
                        else if(!spawnMinionPerTurn) System.out.println("You already spawn minion this turn");
                        else if(!haveEnoughMoney(currentPlayer.getBudget(),config.getSpawnCost())) System.out.println("U R too POOR");
                        else{
                            targetHex = getRowAndCol("");
                            int minionTypeChoice = 1;
                            boolean choosing = true;
                            while(choosing) {
                                System.out.println("Select minion");
                                for(int i=0;i<minionTypeAmount;i++) System.out.println((i+1)+") "+MinionType[i].getMinionName());
                                minionTypeChoice = Choice.nextInt();

                                if(minionTypeChoice>minionTypeAmount || minionTypeChoice<1) System.out.println("Invalid value");
                                else choosing = false;
                            }

                            spawnMinion(targetHex,(minionTypeChoice-1));
                        }
                    }
                    //End Turn
                    else if(playerChoice == 3){
                        if(nowTurn % 2 == 0) player2 = currentPlayer;
                        else player1 = currentPlayer;

                        playing = false;
                    }
                    else System.out.println("Invalid choice");

                    if(player2.getNowMinionPlayerHave()==0 && ISp2SpawnFirstMinion) break;
                    else if(player1.getNowMinionPlayerHave()==0 && ISp1SpawnFirstMinion) break;
                }//วงเล็บของการกระทำในเทิร์น
            }//ปีกกา else if human or bot

            Map<Integer, int[]> minions = currentPlayer.minionsPlayerHave();
            for (Map.Entry<Integer, int[]> entry : minions.entrySet()) {
                boolean minionEnd = true;
                while(minionEnd){

                    // read Strategy and do something get command

                    String  Command,subCommand;
                    int     cost;

                    int[] minionNowHex = new int[]{entry.getValue()[0],entry.getValue()[1]};
                    int[] targetHex;

                    //if(){}
                    if(Command == "random"){ //incomplete
                        new Random().nextInt(999);
                    }
                    else if(Command == "opponent"){
                        //incomplete
                        String targetToFind = currentPlayer.getPlayerNumber()== "001" ? "002" : "001" ;
                        findNearestMinionDistance(minionNowHex,targetToFind);
                    }
                    else if(Command == "ally"){
                        //incomplete
                        String targetToFind = currentPlayer.getPlayerNumber();
                        findNearestMinionDistance(minionNowHex,targetToFind);
                    }
                    else if(Command == "nearby"){
                        if(subCommand == "up")               nearbyUp(targetHex, currentPlayer.getPlayerNumber());
                        else if(subCommand == "upright")     nearbyUpRight(targetHex,currentPlayer.getPlayerNumber());
                        else if(subCommand == "downright")   nearbyDownRight(targetHex,currentPlayer.getPlayerNumber());
                        else if(subCommand == "down")        nearbyDown(targetHex,currentPlayer.getPlayerNumber());
                        else if(subCommand == "downleft")    nearbyDownLeft(targetHex,currentPlayer.getPlayerNumber());
                        else if(subCommand == "upleft")      nearbyUpLeft(targetHex,currentPlayer.getPlayerNumber());
                    }
                    else if(Command == "shoot"){
                        if(subCommand == "up"){ targetHex = up(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "upright"){ targetHex = upright(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "downright"){ targetHex = downright(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "down"){ targetHex = down(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "downleft"){targetHex = downleft(minionNowHex[0],minionNowHex[1]);}
                        else if(subCommand == "upleft"){targetHex = upleft(minionNowHex[0],minionNowHex[1]);}
                        attackEnemy(targetHex,minionNowHex,cost);
                    }
                    else if(Command == "move"){
                        targetHex = new int[]{-1,-1};
                        if(subCommand == "up"){ targetHex = up(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "upright"){ targetHex = upright(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "downright"){ targetHex = downright(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "down"){ targetHex = down(minionNowHex[0],minionNowHex[1]); }
                        else if(subCommand == "downleft"){targetHex = downleft(minionNowHex[0],minionNowHex[1]);}
                        else if(subCommand == "upleft"){targetHex = upleft(minionNowHex[0],minionNowHex[1]);}

                        if(targetHex[0] == -1){ minionEnd = false; }
                        else{ moveMinion(targetHex,minionNowHex);}
                    }
                    else if(Command == "done"){ minionEnd = false; }

                }
            }

            if(player2.getNowMinionPlayerHave()==0 && ISp2SpawnFirstMinion) break;
            else if(player1.getNowMinionPlayerHave()==0 && ISp1SpawnFirstMinion) break;

            nowTurn++;
            System.out.println("\n________________________________\n");
        }//วงเล็บของเทิร์น

        return checkWinner();
    }

    private void gameBot() {
        boolean canBuyHex = !NearbySet.isEmpty(); // ต้องมี Hex ให้ซื้อ
        boolean canBuyMinion = currentPlayer.getCountSpawnedMinions() < config.getMaxSpawns(); // ต้องไม่เกินจำนวนที่กำหนด

        List<Integer> actions = new ArrayList<>(Arrays.asList(1, 2, 3));
        Collections.shuffle(actions); // สับลำดับของ action เพื่อให้ทำอะไรก่อนก็ได้

        for (int action : actions) {
            if (action == 1) {
                break; // จบเทิร์น
            } else if (action == 2 && canBuyHex) {
                // สุ่มซื้อ Hex
                System.out.println("________________________________\n");
                List<Hex> hexList = new ArrayList<>(NearbySet.values());
                Hex chosenHex = hexList.get(new Random().nextInt(hexList.size()));
                buyHex(new int[]{chosenHex.getRow(), chosenHex.getCol()});
                System.out.println("________________________________\n");
            } else if (action == 3 && canBuyMinion) {
                // สุ่มลง Minion
                List<Hex> availableHexes = new ArrayList<>();
                for (Hex hex : currPlayerHex.values()) {
                    if (!gameBoard[hex.getRow()][hex.getCol()].hasMinion()) {
                        availableHexes.add(hex);
                    }
                }
                if (!availableHexes.isEmpty()) {
                    Hex chosenHex = availableHexes.get(new Random().nextInt(availableHexes.size()));
                    int minionType = new Random().nextInt(minionTypeAmount);
                    System.out.println("________________________________\n");
                    spawnMinion(new int[]{chosenHex.getRow(), chosenHex.getCol()}, minionType);
                    System.out.println("________________________________\n");
                }
            }
        }
    }

    /** ซื้อช่องเพิ่ม //ต้องไปเอาจากด้านบนมาใส่ในนี้
    *   effects: ช่องจะมีเจ้าของ
    *   @param targetHex    ช่องที่จะซื้อ
    * */
    private void buyHex(int[] targetHex) {
        if(!NearbySet.containsValue(new Hex(targetHex[0],targetHex[1]))) System.out.println("\n\nThis hex is too far\n\n");
        else if(gameBoard[targetHex[0]][targetHex[1]].isOwned()) System.out.println("\n\"\nHex already has owner\n\"\n");
        else if(gameBoard[targetHex[0]][targetHex[1]].getOwnerName() == ""){
            gameBoard[targetHex[0]][targetHex[1]].setOwnerName(currentPlayer.getPlayerNumber());
            currentPlayer.useBudget(config.getHexPurchaseCost());
            buyHexPerTurn = false;
            showBoard();
        }
    }

    private void spawnMinion(int[] targetHex,int minionType){

        if(gameBoard[targetHex[0]][targetHex[1]].getOwnerName() != currentPlayer.getPlayerNumber()) System.out.println("\n\"\nNot your hex\n\"\n");
        else if(gameBoard[targetHex[0]][targetHex[1]].hasMinion()) System.out.println("You already have minion in this hex");
        else{
            if(!ISp1SpawnFirstMinion && currentPlayer.getPlayerNumber()=="001") ISp1SpawnFirstMinion = true;
            else if(!ISp2SpawnFirstMinion && currentPlayer.getPlayerNumber()=="002") ISp2SpawnFirstMinion = true;

            Minion newSpawnMinion = new Minion(MinionType[minionType]);
            newSpawnMinion.setOwnerName(currentPlayer.getPlayerNumber());
            currentPlayer.spawnNewMinion(targetHex);
            newSpawnMinion.setMinionNumber(currentPlayer.getCountSpawnedMinions());
            gameBoard[targetHex[0]][targetHex[1]].setMinion(newSpawnMinion);
            spawnMinionPerTurn = false;
            showBoard();
        }
    }

    /** ซื้อช่องเพิ่ม //ต้องไปเอาจากด้านบนมาใส่ในนี้
     *   effects: ช่องที่เคยมีมินเนี่ยนจะไม่มีมินเนี่ยน ช่องเป้าหมายที่ไม่มีมินเนี่ยนจะมีมินเนี่ยน
     *   @param targetHex   ช่องที่จะซื้อ
     *   @param nowHexCoor      ช่องปัจจุบันของมินเนี่ยน
     * */
    private void moveMinion(int[] targetHex,int[] nowHexCoor){
        currentPlayer.useBudget(1);

        if(gameBoard[targetHex[0]][targetHex[1]].hasMinion()) System.out.println("Already have minion in target hex");//done
        else if(!gameBoard[nowHexCoor[0]][nowHexCoor[1]].hasMinion()||gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion().getOwnerName()!= currentPlayer.getPlayerNumber())
            System.out.println("Don't have your minion to move");
        else if(abs(targetHex[0]-nowHexCoor[0])>1||abs(targetHex[1]-nowHexCoor[1])>1) System.out.println("\nThis hex is too far\n");
        else{
            currentPlayer.changeMinionHex(gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion().getMinionNumber(), targetHex);

            gameBoard[targetHex[0]][targetHex[1]].setMinion(gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion());
            gameBoard[nowHexCoor[0]][nowHexCoor[1]].removeMinion();

            showBoard();
        }
    }

    //หาแบบตามเข็มนาฬิกา
    private int[] findNearestMinionDistance(int[] targetHex,String target){
        int[] nearestMinionHex = new int[]{-1,-1};
        int distance = 0;

        //up
        if(targetHex[0] != 0){
            for(int i = targetHex[0]-1; i>=0; i--){
                if(gameBoard[i][targetHex[1]].hasMinion() && gameBoard[i][targetHex[1]].getMinion().getOwnerName() == target){
                    nearestMinionHex = new int[]{i,targetHex[1]};
                    distance = targetHex[0] - i;

                    if(distance == 1) return nearestMinionHex;
                }
            }
        }

        //upright
        if(targetHex[1] != 7 || !(targetHex[0] == 0 && (targetHex[1] % 2 == 1) ) ){
            int row = targetHex[1] % 2 == 0 ? targetHex[0] : targetHex[0] - 1;
            int col = targetHex[1]+1;
            while(true){
                if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                    if(col - targetHex[1] < distance){
                        nearestMinionHex = new int[]{row,col};
                        distance = col - targetHex[1];

                        if(distance == 1) return nearestMinionHex;
                    }
                    break;
                }
                if(col == 7 || (col % 2 == 1 && row == 0) ) break;
                row = col % 2 == 0 ? row : row - 1;
                col++;
            }
        }

        //downright
        if(targetHex[1] != 7 || !(targetHex[0] == 7 && (targetHex[1] % 2 == 0) ) ){
            int row = targetHex[1] % 2 == 0 ? targetHex[0]+1 : targetHex[0];
            int col = targetHex[1]+1;
            while(true){
                if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                    if(col - targetHex[1] < distance){
                        nearestMinionHex = new int[]{row,col};
                        distance = col - targetHex[1];

                        if(distance == 1) return nearestMinionHex;
                    }
                    break;
                }
                if(col == 7 || (col % 2 == 0 && row == 7) ) break;
                row = col % 2 == 0 ? row+1 : row ;
                col++;
            }
        }

        //down
        if(targetHex[0] != 7){
            for(int i = targetHex[0]+1; i<=7; i++){
                if(gameBoard[i][targetHex[1]].hasMinion() && gameBoard[i][targetHex[1]].getMinion().getOwnerName() == target){
                    nearestMinionHex = new int[]{i,targetHex[1]};
                    distance = i - targetHex[0];

                    if(distance == 1) return nearestMinionHex;
                }
            }
        }

        //downleft
        if(targetHex[1] != 0 || !(targetHex[0] == 7 && (targetHex[1] % 2 == 0) ) ){
            int row = targetHex[1] % 2 == 0 ? targetHex[0]+1 : targetHex[0];
            int col = targetHex[1]-1;
            while(true){
                if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                    if(col - targetHex[1] < distance){
                        nearestMinionHex = new int[]{row,col};
                        distance = targetHex[1] - col;

                        if(distance == 1) return nearestMinionHex;
                    }
                    break;
                }
                if(col == 0 || (col % 2 == 0 && row == 7) ) break;
                row = col % 2 == 0 ? row+1 : row;
                col--;
            }
        }

        if(targetHex[1] != 0 || !(targetHex[0] == 0 && (targetHex[1] % 2 == 1) ) ){
            int row = targetHex[1] % 2 == 0 ? targetHex[0] : targetHex[0] - 1;
            int col = targetHex[1]-1;
            while(true){
                if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                    if(col - targetHex[1] < distance){
                        nearestMinionHex = new int[]{row,col};
                        distance = col - targetHex[1];

                        if(distance == 1) return nearestMinionHex;
                    }
                    break;
                }
                if(col == 0 || (col % 2 == 1 && row == 0) ) break;
                row = col % 2 == 0 ? row : row - 1;
                col--;
            }
        }

        return nearestMinionHex;
    }

    private int nearbyUp(int[] targetHex,String target){
        int nearby = 0;

        if(targetHex[0]==0) return nearby;
        else{
            for(int i = targetHex[0]-1 ; i >=0 ; i--){
                if(gameBoard[i][targetHex[1]].hasMinion() && gameBoard[i][targetHex[1]].getMinion().getOwnerName() == target){
                    nearby += 100 * getDigit(gameBoard[i][targetHex[1]].getMinion().getMinionNowHP());
                    nearby += 10 * getDigit(gameBoard[i][targetHex[1]].getMinion().getMinionDEF());
                    nearby += targetHex[0]-i;
                    return target != currentPlayer.getPlayerNumber() ? nearby : -nearby ;
                }
            }
        }
        return nearby;
    }

    private int nearbyUpRight(int[] targetHex,String target){
        int nearby = 0;

        boolean isEven = targetHex[1] % 2 == 0;
        if(targetHex[1] == 7 || (targetHex[0] == 0 && !isEven) ) return nearby ;

        int row = isEven ?  targetHex[0] : targetHex[0]-1;
        int col = targetHex[1]+1;
        isEven = col % 2 == 0;

        boolean looping = true;
        boolean wait = true;
        while(looping){
            if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                    nearby += 100 * getDigit(gameBoard[row][col].getMinion().getMinionNowHP());
                    nearby += 10 * getDigit(gameBoard[row][col].getMinion().getMinionDEF());
                    nearby += col - targetHex[1];
                    return target != currentPlayer.getPlayerNumber() ? nearby : -nearby ;
                }
            }
            else{
                if (!isEven && row > 0) row--;
                col++;
                isEven = col % 2 == 0;
            }
            if(!wait) looping = false;
            if(col == 7 || (row == 0 && !isEven) ) wait = false;
        }
        return nearby ;
    }

    private int nearbyDownRight(int[] targetHex,String target){
        int nearby = 0;

        boolean isEven = targetHex[1] % 2 == 0;
        if(targetHex[1] == 7 || (targetHex[0] == 7 && isEven) ) return nearby;

        int row = isEven ?  targetHex[0]+1 : targetHex[0];
        int col = targetHex[1]+1;
        isEven = col % 2 == 0;

        boolean looping = true;
        boolean wait = true;
        while(looping){
            if(gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName() == target){
                nearby += 100 * getDigit(gameBoard[row][col].getMinion().getMinionNowHP());
                nearby += 10 * getDigit(gameBoard[row][col].getMinion().getMinionDEF());
                nearby += col - targetHex[1];
                return target != currentPlayer.getPlayerNumber() ? nearby : -nearby ;
            }
            else{
                if (isEven && row < 7) row++;
                col++;
                isEven = col % 2 == 0;
            }
            if(!wait) looping = false;
            if(col == 7 || (row == 7 && isEven)) wait = false;
        }

        return nearby;
    }
    private int nearbyDown(int[] targetHex,String target){
        int nearby = 0;

        if(targetHex[0]==7) return nearby;
        else{
            for(int i = targetHex[0]+1 ; i <= 7 ; i++){
                if(gameBoard[i][targetHex[1]].hasMinion() && gameBoard[i][targetHex[1]].getMinion().getOwnerName() == target){
                    nearby += 100 * getDigit(gameBoard[i][targetHex[1]].getMinion().getMinionNowHP());
                    nearby += 10 * getDigit(gameBoard[i][targetHex[1]].getMinion().getMinionDEF());
                    nearby += targetHex[0]-i;
                    return target != currentPlayer.getPlayerNumber() ? nearby : -nearby ;
                }
            }
        }
        return nearby;
    }

    private int nearbyDownLeft(int[] targetHex,String target){
        int nearby = 0;

        boolean isEven = targetHex[1] % 2 == 0;
        if(targetHex[1] == 0 || (targetHex[0] == 7 && isEven) ) return nearby;

        int row = isEven ?  targetHex[0]+1 : targetHex[0];
        int col = targetHex[1]-1;
        isEven = col % 2 == 0;

        while (col >= 0) {
            if (row > 7) break;
            if (gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName().equals(target)) {
                nearby += 100 * getDigit(gameBoard[row][col].getMinion().getMinionNowHP());
                nearby += 10 * getDigit(gameBoard[row][col].getMinion().getMinionDEF());
                nearby += targetHex[1] - col;
                return !target.equals(currentPlayer.getPlayerNumber()) ? nearby : -nearby;
            }
            if (col % 2 == 0) {
                if (row < 7) row++;
            }
            col--;
        }
        return nearby;
    }

    private int nearbyUpLeft(int[] targetHex,String target){
        int nearby = 0;

        boolean isEven = targetHex[1] % 2 == 0;
        if(targetHex[1] == 0 || (targetHex[0] == 0 && !isEven) ) return nearby;

        int row = !isEven ?  targetHex[0]-1 : targetHex[0];
        int col = targetHex[1]-1;
        isEven = col % 2 == 0;

        boolean looping = true;
        boolean wait = true;
        while (col >= 0) {
            if (row < 0) break;

            if (gameBoard[row][col].hasMinion() && gameBoard[row][col].getMinion().getOwnerName().equals(target)) {
                nearby += 100 * getDigit(gameBoard[row][col].getMinion().getMinionNowHP());
                nearby += 10 * getDigit(gameBoard[row][col].getMinion().getMinionDEF());
                nearby += targetHex[1] - col;
                return !target.equals(currentPlayer.getPlayerNumber()) ? nearby : -nearby;
            }

            if (col % 2 == 0) {
                if (row > 0) row--;
            }
            col--;
        }

        return nearby;
    }

    private void attackEnemy(int[] targetHex,int[] allyHexCoor,int paymentATK){
        if(!gameBoard[allyHexCoor[0]][allyHexCoor[1]].hasMinion()||gameBoard[allyHexCoor[0]][allyHexCoor[1]].getMinion().getOwnerName()!=currentPlayer.getPlayerNumber()) System.out.println("Don't have your minion here");
        else if(gameBoard[targetHex[0]][targetHex[1]].hasMinion()&&gameBoard[targetHex[0]][targetHex[1]].getMinion().getOwnerName()==currentPlayer.getPlayerNumber()) System.out.println("Don't have enemy here");
        else if(abs(targetHex[0]-allyHexCoor[0])> 1 ||abs(targetHex[1]-allyHexCoor[1]) > 1 )
            System.out.println("Target is too far");
        else if(!gameBoard[targetHex[0]][targetHex[1]].hasMinion()) currentPlayer.useBudget(paymentATK);
        else{
            currentPlayer.useBudget(paymentATK);

            gameBoard[targetHex[0]][targetHex[1]].getMinion().minionHasAttacked(paymentATK);
            if(gameBoard[targetHex[0]][targetHex[1]].getMinion().isDead()){
                if(gameBoard[targetHex[0]][targetHex[1]].getMinion().getOwnerName()=="001"){
                    player1.deleteMinion(gameBoard[targetHex[0]][targetHex[1]].getMinion().getMinionNumber());
                }
                else if(gameBoard[targetHex[0]][targetHex[1]].getMinion().getOwnerName()=="002"){
                    player2.deleteMinion(gameBoard[targetHex[0]][targetHex[1]].getMinion().getMinionNumber());
                }

                gameBoard[targetHex[0]][targetHex[1]].removeMinion();
            }
        }
    }

    /** สำหรับรับ Input Hex จากคีย์บอร์ด
     *   @param hexType  สำหรับเป็นข้อความบอกแยกประเภทในการรับพิกัดช่อง
     *   @return  พิกัดของHex
     * */
    private int[] getRowAndCol(String hexType){
        int[] HexCoordinate = new int[2];

        boolean x = true;
        while (x){
            System.out.print("Please enter " + hexType + " hex row:");
            Scanner coordinate = new Scanner(System.in);
            HexCoordinate[0] = coordinate.nextInt();
            if(HexCoordinate[0]<0||HexCoordinate[0]>7) System.out.println("Invalid row coordinate");
            else x = false;
        }

        x = true;
        while (x){
            System.out.print("Please enter " + hexType + " hex col:");
            Scanner coordinate = new Scanner(System.in);
            HexCoordinate[1] = coordinate.nextInt();

            if(HexCoordinate[1]<0||HexCoordinate[1]>7) System.out.println("Invalid col coordinate");
            else x = false;
        }

        return HexCoordinate;
    }

    /** สำหรับ check ผลแพ้ชนะโดยอิงจากจำนวนมินเนี่ยนก่อนเช็คด้วยผลเลือดรวม
     *  ตอนนี้ยังเป็นแบบคร่าวๆสำหรับไว้ดูผ่าน Terminal อยู่
     *     นำแต่ละตำแหน่งมาหา minion ของแต่ละคน
     * */
    private int checkWinner(){
        if(player1.getNowMinionPlayerHave() == 0 && player2.getNowMinionPlayerHave() > 0) return 2;
        else if(player2.getNowMinionPlayerHave() == 0 && player1.getNowMinionPlayerHave() > 0) return 1;
        else{
            int p1MinionSumHP = player1.minionsPlayerHave().values().stream()
                    .mapToInt(v -> gameBoard[v[0]][v[1]].getMinion().getMinionNowHP())
                    .sum();

            int p2MinionSumHP = player2.minionsPlayerHave().values().stream()
                    .mapToInt(v -> gameBoard[v[0]][v[1]].getMinion().getMinionNowHP())
                    .sum();

            if(p1MinionSumHP > p2MinionSumHP) return 1;
            else if(p2MinionSumHP > p1MinionSumHP) return 2;
            else{
                if(player1.getBudget() > player2.getBudget()) return 1;
                else if(player2.getBudget() > player1.getBudget()) return 2;
                else return 3;
            }

        }
    }


    private static Map<Integer, Hex> calculateNearbyHexes(Map<Integer, Hex> currPlayerHexMap) {
        Map<Integer, Hex> nearbyMap = new HashMap<>();
        Set<Hex> uniqueHexes = new HashSet<>(); // ใช้เช็กค่าไม่ให้ซ้ำ
        int index = 0;

        for (Hex hex : currPlayerHexMap.values()) {
            Set<Hex> neighbors = Nearby.getNearby(hex.getRow(), hex.getCol());

            // เพิ่มพิกัดใกล้เคียงที่ไม่มีใน currPlayerHexMap และยังไม่ถูกเพิ่มเข้า nearbyMap
            for (Hex neighbor : neighbors) {
                if (!currPlayerHexMap.containsValue(neighbor) && uniqueHexes.add(neighbor)) {
                    nearbyMap.put(index++, neighbor);
                }
            }
        }
        return nearbyMap;
    }


    private boolean haveEnoughMoney(long playerBudget,int Price) {
        return playerBudget >= Price;
    }

    /** เงินที่ผู้เล่นจะได้ในแต่ละเทิร์น
     *   @param Interest     ดอกเบี้ย
     *   @param playerBudget เงินที่ผู้เล่นมี
     *   @param nowTurn      Turn ปัจจุบัน
     *   @param TurnBudget   เงินที่จะได้รับแบบคงที่ในแต่ละเทิร์น
     *   @return เงินทั้งหมดที่ผู้เล่นต้องได้รับ
     * */
    private static double GetMoreMoney(int Interest,long playerBudget,int nowTurn,int TurnBudget){
        return  (((double) Interest /100*log10(playerBudget)*nowTurn)+TurnBudget);
    }

    //เช็คจำนวนหลัก
    private int getDigit(int Num){
        boolean x = true;
        int count = 0;
        while(x){
            Num = (Num - (Num%10))/10;
            count++;

            if(Num == 0) x = false;
        }

        return count;
    }

    /** สำหรับแสดงกระดานเพื่อดูแต่ละช่องผ่าน Terminal โดยพยายามให้ใกล้เคียงตารางช่องหกเหลี่ยมที่สุด
     *  มีการจำกัดข้อมูลโดยอ้างอิงเทิร์นผู้เล่น
     * */
    private void showBoard(){
        for (int i = 0; i < 48; i++) {
            for (int j = 0; j < 8; j++) {
                if (((i % 6 == 3) && (j % 2 == 0))||((i % 6 == 0) && (j % 2 == 1))) {
                    System.out.print("["+(i / 6)+","+ j + "]    ");
                    if(gameBoard[i/6][j].getOwnerName()=="001") System.out.print("<P1>   ");
                    else if(gameBoard[i/6][j].getOwnerName()=="002") System.out.print("<P2>   ");
                    else System.out.print("        ");
                }
                else if (((i % 6 == 4) && (j % 2 == 0))||((i % 6 == 1) && (j % 2 == 1))) {
                    System.out.print("Minion : ");
                    if(gameBoard[i/6][j].hasMinion() && gameBoard[i/6][j].getMinion().getOwnerName() == currentPlayer.getPlayerNumber()) {
                        System.out.print(gameBoard[i/6][j].getMinion().getMinionName());
                        if(gameBoard[i/6][j].getMinion().getOwnerName()=="001") System.out.print(" [P1] ");
                        else if(gameBoard[i/6][j].getMinion().getOwnerName()=="002") System.out.print(" [P2]  ");
                    }
                    else if (!gameBoard[i/6][j].hasMinion()&&gameBoard[i/6][j].getOwnerName()==currentPlayer.getPlayerNumber()) System.out.print("Empty     ");
                    else System.out.print("Unknown ");
                }
                else if (((i % 6 == 5)&& (j % 2 == 0))||((i % 6 == 2) && (j % 2 == 1))) {
                    if(gameBoard[i/6][j].hasMinion() && gameBoard[i/6][j].getMinion().getOwnerName()==currentPlayer.getPlayerNumber() ) System.out.print("HP: "+gameBoard[i/6][j].getMinion().getMinionNowHP()+"/"+gameBoard[i/6][j].getMinion().getMinionMaxHP());
                    else if(gameBoard[i/6][j].hasMinion()&&gameBoard[i/6][j].getOwnerName()==currentPlayer.getPlayerNumber()) System.out.println("HP: ???/" + gameBoard[i/6][j].getMinion().getMinionMaxHP());
                    else    System.out.print("                 ");
                }
                else    System.out.print("                 ");

            }
            System.out.println();
        }
    }

}