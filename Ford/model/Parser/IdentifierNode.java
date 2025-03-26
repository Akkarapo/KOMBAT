package project.kombat.model.Parser;

public class IdentifierNode extends ExpressionNode {
    public String name;

    public IdentifierNode(String name) {
        this.name = name;
    }
}
