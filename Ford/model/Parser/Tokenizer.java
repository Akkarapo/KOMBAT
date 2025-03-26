package project.kombat.model.Parser;
// File: src/com/imperment/kombat/strategy/Tokenizer.java


import java.util.ArrayList;
import java.util.List;

public class Tokenizer {
    private String input;
    private int pos;
    private int length;

    public Tokenizer(String input) {
        this.input = input;
        this.pos = 0;
        this.length = input.length();
    }

    public List<Token> tokenize() {
        List<Token> tokens = new ArrayList<>();
        while (pos < length) {
            char current = peek();
            if (Character.isWhitespace(current)) {
                advance();
            } else if (current == '#') {
                skipComment();
            } else if (Character.isDigit(current)) {
                tokens.add(number());
            } else if (Character.isLetter(current)) {
                tokens.add(identifierOrKeyword());
            } else {
                tokens.add(symbol());
            }
        }
        tokens.add(new Token(TokenType.EOF, "", pos));
        return tokens;
    }

    private char peek() {
        return input.charAt(pos);
    }

    private char advance() {
        return input.charAt(pos++);
    }

    private void skipComment() {
        while (pos < length && peek() != '\n') {
            advance();
        }
    }

    private Token number() {
        int start = pos;
        while (pos < length && Character.isDigit(peek())) {
            advance();
        }
        String lexeme = input.substring(start, pos);
        return new Token(TokenType.NUMBER, lexeme, start);
    }

    private Token identifierOrKeyword() {
        int start = pos;
        while (pos < length && Character.isLetterOrDigit(peek())) {
            advance();
        }
        String lexeme = input.substring(start, pos);
        TokenType type = keywordType(lexeme);
        if (type == null) {
            type = TokenType.IDENTIFIER;
        }
        return new Token(type, lexeme, start);
    }

    private TokenType keywordType(String lexeme) {
        switch (lexeme) {
            case "if":       return TokenType.IF;
            case "then":     return TokenType.THEN;
            case "else":     return TokenType.ELSE;
            case "while":    return TokenType.WHILE;
            case "move":     return TokenType.MOVE;
            case "shoot":    return TokenType.SHOOT;
            case "done":     return TokenType.DONE;
            case "ally":     return TokenType.ALLY;
            case "opponent": return TokenType.OPPONENT;
            case "nearby":   return TokenType.NEARBY;
            default:         return null;
        }
    }

    private Token symbol() {
        int start = pos;
        char current = advance();
        Token token;
        switch (current) {
            case '+': token = new Token(TokenType.PLUS, "+", start); break;
            case '-': token = new Token(TokenType.MINUS, "-", start); break;
            case '*': token = new Token(TokenType.STAR, "*", start); break;
            case '/': token = new Token(TokenType.SLASH, "/", start); break;
            case '%': token = new Token(TokenType.PERCENT, "%", start); break;
            case '^': token = new Token(TokenType.CARET, "^", start); break;
            case '=': token = new Token(TokenType.EQUAL, "=", start); break;
            case '(': token = new Token(TokenType.LPAREN, "(", start); break;
            case ')': token = new Token(TokenType.RPAREN, ")", start); break;
            case '{': token = new Token(TokenType.LBRACE, "{", start); break;
            case '}': token = new Token(TokenType.RBRACE, "}", start); break;
            default:
                throw new RuntimeException("Unexpected character: " + current + " at position " + start);
        }
        return token;
    }
}
