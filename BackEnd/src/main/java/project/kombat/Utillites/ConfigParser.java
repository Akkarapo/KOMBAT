package project.kombat.Utillites;

// File: src/com/imperment/kombat/util/ConfigParser.java


import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ConfigParser {

    /**
     * อ่านไฟล์ configuration แล้วแปลงข้อมูลเป็น Map<String, Long>
     * @param filePath เส้นทางไปยังไฟล์ configuration
     * @return Map ที่เก็บค่า configuration ทั้งหมด
     * @throws IOException ถ้าไม่สามารถอ่านไฟล์ได้
     */
    public static Map<String, Long> parseConfig(String filePath) throws IOException {
        Map<String, Long> config = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                // ข้ามบรรทัดที่เป็นคอมเมนต์หรือว่างเปล่า
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                // คาดว่าข้อมูลอยู่ในรูปแบบ key=value
                String[] parts = line.split("=");
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    try {
                        Long value = Long.parseLong(parts[1].trim());
                        config.put(key, value);
                    } catch (NumberFormatException e) {
                        System.err.println("Invalid number format for key: " + key);
                    }
                }
            }
        }
        return config;
    }
}
