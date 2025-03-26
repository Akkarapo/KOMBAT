package project.kombat.model.Parser;
// File: src/com/imperment/kombat/strategy/TokenType.java

public enum TokenType {
    // Reserved Keywords
    IF, THEN, ELSE, WHILE, MOVE, SHOOT, DONE, ALLY, OPPONENT, NEARBY,

    // Operators and Symbols
    PLUS, MINUS, STAR, SLASH, PERCENT, CARET, EQUAL,
    LPAREN, RPAREN, LBRACE, RBRACE,

    // Literals
    NUMBER, IDENTIFIER,

    // End Of File
    EOF
}
