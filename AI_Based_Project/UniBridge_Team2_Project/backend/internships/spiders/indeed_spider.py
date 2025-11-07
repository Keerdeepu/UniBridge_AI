import scrapy
from internships.items import InternshipsItem

class IndeedSpider(scrapy.Spider):
    name = "indeed"
    allowed_domains = ["indeed.com"]

    def __init__(self, domain="", location="", keywords="", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.domain = domain
        self.location = location
        self.keywords = keywords

    def start_requests(self):
        base = "https://www.indeed.com/jobs"
        params = {
            "q": f"{self.domain} {self.keywords}".strip(),
            "l": self.location
        }
        query = "&".join(f"{k}={v.replace(' ', '%20')}" for k, v in params.items() if v)
        url = f"{base}?{query}"
        
        yield scrapy.Request(url=url, callback=self.parse_list)

    def parse_list(self, response):
        job_cards = response.css("div.job_seen_beacon")
        
        for card in job_cards:
            item = InternshipsItem()
            item["title"] = card.css("h2.jobTitle span::text").get()
            item["company"] = card.css("span.companyName::text").get()
            item["location"] = card.css("div.companyLocation::text").get()
            item["link"] = card.css("a::attr(href)").get()
            item["source"] = "indeed"
            yield item
