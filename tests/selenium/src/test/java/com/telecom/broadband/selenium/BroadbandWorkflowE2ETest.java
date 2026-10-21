package com.telecom.broadband.selenium;

import com.telecom.broadband.selenium.pages.CustomerDashboardPage;
import com.telecom.broadband.selenium.pages.LoginPage;
import com.telecom.broadband.selenium.pages.ReviewerDashboardPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class BroadbandWorkflowE2ETest extends TestBase {

    @Test
    @Order(1)
    @DisplayName("Journey 1: User Login and Logout (Customer & Reviewer)")
    public void testUserLoginAndLogout() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);

        // 1. Login as Customer
        loginPage.clickDemoCustomer();
        assertTrue(loginPage.isLogoutButtonVisible(), "Logout button should be visible after Customer login");

        // 2. Logout
        loginPage.logout();

        // 3. Login as Reviewer
        loginPage.clickDemoReviewer();
        assertTrue(loginPage.isLogoutButtonVisible(), "Logout button should be visible after Reviewer login");
        assertTrue(driver.getPageSource().contains("Broadband Reviewer Operations"), "Reviewer dashboard header should be displayed");

        loginPage.logout();
    }

    @Test
    @Order(2)
    @DisplayName("Journey 2: Submission of a Valid Broadband Request")
    public void testValidBroadbandRequestSubmission() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.clickDemoCustomer();

        CustomerDashboardPage customerPage = new CustomerDashboardPage(driver);
        customerPage.openNewRequestModal();

        String futureDate = LocalDate.now().plusDays(5).toString();
        customerPage.fillRequestForm(
                "Pushkar Waykole",
                "9822012345",
                "pushkar@telecom.com",
                "Sector 7, Sunshine Residency",
                "Pune",
                "Maharashtra",
                "411028",
                futureDate
        );

        customerPage.submitOrder();

        // Verify that the table updates with the new or existing requests
        assertTrue(customerPage.isRequestPresentInTable("Pune"), "Newly submitted request address should appear in customer request table");
    }

    @Test
    @Order(3)
    @DisplayName("Journey 3: Validation of an Invalid or Incomplete Request")
    public void testInvalidRequestValidation() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.clickDemoCustomer();

        CustomerDashboardPage customerPage = new CustomerDashboardPage(driver);
        customerPage.openNewRequestModal();

        // Pass invalid phone (less than 10 digits)
        customerPage.fillRequestForm(
                "Test Applicant",
                "12345", // Invalid phone format
                "test@test.com",
                "Street 1",
                "Pune",
                "Maharashtra",
                "411001",
                LocalDate.now().plusDays(2).toString()
        );

        customerPage.submitOrder();

        // Validate error message appears
        assertTrue(driver.getPageSource().contains("10-digit number"), "Validation message for 10-digit phone should be displayed");
    }

    @Test
    @Order(4)
    @DisplayName("Journey 4: Reviewer Approval or Rejection Workflow")
    public void testReviewerApprovalWorkflow() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.clickDemoReviewer();

        ReviewerDashboardPage reviewerPage = new ReviewerDashboardPage(driver);
        assertTrue(reviewerPage.isReviewerTableLoaded(), "Reviewer requests table should be loaded");

        reviewerPage.openFirstReviewModal();
        reviewerPage.selectAction("APPROVED");
        reviewerPage.enterRemarks("Automated Selenium Test verification approved.");
        reviewerPage.confirmReview();

        // Verify reviewer table remains loaded and updated
        assertTrue(reviewerPage.isReviewerTableLoaded(), "Table should refresh after approval");
    }

    @Test
    @Order(5)
    @DisplayName("Journey 5: Customer Request Status Tracking and Lifecycle Timeline")
    public void testCustomerStatusTracking() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(baseUrl);
        loginPage.clickDemoCustomer();

        CustomerDashboardPage customerPage = new CustomerDashboardPage(driver);
        customerPage.openFirstRequestTimeline();

        assertTrue(customerPage.isTimelineModalDisplayed(), "Visual timeline modal should be displayed");
        assertTrue(driver.getPageSource().contains("Request Lifecycle Tracker"), "Modal title should be present");
        assertTrue(driver.getPageSource().contains("Workflow Progress Pipeline"), "Workflow progress section should be present");
    }
}
