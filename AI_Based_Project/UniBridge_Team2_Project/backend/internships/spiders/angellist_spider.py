import scrapy
from internships.items import InternshipsItem

class AngellistSpider(scrapy.Spider):
    name = "angellist"
    allowed_domains = ["angel.co"]

    def __init__(self, domain="", location="", keywords="", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.domain = domain
        self.location = location
        self.keywords = keywords

    def start_requests(self):
        base = "https://angel.co/jobs"
        params = {
            "query": f"{self.domain} {self.keywords}".strip(),
            "location": self.location
        }
        query = "&".join(f"{k}={v.replace(' ', '%20')}" for k, v in params.items() if v)
        url = f"{base}?{query}"

        yield scrapy.Request(url=url, callback=self.parse_list)

    def parse_list(self, response):
        job_cards = response.css("div.job-listing")

        for card in job_cards:
            item = InternshipsItem()
            item["title"] = card.css("a.job-link::text").get()
            item["company"] = card.css("div.company-name::text").get()
            item["location"] = card.css("div.location::text").get()
            item["link"] = card.css("a.job-link::attr(href)").get()
            item["source"] = "angellist"
            yield item
