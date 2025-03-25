package project.kombat;

// File: src/com/imperment/kombat/strategy/StrategyParserApp.java
import org.junit.Test;
import project.kombat.model.Parser.*;


import static org.testng.Assert.*;

import project.kombat.model.Parser.StrategyNode;
import java.util.List;

import java.util.List;
import java.util.Scanner;

public class StrategyParserApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter your strategy code (finish with an empty line):");

        // อ่าน input strategy แบบหลายบรรทัด จนกว่าผู้ใช้จะป้อนบรรทัดว่าง
        StringBuilder inputBuilder = new StringBuilder();
        String line;
        while (!(line = scanner.nextLine()).isEmpty()) {
            inputBuilder.append(line).append("\n");
        }
        String input = inputBuilder.toString();

        // แสดง input ที่ได้รับ
        System.out.println("Input strategy:");
        System.out.println(input);

        // ใช้ Tokenizer ในการแปลง input ให้เป็น token list
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();

        // ใช้ Parser ในการสร้าง AST จาก token list
        Parser parser = new Parser(tokens);
        StrategyNode strategyNode = parser.parseStrategy();

        // แสดงผล AST ด้วย ASTPrinter
        System.out.println("Parsed AST:");
        ASTPrinter.printAST(strategyNode);

        scanner.close();
    }
}
