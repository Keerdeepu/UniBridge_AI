import scrapy
from urllib.parse import urlencode
from internships.items import InternshipsItem

class InternshalaSpider(scrapy.Spider):
    name = "internshala"
    allowed_domains = ["internshala.com"]

    def __init__(self, domain="", location="", keywords="", remote_only="False", paid_only="False", recent_only="False", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.domain = domain
        self.location = location
        self.keywords = keywords
        self.remote_only = remote_only.lower() == "true"
        self.paid_only = paid_only.lower() == "true"
        self.recent_only = recent_only.lower() == "true"

    def start_requests(self):
        base = "https://internshala.com/internships"
        params = {}
        if self.domain:
            params["keyword"] = self.domain
        if self.keywords:
            params["keyword"] = f"{params.get('keyword', '')} {self.keywords}".strip()
        if self.location:
            params["location"] = self.location
        if self.remote_only:
            params["work_from_home"] = "1"
        if self.paid_only:
            params["stipend_type"] = "paid"
        if self.recent_only:
            params["recent"] = "1"

        url = base
        if params:
            url = f"{base}?{urlencode(params)}"

        yield scrapy.Request(
            url,
            callback=self.parse_list,
            meta={
                "playwright": True,
                "playwright_page_methods": [
                    {"method": "wait_for_selector", "selector": "div.individual_internship"}
                ],
            },
        )

    def parse_list(self, response):
        internships = response.css("div.individual_internship")
        for card in internships:
            item = InternshipsItem()

            # Title
            title = card.css("h3 a::text").get()
            item["title"] = title.strip() if title else None

            # Company
            company = card.css("div.internship_heading h4 a::text").get()
            if not company:
                # fallback if JS renders differently
                company = card.css("div.internship_heading h4::text").get()
            item["company"] = company.strip() if company else "Unknown"

            # Location
            location = card.css("a.location_link::text").get()
            item["location"] = location.strip() if location else self.location or "Remote"

            # Link
            rel = card.css("h3 a::attr(href)").get()
            if rel:
                item["link"] = response.urljoin(rel)
            else:
                item["link"] = response.url

            item["source"] = "internshala"

            yield item

        # Pagination
        next_page = response.css("a[rel='next']::attr(href)").get()
        if next_page:
            yield response.follow(
                next_page,
                callback=self.parse_list,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        {"method": "wait_for_selector", "selector": "div.individual_internship"}
                    ],
                },
            )
