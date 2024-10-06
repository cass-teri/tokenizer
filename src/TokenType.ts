
export const TokenType = {
    // Literals.
    IDENTIFIER: 0,
    STRING: 1,
    NUMBER: 2,
    MARKDOWN: 3,

    // Single-character tokens.
    ASTERISK: 4,
    COMMA: 5,
    DOT: 6,
    MINUS: 7,
    PLUS: 8,
    SEMICOLON: 9,
    FORWARD_SLASH: 10,
    BACK_SLASH: 11,
    POUND: 12,

    // Wrapping tokens.
    LEFT_BRACE: 13,
    RIGHT_BRACE: 14,

    LEFT_BRACKET: 15,
    RIGHT_BRACKET: 16,

    LEFT_PARENTHESIS: 17,
    RIGHT_PARENTHESIS: 18,

    // Boolean operators.
    EXCLAMATION_POINT: 19,
    EXCLAMATION_POINT_EQUAL: 20,

    EQUAL: 21,
    EQUAL_EQUAL: 22,

    GREATER_THAN: 23,
    GREATER_THAN_EQUAL: 24,

    LESS_THAN: 25,
    LESS_THAN_EQUAL: 26,


    // Keywords.
    AND: 27,
    ELSE: 28,
    FALSE: 29,
    LOOP: 30,
    IF: 31,
    OR: 32,
    PRINT: 33,
    RETURN: 34,
    TRUE: 35,
    LET: 36,
    CONST: 37,

    EOL: 99,
    EOF: 100,

}