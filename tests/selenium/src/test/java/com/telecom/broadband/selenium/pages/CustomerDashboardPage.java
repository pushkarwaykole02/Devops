package com.telecom.broadband.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CustomerDashboardPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By newRequestBtn = By.id("btn-new-request");
    private final By nameInput = By.id("input-req-name");
    private final By phoneInput = By.id("input-req-phone");
    private final By emailInput = By.id("input-req-email");
    private final By address1Input = By.id("input-req-address1");
    private final By cityInput = By.id("input-req-city");
    private final By stateInput = By.id("input-req-state");
    private final By postalInput = By.id("input-req-postal");
    private final By dateInput = By.id("input-req-date");
    private final By submitOrderBtn = By.id("btn-submit-order");
    private final By searchInput = By.id("input-customer-search");

    public CustomerDashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(8));
    }

    public void openNewRequestModal() {
        wait.until(ExpectedConditions.elementToBeClickable(newRequestBtn)).click();
    }

    public void fillRequestForm(String name, String phone, String email, String address, String city, String state, String postal, String date) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(nameInput)).clear();
        driver.findElement(nameInput).sendKeys(name);

        WebElement phoneEl = driver.findElement(phoneInput);
        phoneEl.clear();
        phoneEl.sendKeys(phone);

        WebElement emailEl = driver.findElement(emailInput);
        emailEl.clear();
        emailEl.sendKeys(email);

        WebElement addrEl = driver.findElement(address1Input);
        addrEl.clear();
        addrEl.sendKeys(address);

        WebElement cityEl = driver.findElement(cityInput);
        cityEl.clear();
        cityEl.sendKeys(city);

        WebElement stateEl = driver.findElement(stateInput);
        stateEl.clear();
        stateEl.sendKeys(state);

        WebElement postEl = driver.findElement(postalInput);
        postEl.clear();
        postEl.sendKeys(postal);

        WebElement dateEl = driver.findElement(dateInput);
        dateEl.clear();
        dateEl.sendKeys(date);
    }

    public void submitOrder() {
        driver.findElement(submitOrderBtn).click();
    }

    public boolean isRequestPresentInTable(String textToFind) {
        try {
            By rowLocator = By.xpath("//table[contains(@class, 'telecom-table')]//td[contains(text(), '" + textToFind + "')]");
            return wait.until(ExpectedConditions.visibilityOfElementLocated(rowLocator)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void openFirstRequestTimeline() {
        By firstTrackBtn = By.xpath("//button[contains(@id, 'btn-track-')]");
        wait.until(ExpectedConditions.elementToBeClickable(firstTrackBtn)).click();
    }

    public boolean isTimelineModalDisplayed() {
        try {
            By timelineLocator = By.xpath("//div[contains(@class, 'timeline')]");
            return wait.until(ExpectedConditions.visibilityOfElementLocated(timelineLocator)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
