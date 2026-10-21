package com.telecom.broadband.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ReviewerDashboardPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By searchInput = By.id("input-reviewer-search");
    private final By reviewActionSelect = By.id("select-review-action");
    private final By remarksInput = By.id("input-reviewer-remarks");
    private final By rejectionInput = By.id("input-rejection-reason");
    private final By confirmReviewBtn = By.id("btn-confirm-review");

    public ReviewerDashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(8));
    }

    public void filterByTab(String tabId) {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("tab-" + tabId))).click();
    }

    public void openFirstReviewModal() {
        By firstReviewBtn = By.xpath("//button[contains(@id, 'btn-review-')]");
        wait.until(ExpectedConditions.elementToBeClickable(firstReviewBtn)).click();
    }

    public void selectAction(String actionValue) {
        WebElement selectEl = wait.until(ExpectedConditions.visibilityOfElementLocated(reviewActionSelect));
        Select select = new Select(selectEl);
        select.selectByValue(actionValue);
    }

    public void enterRemarks(String remarks) {
        WebElement remEl = wait.until(ExpectedConditions.visibilityOfElementLocated(remarksInput));
        remEl.clear();
        remEl.sendKeys(remarks);
    }

    public void enterRejectionReason(String reason) {
        WebElement rejEl = wait.until(ExpectedConditions.visibilityOfElementLocated(rejectionInput));
        rejEl.clear();
        rejEl.sendKeys(reason);
    }

    public void confirmReview() {
        wait.until(ExpectedConditions.elementToBeClickable(confirmReviewBtn)).click();
    }

    public boolean isReviewerTableLoaded() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//table[contains(@class, 'telecom-table')]"))).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
