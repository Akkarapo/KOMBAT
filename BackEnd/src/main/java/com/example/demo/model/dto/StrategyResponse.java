package com.example.demo.model.dto;

import com.example.demo.parser.Action;
import java.util.List;

public class StrategyResponse {
    private List<Action> actions;
    private String debug;

    public StrategyResponse() {
    }

    public StrategyResponse(List<Action> actions, String debug) {
        this.actions = actions;
        this.debug = debug;
    }

    public List<Action> getActions() {
        return actions;
    }

    public void setActions(List<Action> actions) {
        this.actions = actions;
    }

    public String getDebug() {
        return debug;
    }

    public void setDebug(String debug) {
        this.debug = debug;
    }
}
