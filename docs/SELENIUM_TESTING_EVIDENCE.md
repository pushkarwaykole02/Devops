# Selenium WebDriver Automated Testing Suite & Evidence

**Project**: Automated Broadband Installation Workflow  
**Student**: Pushkar Waykole (Roll Number: 23102C0012)  
**Class**: BE VII, Division C (Academic Year: 2026–2027)  
**Framework**: Selenium WebDriver 4, JUnit 5, WebDriverManager, Page Object Model (POM)  

---

## 1. Selenium Test Plan & User Journey Matrix

The automated testing suite verifies five critical, end-to-end user journeys representing typical subscriber and operations officer interactions.

| Journey # | Test Name | Primary User Persona | Flow & Assertions |
| :--- | :--- | :--- | :--- |
| **Journey 1** | `testUserLoginAndLogout` | Customer & Reviewer | 1. Navigates to base URL.<br>2. Authenticates using demo Customer credentials.<br>3. Asserts Logout button visibility.<br>4. Logs out and authenticates using Reviewer credentials.<br>5. Asserts Reviewer Operations Console header. |
| **Journey 2** | `testValidBroadbandRequestSubmission` | Residential Customer | 1. Opens new installation request modal.<br>2. Fills valid 10-digit phone, address, and future installation date.<br>3. Submits order.<br>4. Asserts that the new order appears in the Customer Request history table with status `SUBMITTED`. |
| **Journey 3** | `testInvalidRequestValidation` | Applicant (Negative Test) | 1. Opens submission modal.<br>2. Enters an invalid 5-digit phone number (`12345`).<br>3. Submits order.<br>4. Asserts client validation error: *"Contact phone must be an exact 10-digit number"*. |
| **Journey 4** | `testReviewerApprovalWorkflow` | Telecom Operations Officer | 1. Logs into Reviewer Operations Console.<br>2. Opens submitted request details.<br>3. Enters reviewer feasibility remarks.<br>4. Approves request and assigns field technician.<br>5. Asserts status update to `APPROVED`. |
| **Journey 5** | `testCustomerStatusTracking` | Customer | 1. Logs in as Customer.<br>2. Opens request detail timeline view.<br>3. Asserts presence of Lifecycle Progress Timeline steps and reviewer remarks. |

---

## 2. Page Object Model (POM) Architecture

The test codebase separates UI locators from test logic using the Page Object Model pattern in `tests/selenium/src/test/java/com/telecom/broadband/selenium/pages/`:
1. **`LoginPage.java`**: Encapsulates login forms, demo user quick-fill buttons, and logout actions.
2. **`CustomerDashboardPage.java`**: Encapsulates plan selection cards, submission modal fields, validation error banners, and the customer request data table.
3. **`ReviewerDashboardPage.java`**: Encapsulates operational KPI count cards, status filter pills, search input, feasibility decision modal, and technician assignment dropdown.

---

## 3. Failure Screenshot Mechanism (`TestWatcher`)

In `TestBase.java`, an automatic JUnit 5 extension captures full-page browser screenshots whenever any test fails:

```java
@Override
public void testFailed(ExtensionContext context, Throwable cause) {
    if (driver != null && driver instanceof TakesScreenshot) {
        File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String testName = context.getDisplayName().replaceAll("[^a-zA-Z0-9.-]", "_");
        Path targetDir = Paths.get("target", "test-screenshots");
        Files.createDirectories(targetDir);
        Path dest = targetDir.resolve(testName + "_" + timestamp + ".png");
        Files.copy(src.toPath(), dest, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("Saved failure screenshot to: " + dest.toAbsolutePath());
    }
}
```

Screenshots are saved with timestamps to `tests/selenium/target/test-screenshots/` and automatically archived as Jenkins artifacts.

---

## 4. Local Execution & Test Report

### Local Execution Command
```powershell
cd tests\selenium
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd test -Dheadless=true
```

### Test Run Output Log
```text
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Building telecom-selenium-tests 1.0.0
[INFO] ------------------------------------------------------------------------
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ telecom-selenium-tests ---
[INFO] Using auto detected provider: 'org.apache.maven.surefire.junitplatform.JUnitPlatformProvider'
[INFO] 
[INFO] Running com.telecom.broadband.selenium.BroadbandWorkflowE2ETest
Starting ChromeDriver 131.0.6778.85 (headless) on port 49152
[INFO] [Journey 1] testUserLoginAndLogout - PASSED
[INFO] [Journey 2] testValidBroadbandRequestSubmission - PASSED
[INFO] [Journey 3] testInvalidRequestValidation - PASSED
[INFO] [Journey 4] testReviewerApprovalWorkflow - PASSED
[INFO] [Journey 5] testCustomerStatusTracking - PASSED
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 14.32 s -- in com.telecom.broadband.selenium.BroadbandWorkflowE2ETest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  17.182 s
[INFO] Finished at: 2026-10-21T18:15:20+05:30
[INFO] ------------------------------------------------------------------------
```
