package com.telecom.broadband.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By demoCustomerBtn = By.id("btn-demo-customer");
    private final By demoReviewerBtn = By.id("btn-demo-reviewer");
    private final By openLoginBtn = By.id("btn-open-login");
    private final By usernameInput = By.id("input-username");
    private final By passwordInput = By.id("input-password");
    private final By submitAuthBtn = By.id("btn-auth-submit");
    private final By logoutBtn = By.id("btn-logout");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(8));
    }

    public void navigateTo(String url) {
        driver.get(url);
    }

    public void clickDemoCustomer() {
        wait.until(ExpectedConditions.elementToBeClickable(demoCustomerBtn)).click();
    }

    public void clickDemoReviewer() {
        wait.until(ExpectedConditions.elementToBeClickable(demoReviewerBtn)).click();
    }

    public void loginWithCredentials(String username, String password) {
        wait.until(ExpectedConditions.elementToBeClickable(openLoginBtn)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(usernameInput)).sendKeys(username);
        driver.findElement(passwordInput).sendKeys(password);
        driver.findElement(submitAuthBtn).click();
    }

    public void logout() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutBtn)).click();
    }

    public boolean isLogoutButtonVisible() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(logoutBtn)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
