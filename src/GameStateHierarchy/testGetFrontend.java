package com.example.demo.src.GameStateHierarchy;

public class testGetFrontend {

    private final int spawn_cost;          //ค่าลง
    private final int hex_purchase_cost;   //ซื้อช่อง
    private final long init_budget;        //เงินตั้งต้น
    private final int init_hp;             //new spawn Minion HP
    private final int turn_budget;         //เงินเพิ่มแต่ละตา
    private final long max_budget;         //เงินสูงสุด
    private final int interest_pct;        //อัตราดอกเบี้ยพื้นฐาน
    private final int max_turns;           //จนเทิร์นสูงสุด
    private final int max_spawns;          //Minion สูงสุด

    public testGetFrontend(int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turns,int max_spawns) {

        this.spawn_cost = spawn_cost;
        this.hex_purchase_cost = hex_purchase_cost;
        this.init_budget = init_budget;
        this.init_hp = init_hp;
        this.turn_budget = turn_budget;
        this.max_budget = max_budget;
        this.interest_pct = interest_pct;
        this.max_turns = max_turns;
        this.max_spawns = max_spawns;

    }

    public void printConfig() {
        System.out.println("Spawn Cost: " + getSpawnCost() );
        System.out.println("Hex Purchase Cost: " + getHexPurchaseCost() );
        System.out.println("Initial Budget: " + getInitBudget() );
        System.out.println("Initial HP: " + getInitHP());
        System.out.println("Turn Budget: " + getTurnBudget() );
        System.out.println("Max Budget: " + getMaxBudget());
        System.out.println("Interest PCT: " + getInterestPct() );
        System.out.println("Max Turns: " + getMaxTurns());
        System.out.println("Max Spawns: " + getMaxSpawns());
    }

    private int getSpawnCost(){
        return spawn_cost;
    }
    private int getHexPurchaseCost(){
        return hex_purchase_cost;
    }
    private long getInitBudget(){
        return init_budget;
    }
    private int getInitHP(){
        return init_hp;
    }
    private int getTurnBudget(){
        return turn_budget;
    }
    private long getMaxBudget(){
        return max_budget;
    }
    private int getInterestPct(){
        return interest_pct;
    }
    private int getMaxTurns(){
        return max_turns;
    }
    private int getMaxSpawns(){
        return max_spawns;
    }

    public static void main(String[] args) {
        testGetFrontend Config = new testGetFrontend();
        Config.printConfig();


    }

}
