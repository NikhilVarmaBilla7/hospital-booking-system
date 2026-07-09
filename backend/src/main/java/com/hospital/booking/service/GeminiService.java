package com.hospital.booking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String userMessage) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct JSON request body
            Map<String, Object> body = new HashMap<>();
            
            Map<String, Object> textPart = new HashMap<>();
            // Let's add system prompt context to make it a helpful medical receptionist AI
            String systemContext = "You are a helpful medical assistant chatbot for CarePlus Hospital. "
                    + "Provide polite, concise, and helpful responses to users regarding booking, departments, general health guidelines, "
                    + "and hospital information. Do not prescribe specific medications. Keep responses short (under 3 sentences).\n\n"
                    + "User question: " + userMessage;
            textPart.put("text", systemContext);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(textPart));

            body.put("contents", List.of(parts));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map responseBody = response.getBody();
                List candidates = (List) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    if (content != null) {
                        List responseParts = (List) content.get("parts");
                        if (responseParts != null && !responseParts.isEmpty()) {
                            Map firstPart = (Map) responseParts.get(0);
                            return (String) firstPart.get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API call failed, falling back. Error: " + e.getMessage());
        }

        // Fallback response generator if API fails
        return getFallbackResponse(userMessage);
    }

    private String getFallbackResponse(String message) {
        String msg = message.toLowerCase();
        if (msg.contains("book") || msg.contains("appointment") || msg.contains("schedule")) {
            return "To book or reschedule an appointment, please search for a doctor in the search bar above, view their profile, and click on an available time slot.";
        } else if (msg.contains("cancel")) {
            return "You can cancel any scheduled appointment from the 'Appointments History' card by clicking the 'Cancel' button next to the appointment details.";
        } else if (msg.contains("doctor") || msg.contains("specialist")) {
            return "Our hospital has specialists in Cardiology, Pediatrics, Orthopedics, Neurology, and Dermatology. Search for them in the search bar above.";
        } else if (msg.contains("hello") || msg.contains("hi")) {
            return "Hello! I am your CarePlus Assistant. How can I help you today? You can ask me about scheduling appointments or our general services.";
        } else {
            return "Thank you for reaching out. Please search for doctors or manage your bookings using the main navigation dashboards.";
        }
    }
}
