from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context with a larger viewport for better screenshots
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Navigate to the home page
        page.goto("http://localhost:3000")

        # Take a screenshot of the home page
        page.screenshot(path="verification/homepage.png")

        # Navigate to sign in (although functionality might be limited without auth mock)
        # Just to check visual integrity
        page.goto("http://localhost:3000/signin")
        page.screenshot(path="verification/signin.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
