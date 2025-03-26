package project.kombat;

import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;
import project.kombat.model.GameManagement.*;

public class Main {
    public static void main(String[] args) {
        // โหลด configuration จากไฟล์หรือกำหนดค่าแบบ hard-coded
        Map<String, Long> config = new HashMap<>();
        config.put("spawn_cost", 100L);
        config.put("hex_purchase_cost", 1000L);
        config.put("init_budget", 10000L);
        config.put("init_hp", 100L);
        config.put("turn_budget", 90L);
        config.put("max_budget", 23456L);
        config.put("interest_pct", 5L);
        config.put("max_turns", 69L);
        config.put("max_spawns", 47L);

        // สร้างเกมและผู้เล่น
        Game game = new Game(config, Game.GameMode.DUEL);
        game.addPlayer(new Player("Player1"));
        game.addPlayer(new Player("Player2"));

        // เริ่มต้นเกม (อาจให้ผู้ใช้เลือก option ต่าง ๆ ได้)
        Scanner scanner = new Scanner(System.in);
        System.out.println("เริ่มเกม KOMBAT แล้ว...");

        // ตัวอย่าง loop สำหรับรับคำสั่งจากผู้ใช้ใน terminal
        while(true) {
            System.out.println("กรุณากรอกคำสั่ง (หรือพิมพ์ 'exit' เพื่อออก):");
            String command = scanner.nextLine();
            if("exit".equalsIgnoreCase(command.trim())) {
                break;
            }
            // ส่งคำสั่งไปที่ GameService หรือ Game เพื่อประมวลผล
            // ตัวอย่าง: game.processCommand(command);
            System.out.println("คำสั่งที่รับ: " + command);
        }

        scanner.close();
        System.out.println("ออกจากเกม");
    }
}
