package project.kombat;

// File: src/com/imperment/kombat/strategy/ASTPrinter.java
import project.kombat.model.Parser.*;
import project.kombat.model.Parser.ASTNode.*;
import java.util.List;

public class ASTPrinter {

    // พิมพ์ AST โดยใช้ indentation เพื่อแสดงโครงสร้างอย่างชัดเจน
    public static void printAST(ASTNode node) {
        printAST(node, 0);
    }

    private static void printAST(ASTNode node, int indent) {
        String indentStr = " ".repeat(indent);
        if (node instanceof StrategyNode) {
            StrategyNode strategyNode = (StrategyNode) node;
            System.out.println(indentStr + "StrategyNode:");
            for (StatementNode stmt : strategyNode.statements) {
                printAST(stmt, indent + 2);
            }
        } else if (node instanceof AssignmentStatementNode) {
            AssignmentStatementNode assignNode = (AssignmentStatementNode) node;
            System.out.println(indentStr + "AssignmentStatement: " + assignNode.identifier + " =");
            printAST(assignNode.expression, indent + 2);
        } else if (node instanceof ActionCommandNode) {
            ActionCommandNode actionNode = (ActionCommandNode) node;
            System.out.println(indentStr + "ActionCommand: " + actionNode.command);
            if (actionNode.argument != null) {
                System.out.println(indentStr + "  Argument: " + actionNode.argument);
            }
            if (actionNode.expenditure != null) {
                System.out.println(indentStr + "  Expenditure:");
                printAST(actionNode.expenditure, indent + 2);
            }
        } else if (node instanceof IfStatementNode) {
            IfStatementNode ifNode = (IfStatementNode) node;
            System.out.println(indentStr + "IfStatement:");
            System.out.println(indentStr + "  Condition:");
            printAST(ifNode.condition, indent + 2);
            System.out.println(indentStr + "  Then:");
            printAST(ifNode.thenStatement, indent + 2);
            System.out.println(indentStr + "  Else:");
            printAST(ifNode.elseStatement, indent + 2);
        } else if (node instanceof WhileStatementNode) {
            WhileStatementNode whileNode = (WhileStatementNode) node;
            System.out.println(indentStr + "WhileStatement:");
            System.out.println(indentStr + "  Condition:");
            printAST(whileNode.condition, indent + 2);
            System.out.println(indentStr + "  Body:");
            printAST(whileNode.statement, indent + 2);
        } else if (node instanceof BinaryExpressionNode) {
            BinaryExpressionNode binNode = (BinaryExpressionNode) node;
            System.out.println(indentStr + "BinaryExpression: " + binNode.operator.getLexeme());
            System.out.println(indentStr + "  Left:");
            printAST(binNode.left, indent + 2);
            System.out.println(indentStr + "  Right:");
            printAST(binNode.right, indent + 2);
        } else if (node instanceof LiteralNode) {
            LiteralNode literalNode = (LiteralNode) node;
            System.out.println(indentStr + "Literal: " + literalNode.value);
        } else if (node instanceof IdentifierNode) {
            IdentifierNode idNode = (IdentifierNode) node;
            System.out.println(indentStr + "Identifier: " + idNode.name);
        } else if (node instanceof InfoExpressionNode) {
            InfoExpressionNode infoNode = (InfoExpressionNode) node;
            System.out.println(indentStr + "InfoExpression: " + infoNode.infoType + (infoNode.direction != null ? " " + infoNode.direction : ""));
        } else {
            System.out.println(indentStr + "Unknown AST Node: " + node.getClass().getSimpleName());
        }
    }

    // main method สำหรับรันแบบ standalone แล้วแสดงผลลัพธ์ของ parser ใน console
    public static void main(String[] args) {
        // ตัวอย่าง input ที่คุณต้องการ parse
        String input = "x = 42\nmove up\nif (x) then done else done\nwhile (x) done";

        // สร้าง token ด้วย Tokenizer
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();

        // สร้าง AST ด้วย Parser
        Parser parser = new Parser(tokens);
        StrategyNode strategyNode = parser.parseStrategy();

        // พิมพ์โครงสร้าง AST ที่ได้
        System.out.println("Parsed AST:");
        printAST(strategyNode);
    }
}
