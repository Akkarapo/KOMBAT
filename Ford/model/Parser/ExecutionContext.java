package project.kombat.model.Parser;

// File: src/com/imperment/kombat/strategy/ExecutionContext.java


import java.util.HashMap;
import java.util.Map;

public class ExecutionContext {
    // สำหรับเก็บตัวแปร local ในการประมวลผล strategy ของมินเนี่ยน
    private Map<String, Long> localVariables;

    public ExecutionContext() {
        localVariables = new HashMap<>();
    }

    public void setVariable(String name, long value) {
        localVariables.put(name, value);
    }

    public long getVariable(String name) {
        return localVariables.getOrDefault(name, 0L);
    }
}
