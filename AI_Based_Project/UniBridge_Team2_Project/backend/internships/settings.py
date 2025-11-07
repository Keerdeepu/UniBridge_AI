# settings.py
BOT_NAME = 'internships'

SPIDER_MODULES = ['internships.spiders']
NEWSPIDER_MODULE = 'internships.spiders'

ROBOTSTXT_OBEY = False
LOG_ENABLED = True  # keep logs for debugging

# ✅ Use scrapy-playwright's DownloadHandler instead of wrong middleware
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}

TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"

# Playwright config
PLAYWRIGHT_BROWSER_TYPE = "chromium"
PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT = 60000
