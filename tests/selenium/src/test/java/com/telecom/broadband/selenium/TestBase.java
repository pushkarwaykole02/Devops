package com.telecom.broadband.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

public abstract class TestBase implements TestWatcher {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;

    @BeforeEach
    public void setUp() {
        baseUrl = System.getProperty("baseUrl", "http://localhost:3000");
        boolean headless = Boolean.parseBoolean(System.getProperty("headless", "true"));

        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        if (headless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        if (driver != null && driver instanceof TakesScreenshot) {
            try {
                File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String testName = context.getDisplayName().replaceAll("[^a-zA-Z0-9.-]", "_");
                Path targetDir = Paths.get("target", "test-screenshots");
                Files.createDirectories(targetDir);
                Path dest = targetDir.resolve(testName + "_" + timestamp + ".png");
                Files.copy(src.toPath(), dest, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Saved failure screenshot to: " + dest.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("Could not capture screenshot on failure: " + e.getMessage());
            }
        }
    }

    @Override
    public void testSuccessful(ExtensionContext context) {
    }

    @Override
    public void testAborted(ExtensionContext context, Throwable cause) {
    }

    @Override
    public void testDisabled(ExtensionContext context, Optional<String> reason) {
    }
}
