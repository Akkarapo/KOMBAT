package project.kombat.Utillites;
// File: src/com/imperment/kombat/util/Logger.java


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * พิมพ์ log message พร้อม timestamp ลงใน console
     * @param message ข้อความที่ต้องการ log
     */
    public static void log(String message) {
        String timeStamp = LocalDateTime.now().format(formatter);
        System.out.println("[" + timeStamp + "] " + message);
    }
}
