package com.telecom.broadband;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.telecom.broadband.dto.AuthRequest;
import com.telecom.broadband.dto.RequestSubmissionDto;
import com.telecom.broadband.dto.ReviewActionDto;
import com.telecom.broadband.entity.RequestStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AutomatedBroadbandApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Context loads successfully")
    void contextLoads() {
    }

    @Test
    @DisplayName("Health endpoint returns UP status")
    void healthCheckTest() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.author", containsString("Pushkar Waykole")));
    }

    @Test
    @DisplayName("User login succeeds for seeded reviewer")
    void loginReviewerSuccess() throws Exception {
        AuthRequest auth = new AuthRequest("reviewer", "Reviewer@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("ROLE_REVIEWER")));
    }

    @Test
    @DisplayName("User login fails with invalid credentials")
    void loginFailure() throws Exception {
        AuthRequest auth = new AuthRequest("reviewer", "WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(auth)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Full workflow: Customer submit request -> Reviewer approves request")
    void fullWorkflowTest() throws Exception {
        // 1. Login as customer
        AuthRequest customerLogin = new AuthRequest("pushkar", "Customer@123");
        MvcResult customerResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String customerToken = objectMapper.readTree(customerResult.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // 2. Customer submits a valid request
        RequestSubmissionDto submission = new RequestSubmissionDto();
        submission.setContactName("Pushkar Waykole");
        submission.setContactPhone("9822012345");
        submission.setContactEmail("pushkar@telecom.com");
        submission.setAddressLine1("Plot 88, Model Colony");
        submission.setCity("Pune");
        submission.setState("Maharashtra");
        submission.setPostalCode("411016");
        submission.setPreferredDate(LocalDate.now().plusDays(4));
        submission.setPlanName("Fiber Ultra 300");
        submission.setPlanSpeed("300 Mbps");
        submission.setPlanPrice(49.99);

        MvcResult submitResult = mockMvc.perform(post("/api/requests")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.requestId", startsWith("BB-2026-")))
                .andExpect(jsonPath("$.data.status", is("SUBMITTED")))
                .andReturn();

        long createdId = objectMapper.readTree(submitResult.getResponse().getContentAsString())
                .path("data").path("id").asLong();

        // 3. Login as reviewer
        AuthRequest reviewerLogin = new AuthRequest("reviewer", "Reviewer@123");
        MvcResult reviewerResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String reviewerToken = objectMapper.readTree(reviewerResult.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // 4. Reviewer approves request
        ReviewActionDto reviewDto = new ReviewActionDto();
        reviewDto.setStatus(RequestStatus.APPROVED);
        reviewDto.setRemarks("Feasibility verified by automation test");

        mockMvc.perform(put("/api/requests/reviewer/" + createdId + "/review")
                        .header("Authorization", "Bearer " + reviewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("APPROVED")))
                .andExpect(jsonPath("$.data.reviewerRemarks", is("Feasibility verified by automation test")));
    }

    @Test
    @DisplayName("Validation fails when required fields are missing")
    void validationFailureTest() throws Exception {
        // Login as customer
        AuthRequest customerLogin = new AuthRequest("pushkar", "Customer@123");
        MvcResult customerResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String customerToken = objectMapper.readTree(customerResult.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // Submit incomplete request (missing phone, invalid email)
        RequestSubmissionDto submission = new RequestSubmissionDto();
        submission.setContactName(""); // Blank
        submission.setContactPhone("123"); // Invalid length
        submission.setContactEmail("invalid-email"); // Invalid pattern

        mockMvc.perform(post("/api/requests")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.data.contactName", notNullValue()))
                .andExpect(jsonPath("$.data.contactPhone", notNullValue()));
    }
}
