package project.kombat.model.Parser;

import java.util.List;

public class StrategyNode extends ASTNode {
    public List<StatementNode> statements;

    public StrategyNode(List<StatementNode> statements) {
        this.statements = statements;
    }
}
