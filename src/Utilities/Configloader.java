package com.example.demo.src.Utilities;

public class Configloader {
    private int spawn_cost;          //ค่าลง
    private int hex_purchase_cost;   //ซื้อช่อง
    private long init_budget;        //เงินตั้งต้น
    private int init_hp;             //new spawn Minion HP
    private int turn_budget;         //เงินเพิ่มแต่ละตา
    private long max_budget;         //เงินสูงสุด
    private int interest_pct;        //อัตราดอกเบี้ยพื้นฐาน
    private int max_turns;           //จนเทิร์นสูงสุด
    private int max_spawns;          //Minion สูงสุด

    public Configloader(int spawn_cost,int hex_purchase_cost,long init_budget,int init_hp,int turn_budget,int max_budget,int interest_pct,int max_turns,int max_spawns) {

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

    public int getSpawnCost(){
        return spawn_cost;
    }
    public int getHexPurchaseCost(){
        return hex_purchase_cost;
    }
    public long getInitBudget(){
        return init_budget;
    }
    public int getInitHP(){
        return init_hp;
    }
    public int getTurnBudget(){
        return turn_budget;
    }
    public long getMaxBudget(){
        return max_budget;
    }
    public int getInterestPct(){
        return interest_pct;
    }
    public int getMaxTurns(){
        return max_turns;
    }
    public int getMaxSpawns(){
        return max_spawns;
    }

}
