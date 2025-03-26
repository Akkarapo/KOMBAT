package project.kombat;
// File: src/test/java/com/imperment/kombat/strategy/ParserTest.java
import org.junit.Test;
import project.kombat.model.Parser.*;


import static org.testng.Assert.*;

import project.kombat.model.Parser.StrategyNode;
import java.util.List;

public class ParserTest {

    @Test
    public void testAssignmentStatement() {
        // ตัวอย่าง input สำหรับ assignment statement
        String input = "x = 42";
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        StrategyNode strategy = parser.parseStrategy();

        // ตรวจสอบว่า AST มี statement เพียง 1 ตัว
        assertNotNull(strategy, "StrategyNode should not be null");
        assertEquals(1, strategy.statements.size(), "There should be exactly one statement");

        // ตรวจสอบว่า statement นั้นเป็น AssignmentStatementNode
        StatementNode stmt = strategy.statements.get(0);
        assertTrue(stmt instanceof AssignmentStatementNode, "Statement should be AssignmentStatementNode");
        AssignmentStatementNode assignStmt = (AssignmentStatementNode) stmt;

        // ตรวจสอบ identifier และ expression
        assertEquals("x", assignStmt.identifier, "Identifier should be 'x'");
        assertTrue(assignStmt.expression instanceof LiteralNode, "Expression should be a LiteralNode");
        LiteralNode literal = (LiteralNode) assignStmt.expression;
        assertEquals(42, literal.value, "Literal value should be 42");
    }

    @Test
    public void testActionCommandMove() {
        // ตัวอย่าง input สำหรับ move command
        String input = "move up";
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        StrategyNode strategy = parser.parseStrategy();

        // คาดหวังให้ได้ action command ที่มีคำสั่ง move พร้อม argument "up"
        assertNotNull(strategy, "StrategyNode should not be null");
        assertEquals(1, strategy.statements.size(), "There should be exactly one statement");
        StatementNode stmt = strategy.statements.get(0);
        assertTrue(stmt instanceof ActionCommandNode, "Statement should be ActionCommandNode");
        ActionCommandNode action = (ActionCommandNode) stmt;
        assertEquals("move", action.command, "Command should be 'move'");
        assertEquals("up", action.argument, "Direction argument should be 'up'");
        assertNull(action.expenditure, "Expenditure should be null for move command");
    }

    @Test
    public void testIfStatement() {
        // ตัวอย่าง input สำหรับ if-statement
        String input = "if (x) then done else done";
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        StrategyNode strategy = parser.parseStrategy();

        // ตรวจสอบว่า AST มี statement เพียง 1 ตัวและเป็น IfStatementNode
        assertNotNull(strategy, "StrategyNode should not be null");
        assertEquals(1, strategy.statements.size(), "There should be exactly one statement");
        StatementNode stmt = strategy.statements.get(0);
        assertTrue(stmt instanceof IfStatementNode, "Statement should be an IfStatementNode");
        IfStatementNode ifStmt = (IfStatementNode) stmt;

        // ตรวจสอบเงื่อนไข (condition) ควรเป็น identifier "x"
        assertTrue(ifStmt.condition instanceof IdentifierNode, "Condition should be an IdentifierNode");
        IdentifierNode condition = (IdentifierNode) ifStmt.condition;
        assertEquals("x", condition.name, "Condition identifier should be 'x'");

        // ตรวจสอบ then และ else statement ควรเป็น action command "done"
        assertTrue(ifStmt.thenStatement instanceof ActionCommandNode, "Then statement should be ActionCommandNode");
        ActionCommandNode thenAction = (ActionCommandNode) ifStmt.thenStatement;
        assertEquals("done", thenAction.command, "Then command should be 'done'");

        assertTrue(ifStmt.elseStatement instanceof ActionCommandNode, "Else statement should be ActionCommandNode");
        ActionCommandNode elseAction = (ActionCommandNode) ifStmt.elseStatement;
        assertEquals("done", elseAction.command, "Else command should be 'done'");
    }

    @Test
    public void testWhileStatement() {
        // ตัวอย่าง input สำหรับ while-statement
        String input = "while (x) done";
        Tokenizer tokenizer = new Tokenizer(input);
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        StrategyNode strategy = parser.parseStrategy();

        // ตรวจสอบว่า AST มี statement เพียง 1 ตัวและเป็น WhileStatementNode
        assertNotNull(strategy, "StrategyNode should not be null");
        assertEquals(1, strategy.statements.size(), "There should be exactly one statement");
        StatementNode stmt = strategy.statements.get(0);
        assertTrue(stmt instanceof WhileStatementNode, "Statement should be a WhileStatementNode");
        WhileStatementNode whileStmt = (WhileStatementNode) stmt;

        // ตรวจสอบเงื่อนไขของ while
        assertTrue(whileStmt.condition instanceof IdentifierNode, "Condition should be an IdentifierNode");
        IdentifierNode condition = (IdentifierNode) whileStmt.condition;
        assertEquals("x", condition.name, "While condition should be 'x'");

        // ตรวจสอบ statement ภายใน while ควรเป็น action command "done"
        assertTrue(whileStmt.statement instanceof ActionCommandNode, "While inner statement should be ActionCommandNode");
        ActionCommandNode action = (ActionCommandNode) whileStmt.statement;
        assertEquals("done", action.command, "While inner command should be 'done'");
    }
}
