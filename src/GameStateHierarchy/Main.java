package com.example.demo.src.GameStateHierarchy;

import java.util.Scanner;


public class Main {
    public static void main(String[] args) {

        boolean x = true;
        int mode = 1;
        Scanner sc = new Scanner(System.in);

        System.out.println("Select mode");
        System.out.println("1. Player vs Player");
        System.out.println("2. Player vs Bot");
        System.out.println("3. Bot vs Bot");
        System.out.print("Your choice : ");
        while(x){
            mode = sc.nextInt();
            if(mode==1||mode==2||mode==3) x=false;
            else System.out.println("Invalid choice Select mode again");
        }

        System.out.println("\n-------------------------------\nSetting Cost");
        System.out.print("\nMinion Spawn cost : ");
        int setSpawnCost = sc.nextInt();
        System.out.print("Hex cost : ");
        int setHexPurchaseCost = sc.nextInt();
        System.out.print("Start budget : ");
        int setInitBudget = sc.nextInt();
        System.out.print("Turn budget : ");
        int setTurnBudget = sc.nextInt();
        System.out.print("Max budget : ");
        int setMaxBudget = sc.nextInt();
        System.out.print("Interest : ");
        int setInterest = sc.nextInt();
        System.out.print("Max turns : ");
        int setMaxTurn = sc.nextInt();
        System.out.print("Max minions : ");
        int setMaxMinions = sc.nextInt();
        System.out.print("Minion HP : ");
        int setMinionHP = sc.nextInt();
        System.out.println("\n-------------------------------\n");

        x = true;
        int minionType = 0;
        while(x){
            System.out.print("How much minion type you want(1-5): ");
            minionType = sc.nextInt();

            if(minionType>5 || minionType<1) System.out.println("Invalid value");
            else x = false;
        }

        String[]    minionName = new String[minionType];
        int[]       minionDEF  = new int[minionType];

        String[]      minionStrategy    = new String[minionType];
        StringBuilder strategyText      = new StringBuilder();

        System.out.println("Minion setting");
        for(int i = 0; i<minionType;i++){
            System.out.print((i+1)+") Minion Name: ");
            minionName[i] = sc.next();
            System.out.print((i+1)+") Minion DEF: ");
            minionDEF[i] = sc.nextInt();

            System.out.println("Write minion strategy: ");
            while (sc.hasNextLine()) {
                String line = sc.nextLine();
                if (line.equalsIgnoreCase("END")) break; // หยุดเมื่อพิมพ์ END
                strategyText.append(line).append("\n");
            }
            minionStrategy[i] = strategyText.toString();
        }


        GameState PlayGame = new GameState(mode,setSpawnCost, setHexPurchaseCost, setInitBudget, setMinionHP, setTurnBudget, setMaxBudget, setInterest, setMaxTurn, setMaxMinions, minionType, minionName, minionDEF,minionStrategy);

        int winner = PlayGame.GameStart();

        System.out.println("________________________________________\n");
        if(winner == 1) System.out.println("      Winner is...\n             player 1");
        else if(winner == 2) System.out.println("Winner is player 2");
        else if(winner == 3) System.out.println("Tie");
        System.out.println("\n________________________________________");
    }
}