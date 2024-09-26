import {TokenType} from "./TokenType";

export class Token {
    token_type: number;
    lexeme: string;
    literal: any;
    line: number;

    constructor(token_type: number, lexeme: string, literal: any, line: number) {
        this.token_type = token_type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

}