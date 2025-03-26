package project.kombat.model.Parser;
// File: src/com/imperment/kombat/strategy/Token.java

public class Token {
    private TokenType type;
    private String lexeme;
    private int position;

    public Token(TokenType type, String lexeme, int position) {
        this.type = type;
        this.lexeme = lexeme;
        this.position = position;
    }

    public TokenType getType() {
        return type;
    }

    public String getLexeme() {
        return lexeme;
    }

    public int getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return type + " (" + lexeme + ")";
    }
}
