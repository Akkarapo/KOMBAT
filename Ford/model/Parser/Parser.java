package project.kombat.model.Parser;

// File: src/com/imperment/kombat/strategy/Parser.java


import java.util.ArrayList;
import java.util.List;

public class Parser {
    private List<Token> tokens;
    private int current;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    public StrategyNode parseStrategy() {
        List<StatementNode> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(parseStatement());
        }
        return new StrategyNode(statements);
    }

    private StatementNode parseStatement() {
        if (match(TokenType.IF)) {
            return parseIfStatement();
        } else if (match(TokenType.WHILE)) {
            return parseWhileStatement();
        } else if (match(TokenType.LBRACE)) {
            return parseBlockStatement();
        } else {
            // ตรวจสอบว่ามีการ assignment หรือเป็น action command
            if (check(TokenType.IDENTIFIER) && peekNext().getType() == TokenType.EQUAL) {
                return parseAssignmentStatement();
            } else {
                return parseActionCommand();
            }
        }
    }

    private StatementNode parseAssignmentStatement() {
        Token identifier = consume(TokenType.IDENTIFIER, "Expected identifier");
        consume(TokenType.EQUAL, "Expected '=' after identifier");
        ExpressionNode expr = parseExpression();
        return new AssignmentStatementNode(identifier.getLexeme(), expr);
    }

    private StatementNode parseActionCommand() {
        Token token = advance();
        if (token.getType() == TokenType.DONE) {
            return new ActionCommandNode("done", null, null);
        } else if (token.getType() == TokenType.MOVE) {
            Token direction = consume(TokenType.IDENTIFIER, "Expected direction after move");
            return new ActionCommandNode("move", direction.getLexeme(), null);
        } else if (token.getType() == TokenType.SHOOT) {
            Token direction = consume(TokenType.IDENTIFIER, "Expected direction after shoot");
            ExpressionNode expr = parseExpression();
            return new ActionCommandNode("shoot", direction.getLexeme(), expr);
        } else {
            throw new RuntimeException("Unexpected token in action command: " + token);
        }
    }

    private StatementNode parseIfStatement() {
        consume(TokenType.LPAREN, "Expected '(' after if");
        ExpressionNode condition = parseExpression();
        consume(TokenType.RPAREN, "Expected ')' after condition");
        consume(TokenType.THEN, "Expected 'then' after condition");
        StatementNode thenStmt = parseStatement();
        consume(TokenType.ELSE, "Expected 'else' after then statement");
        StatementNode elseStmt = parseStatement();
        return new IfStatementNode(condition, thenStmt, elseStmt);
    }

    private StatementNode parseWhileStatement() {
        consume(TokenType.LPAREN, "Expected '(' after while");
        ExpressionNode condition = parseExpression();
        consume(TokenType.RPAREN, "Expected ')' after condition");
        StatementNode stmt = parseStatement();
        return new WhileStatementNode(condition, stmt);
    }

    private BlockStatementNode parseBlockStatement() {
        List<StatementNode> statements = new ArrayList<>();
        while (!check(TokenType.RBRACE) && !isAtEnd()) {
            statements.add(parseStatement());
        }
        consume(TokenType.RBRACE, "Expected '}' after block");
        return new BlockStatementNode(statements);
    }

    // ตัวอย่างการ parse expression ด้วย precedence แบบง่าย ๆ
    private ExpressionNode parseExpression() {
        return parseAddition();
    }

    private ExpressionNode parseAddition() {
        ExpressionNode expr = parseMultiplication();
        while (match(TokenType.PLUS, TokenType.MINUS)) {
            Token operator = previous();
            ExpressionNode right = parseMultiplication();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private ExpressionNode parseMultiplication() {
        ExpressionNode expr = parseUnary();
        while (match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
            Token operator = previous();
            ExpressionNode right = parseUnary();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private ExpressionNode parseUnary() {
        // ยังไม่มี unary operator พิเศษ จึงเรียก parsePrimary ตรง ๆ
        return parsePrimary();
    }

    private ExpressionNode parsePrimary() {
        if (match(TokenType.NUMBER)) {
            return new LiteralNode(Long.parseLong(previous().getLexeme()));
        } else if (match(TokenType.IDENTIFIER)) {
            return new IdentifierNode(previous().getLexeme());
        } else if (match(TokenType.LPAREN)) {
            ExpressionNode expr = parseExpression();
            consume(TokenType.RPAREN, "Expected ')' after expression");
            return expr;
        } else if (match(TokenType.ALLY, TokenType.OPPONENT, TokenType.NEARBY)) {
            Token infoToken = previous();
            String direction = null;
            if (infoToken.getType() == TokenType.NEARBY && check(TokenType.IDENTIFIER)) {
                direction = advance().getLexeme();
            }
            return new InfoExpressionNode(infoToken.getLexeme(), direction);
        }
        throw new RuntimeException("Unexpected token: " + peek());
    }

    private boolean match(TokenType... types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private Token consume(TokenType type, String errorMessage) {
        if (check(type)) return advance();
        throw new RuntimeException(errorMessage + " at position " + peek().getPosition());
    }

    private boolean check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().getType() == type;
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean isAtEnd() {
        return peek().getType() == TokenType.EOF;
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private Token peekNext() {
        if (current + 1 < tokens.size()) {
            return tokens.get(current + 1);
        }
        return new Token(TokenType.EOF, "", peek().getPosition());
    }

}
