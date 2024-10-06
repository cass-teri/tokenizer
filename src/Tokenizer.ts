import {Result} from "./Result"
import {Token} from "./Token"
import {TokenType} from "./TokenType"
import {KeywordMap} from "./KeywordMap"

export class Tokenizer {

    tokens: Token[] = []
    start: number = 0
    current: number = 0
    line: number = 1
    source: string = ""

    constructor(fml: string) {
        this.source = fml
        this.start = 0
        this.tokens = []
        this.current = 0
        this.line = 1
    }

    public Tokenize(): Result<Token[] | null, Error | null> {

        while (!this.IsAtEnd()) {
            this.start = this.current
            this.ScanToken()
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
        return new Result(this.tokens, null)
    }

    private IsAtEnd(): boolean {
        return this.current >= this.source.length
    }

    private ScanToken() {
        let c = this.Advance()
        switch (c) {
            case '(': this.AddToken(TokenType.LEFT_PARENTHESIS)
                break
            case ')': this.AddToken(TokenType.RIGHT_PARENTHESIS)
                break
            case '{': this.AddToken(TokenType.LEFT_BRACE)
                break
            case '}': this.AddToken(TokenType.RIGHT_BRACE)
                break
            case '[': this.AddToken(TokenType.LEFT_BRACKET)
                break
            case ']': this.AddToken(TokenType.RIGHT_BRACKET)
                break
            case ',': this.AddToken(TokenType.COMMA)
                break
            case '.': this.AddToken(TokenType.DOT)
                break
            case '-': this.AddToken(TokenType.MINUS)
                break
            case '+': this.AddToken(TokenType.PLUS)
                break
            case '*': this.AddToken(TokenType.ASTERISK)
                break
            case '': this.AddToken(TokenType.SEMICOLON)
                break
            case '!': this.AddToken(this.MatchNext('=') ? TokenType.EXCLAMATION_POINT_EQUAL : TokenType.EXCLAMATION_POINT)
                break
            case '=': this.AddToken(this.MatchNext('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
                break
            case '<': this.AddToken(this.MatchNext('=') ? TokenType.LESS_THAN_EQUAL : TokenType.LESS_THAN)
                break
            case '>': this.AddToken(this.MatchNext('=') ? TokenType.GREATER_THAN_EQUAL : TokenType.GREATER_THAN)
                break
            case "/": {
                if (this.MatchNext("/")) {
                    while (this.PeekNext() != '\n' && !this.IsAtEnd()) {
                        this.Advance()
                    }
                } else {
                    this.AddToken(TokenType.FORWARD_SLASH)
                }
                break
            }
            case "#": {
                if(this.MatchNext("{")) {
                    this.ReadMarkdown()
                }
                this.AddToken(TokenType.POUND )
                break
            }
            case '"': {
                this.ReadString()
                break
            }
            case ' ':
            case '\r':
            case '\t':
                break
            case '\n':
                this.line++
                break
            default:
                if (this.IsDigit(c)) {
                    this.ReadNumber()
                }
                else if (this.IsAlpha(c)) {
                    this.ReadIdentifier()
                }
                else {
                    throw new Error(`Unexpected character ${c}`)
                }
                break
        }
    }


    private Advance() {
        this.current++
        return this.source[this.current - 1]
    }

/*
    private AddToken(token: TokenType, literal: any) {
        let text = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(token, text, literal, this.line))
    }
*/

    private MatchNext(expected: string) {
        if (this.IsAtEnd()) return false
        if (this.source[this.current] != expected) return false
        this.current++
        return true
    }

    private IsDigit(lexeme: string) {
        return lexeme >= '0' && lexeme <= '9'
    }

    private ReadNumber() {
        while (this.IsDigit(this.PeekNext())) {
            this.Advance()
        }

        if (this.PeekNext() == '.' && this.IsDigit(this.PeekNext(1))) {
            this.Advance()
            while (this.IsDigit(this.PeekNext())) {
                this.Advance()
            }
        }
        let num = parseFloat(this.source.substring(this.start, this.current))
        this.AddToken(TokenType.NUMBER, num)
    }

    private PeekNext(offset: number = 0) {
        if(this.IsAtEnd()) return '\0'
        return this.source[this.current + offset]
    }

    private ReadString() {
        while (this.PeekNext() != '"' && !this.IsAtEnd()) {
            let next = this.PeekNext()
            console.log(`[${next}]`)
            if (this.PeekNext() == '\\' && this.PeekNext(1) == '"') {
                this.Advance(); // Skip the escape character
            }

            if (this.PeekNext() == '\n') {
                this.line++
            }
            this.Advance()
        }

        if (this.IsAtEnd()) {
            throw new Error("Unterminated string on line " + this.line)
        }

        this.Advance(); // Consume the closing quote
        let value = this.source.substring(this.start + 1, this.current - 1)
        value = value.replaceAll('\\"', '"')
        this.AddToken(TokenType.STRING, value)
    }


    private IsAlpha(c: string) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'
    }

    private IsAlphaNumeric(c: string) {
        return this.IsAlpha(c) || this.IsDigit(c)
    }

    private ReadIdentifier() {
        while (this.IsAlphaNumeric(this.PeekNext())) {
            this.Advance()
        }

        let text = this.source.substring(this.start, this.current)
        // @ts-ignore
        let token_type = KeywordMap[text] || TokenType.IDENTIFIER
        this.AddToken(token_type)
    }

    private AddToken(token_type: number, literal: any = null) {
        let text = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(token_type, text, literal, this.line))
    }

    private ReadMarkdown() {
        while (!this.IsAtEnd()){
            if (this.PeekNext() != '}'){
                this.Advance()
            }else{
                if(this.PeekNext(1) == "#"){
                    break
                }
                else {
                    if (this.IsAtEnd()) {
                        throw new Error(`Unterminated markdown on line ${this.line}: ${this.source.substring(this.start)}`)
                    }
                    this.Advance()
                }
            }
        }
        if (this.IsAtEnd()) {
            throw new Error(`Unterminated markdown on line ${this.line}: ${this.source.substring(this.start)}`)
        }

        if(!this.MatchNext("}")) {
            throw new Error(`Unterminated markdown on line ${this.line}: ${this.source.substring(this.start)}`)
        }
        if(!this.MatchNext("#")) {
            throw new Error(`Unterminated markdown on line ${this.line}: ${this.source.substring(this.start)}`)
        }

        let value = this.source.substring(this.start + 2, this.current - 2)
        value = value.trim().split("\n").map((line) => line.trim()).join("\n")
        this.AddToken(TokenType.MARKDOWN, value)
        this.line += value.split("\n").length + 1
        this.start = this.current
    }
}