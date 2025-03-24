package com.example.demo.config; // หรือ package อื่นที่สอดคล้องกับโครงสร้างโปรเจกต์ของคุณ

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * addCorsMappings:
     * - ระบุว่า path ไหนบ้างที่จะเปิด CORS
     * - allowedOrigins = ต้นทางที่อนุญาตให้เรียก API ได้
     * - allowedMethods = HTTP methods ที่อนุญาต (GET, POST, PUT, DELETE, ...)
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")               // ระบุ path ที่ต้องการอนุญาต
                .allowedOrigins("http://localhost:3000")  // ระบุ origin ของ frontend
                .allowedMethods("*");                      // อนุญาตทุก method
    }
}
