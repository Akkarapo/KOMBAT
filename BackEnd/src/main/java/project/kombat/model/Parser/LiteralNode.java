package project.kombat.model.Parser;

public class LiteralNode extends ExpressionNode {
    public long value;

    public LiteralNode(long value) {
        this.value = value;
    }
}
