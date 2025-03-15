package com.example.demo.src.GameStateHierarchy;

import com.example.demo.src.Utilities.*;

import java.util.Scanner;

import java.util.HashSet;
import java.util.Set;

import java.util.Random;
import static java.lang.Math.*;

public class GameState {

    Configloader    config;
    int             GameMode;
    Hex[][]         gameBoard = new Hex[8][8];
    Player          player1;
    Player          player2;
    int             nowTurn = 1;
    boolean         spawnMinionPerTurn;
    boolean         buyHexPerTurn;
    Boolean         GameEnd;

    Player          currentPlayer;
    int             minionTypeAmount;
    Minion[]        MinionType;


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
    GameState(int mode, int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turn,int max_spawns, int minionTypeAmount , String[] minionName, int[] minionDEF) {
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
            MinionType[i] = new Minion("000",minionName[i],config.getInitHP(),minionDEF[i]);
        }

        String P1Type="Human",P2Type="Human";
        if(mode == 1){P1Type = "Human";P2Type = "Human";}
        else if(mode == 2){P1Type = "Human";P2Type = "Bot";}


        //set ค่าและพื้นที่ของผู้เล่นแต่ละคน
        player1 = new Player("001",P1Type,config.getInitBudget(),config.getMaxSpawns());
        gameBoard[6][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[6][7].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][5].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][6].setOwnerName(player1.getPlayerNumber());
        gameBoard[7][7].setOwnerName(player1.getPlayerNumber());

        player2= new Player("002",P2Type,config.getInitBudget(),config.getMaxSpawns());
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
    void GameStart(){
        while(nowTurn<=config.getMaxTurns()){

            if(nowTurn>1){ //เพิ่มเงินให้ผู้เล่นเมื่อเริ่มเทิร์น
                player1.getMoreBudget(GetMoreMoney(config.getInterestPct(),player1.getBudget(),nowTurn,config.getTurnBudget()));
                player2.getMoreBudget(GetMoreMoney(config.getInterestPct(),player2.getBudget(),nowTurn,config.getTurnBudget()));
            }

            //Set ค่าตั้งต้นแต่ละเทิร์นให้ผู้เล่น
            currentPlayer   = !(nowTurn % 2 == 0) ? player1 : player2;
            boolean playing         = true;
            buyHexPerTurn           = true;
            spawnMinionPerTurn      = true;

            //เก็บ Hex ที่ผู้เล่นปัจจุบันเป็นเจ้าของมาไว้ดู
            Set<Hex> currPlayerHex = new HashSet<>();
            for(int i = 0; i < 8;i++) {
                for(int j = 0; j < 8; j++) {
                    if(gameBoard[i][j].hasMinion()) gameBoard[i][j].getMinion().resetNowHexMovement();
                    if(gameBoard[i][j].getOwnerName() == currentPlayer.getPlayerNumber()){
                        currPlayerHex.add(new Hex(gameBoard[i][j].getRow(),gameBoard[i][j].getCol()));
                    }
                }
            }
            Set<Hex> NearbySet = calculateNearbyHexes(currPlayerHex);

            //สำหรับแสดงผลก่อนเชื่อม
            System.out.println("\n________________________________");
            System.out.println("Player : " + (!(nowTurn % 2 == 0) ? "1" : "2"));
            System.out.println("\nTurn "+nowTurn+" / 20");
            System.out.println("________________________________\n");
            showBoard(gameBoard,currentPlayer.getPlayerNumber());

            while(playing) {

                /*สำหรับทดสอบการทำงานก่อนเชื่อม โดยสั่งโดยตรงจากคีย์บอร์ด*/
                System.out.println("\n--------------------------------------------\n");
                System.out.println("Your budget: "+currentPlayer.getBudget());
                System.out.println("Player : " + (!(nowTurn % 2 == 0) ? "1" : "2"));
                System.out.println("\n--------------------------------------------\n");
                System.out.println("\nChoices");
                System.out.println("1.Show your nearby hex");
                System.out.println("2.Buy hex ("+config.getHexPurchaseCost()+"$)");
                System.out.println("3.Spawn Minion ("+config.getSpawnCost()+"$)");
                System.out.println("4.Move Minion");
                System.out.println("5.Find nearby enemy");
                System.out.println("6.Attack");
                System.out.println("7.End Turn");
                System.out.print("Your Choice:");

                //รับคำสั่งที่จะทดสอบ
                Scanner Choice = new Scanner(System.in);
                int playerChoice = Choice.nextInt();

                int[]   targetHex;
                int[]   nowHexCoor;

                //Nearby
                if(playerChoice == 1){
                    for (Hex hex : NearbySet) System.out.println("["+hex.getRow()+","+hex.getCol()+"]");
                }

                //Buy hex
                else if(playerChoice == 2){
                    if(!buyHexPerTurn) System.out.println("You already buy hex this turn");
                    else if(!haveEnoughMoney(currentPlayer.getBudget(),config.getHexPurchaseCost())) System.out.println("U R too POOR");
                    else{
                        targetHex = getRowAndCol("");
                        buyHex(targetHex,NearbySet);
                        NearbySet = calculateNearbyHexes(currPlayerHex);
                    }
                }

                //Spawn Minion
                else if(playerChoice == 3){
                    if(!spawnMinionPerTurn) System.out.println("You already spawn minion this turn");
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

                //move minion
                else if(playerChoice == 4){
                    if(!haveEnoughMoney(currentPlayer.getBudget(),1)) System.out.println("U R too POOR");
                    else{
                        targetHex   = getRowAndCol("target");
                        nowHexCoor  = getRowAndCol("minion now");

                        moveMinion(targetHex,nowHexCoor);
                    }
                }

                else if(playerChoice == 5){
                    int[] nearEnemy = new int[2];
                    targetHex   = getRowAndCol("minion now");
                    if(!gameBoard[targetHex[0]][targetHex[1]].hasMinion()||gameBoard[targetHex[0]][targetHex[1]].getMinion().getOwnerName()!= currentPlayer.getPlayerNumber())
                        System.out.println("You don't have your minion in this hex");
                    else{
                        nearEnemy = findNearbyEnemy(targetHex);

                        if(nearEnemy[0] == -1 || nearEnemy[1] == -1) System.out.println("dont have enemy");
                        else System.out.println("Nearby enemy is in <"+nearEnemy[0]+","+nearEnemy[1]+">");
                    }
                }

                //attack
                else if(playerChoice == 6){

                    System.out.print("Pay for damage enemy( +1 ATK/money used) :");
                    int moneyATK = Choice.nextInt();

                    if(!haveEnoughMoney(currentPlayer.getBudget(),moneyATK)) System.out.println("U R too POOR");
                    else{
                        targetHex   = getRowAndCol("target");
                        nowHexCoor  = getRowAndCol("attack now");
                        attackEnemy(targetHex,nowHexCoor,moneyATK);
                    }
                }
                //End Game
                else if(playerChoice == 7){
                    if(nowTurn % 2 == 0) player2 = currentPlayer;
                    else player1 = currentPlayer;

                    playing = false;
                }
                //กันใส่เลขผิดตอนเทส
                else System.out.println("Invalid choice");

            }
            nowTurn++;
            System.out.println("\n________________________________\n");
        }

        checkWinner(gameBoard);

    }

    /** ซื้อช่องเพิ่ม //ต้องไปเอาจากด้านบนมาใส่ในนี้
    *   effects: ช่องจะมีเจ้าของ
    *   @param targetHex    ช่องที่จะซื้อ
    * */
    private void buyHex(int[] targetHex,Set<Hex> NearbySet) {
        if(!NearbySet.contains(new Hex(targetHex[0],targetHex[1]))) System.out.println("\n\nThis hex is too far\n\n");
        else if(gameBoard[targetHex[0]][targetHex[1]].isOwned()) System.out.println("\n\"\nHex already has owner\n\"\n");
        else if(gameBoard[targetHex[0]][targetHex[1]].getOwnerName() == ""){
            gameBoard[targetHex[0]][targetHex[1]].setOwnerName(currentPlayer.getPlayerNumber());
            currentPlayer.useBudget(config.getHexPurchaseCost());
            buyHexPerTurn = false;
            showBoard(gameBoard,currentPlayer.getPlayerNumber());
        }
    }

    private void spawnMinion(int[] targetHex,int minionType){
        if(gameBoard[targetHex[0]][targetHex[1]].getOwnerName() != currentPlayer.getPlayerNumber()) System.out.println("\n\"\nNot your hex\n\"\n");
        else{
            Minion minion = new Minion(currentPlayer.getPlayerNumber(), this.MinionType[minionType].getMinionName(),config.getInitHP(),this.MinionType[minionType].getMinionDEF());
            gameBoard[targetHex[0]][targetHex[1]].setMinion(minion);
            currentPlayer.useBudget(config.getSpawnCost());
            spawnMinionPerTurn = false;
            showBoard(gameBoard,currentPlayer.getPlayerNumber());
        }
    }

    /** ซื้อช่องเพิ่ม //ต้องไปเอาจากด้านบนมาใส่ในนี้
     *   effects: ช่องที่เคยมีมินเนี่ยนจะไม่มีมินเนี่ยน ช่องเป้าหมายที่ไม่มีมินเนี่ยนจะมีมินเนี่ยน
     *   @param targetHex   ช่องที่จะซื้อ
     *   @param nowHexCoor      ช่องปัจจุบันของมินเนี่ยน
     * */
    private void moveMinion(int[] targetHex,int[] nowHexCoor){
        currentPlayer.useBudget(1);

        if(gameBoard[targetHex[0]][targetHex[1]].hasMinion()) System.out.println("Already have minion in target hex");
        else if(!gameBoard[nowHexCoor[0]][nowHexCoor[1]].hasMinion()) System.out.println("Don't have minion to move");
        else if(abs(targetHex[0]-nowHexCoor[0])>1||abs(targetHex[1]-nowHexCoor[1])>1) System.out.println("\nThis hex is too far\n");
        else if(!gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion().canMove()) System.out.println("Minion out of move");
        else{
            gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion().moveMinion();
            gameBoard[targetHex[0]][targetHex[1]].setMinion(gameBoard[nowHexCoor[0]][nowHexCoor[1]].getMinion());
            gameBoard[nowHexCoor[0]][nowHexCoor[1]].removeMinion();

            showBoard(gameBoard,currentPlayer.getPlayerNumber());
        }
    }

    public int[] findNearbyEnemy(int[] minionHex) {
        Set<Hex> centerAreaHex = new HashSet<>();
        centerAreaHex.add(gameBoard[minionHex[0]][minionHex[1]]);

        Set<Hex> nearbyAreaHex;

        while (!centerAreaHex.isEmpty()) {
            nearbyAreaHex = calculateNearbyHexes(centerAreaHex);

            Set<Hex> newCenterAreaHex = new HashSet<>(centerAreaHex); // สำรองชุดข้อมูลปัจจุบัน

            for (Hex hex : nearbyAreaHex) {
                Hex boardHex = gameBoard[hex.getRow()][hex.getCol()];

                if (boardHex.hasMinion()) {
                    Minion minion = boardHex.getMinion();

                    if (!minion.getOwnerName().equals(currentPlayer.getPlayerNumber()))
                        return new int[]{hex.getRow(), hex.getCol()};

                }
                newCenterAreaHex.add(boardHex);
            }

            if (newCenterAreaHex.size() == centerAreaHex.size()) {
                break;
            }
            centerAreaHex = newCenterAreaHex;
        }
        return new int[]{-1, -1};
    }

    private void attackEnemy(int[] targetHex,int[] allyHexCoor,int paymentATK){
        if(!gameBoard[allyHexCoor[0]][allyHexCoor[1]].hasMinion()||gameBoard[allyHexCoor[0]][allyHexCoor[1]].getMinion().getOwnerName()!=currentPlayer.getPlayerNumber()) System.out.println("Don't have your minion here");
        else if(!gameBoard[targetHex[0]][targetHex[1]].hasMinion()||gameBoard[targetHex[0]][targetHex[1]].getMinion().getOwnerName()==currentPlayer.getPlayerNumber()) System.out.println("Don't have enemy here");
        else if(abs(targetHex[0]-allyHexCoor[0])>gameBoard[allyHexCoor[0]][allyHexCoor[1]].getMinion().getMinionAttackRange()||abs(targetHex[1]-allyHexCoor[1])>gameBoard[allyHexCoor[0]][allyHexCoor[1]].getMinion().getMinionAttackRange())
            System.out.println("Target is too far");
        else{
            currentPlayer.useBudget(paymentATK);

            gameBoard[targetHex[0]][targetHex[1]].getMinion().minionHasAttacked(paymentATK);
            if(gameBoard[targetHex[0]][targetHex[1]].getMinion().isDead()) gameBoard[targetHex[0]][targetHex[1]].removeMinion();
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
     *   @param gameBoard  นำแต่ละตำแหน่งมาหา minion ของแต่ละคน
     * */
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

    /** Check Hex ที่ติดกันที่สามารถซื้อได้
     *   @param currPlayerHex ช่องที่ผู้เล่นเป็นเจ้าของ
     *  @return nearbySet
     */
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

    /** สำหรับแสดงกระดานเพื่อดูแต่ละช่องผ่าน Terminal โดยพยายามให้ใกล้เคียงตารางช่องหกเหลี่ยมที่สุด
     *  มีการจำกัดข้อมูลโดยอ้างอิงเทิร์นผู้เล่น
     *   @param gameBoard   นำข้อมูลบอร์ดมาแสดง
     *   @param PlayerName  รับค่าว่าเป็นเทิร์นของใคร
     * */
    private static void showBoard(Hex[][] gameBoard,String PlayerName){
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
                    if(gameBoard[i/6][j].hasMinion() && gameBoard[i/6][j].getMinion().getOwnerName() == PlayerName ) System.out.print(gameBoard[i/6][j].getMinion().getMinionName());
                    else if (!gameBoard[i/6][j].hasMinion()&&gameBoard[i/6][j].getOwnerName()==PlayerName) System.out.print("Empty     ");
                    else System.out.print("Unknown ");
                }
                else if (((i % 6 == 5)&& (j % 2 == 0))||((i % 6 == 2) && (j % 2 == 1))) {
                    if(gameBoard[i/6][j].hasMinion() && gameBoard[i/6][j].getMinion().getOwnerName()==PlayerName ) System.out.print("HP: "+gameBoard[i/6][j].getMinion().getMinionNowHP()+"/"+gameBoard[i/6][j].getMinion().getMinionMaxHP());
                    else if(gameBoard[i/6][j].hasMinion()&&gameBoard[i/6][j].getOwnerName()==PlayerName) System.out.println("HP: ???/" + gameBoard[i/6][j].getMinion().getMinionMaxHP());
                    else    System.out.print("                 ");
                }
                else    System.out.print("                 ");

            }
            System.out.println();
        }
    }

}