package com.example.demo.ast.expression;

import com.example.demo.ast.Node;
import com.example.demo.model.Player;

public interface Expression extends Node {
    // Stub method สำหรับประเมินค่า
    default Object eval(Player player) {
        return null;
    }
}
