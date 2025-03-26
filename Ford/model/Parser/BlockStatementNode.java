package project.kombat.model.Parser;

import java.util.List;

public class BlockStatementNode extends StatementNode {
    public List<StatementNode> statements;

    public BlockStatementNode(List<StatementNode> statements) {
        this.statements = statements;
    }
}
