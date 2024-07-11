# Web Crawler for LLM Apps

Flexible and Scalable low-code Web Crawler. Give it a try on the LIVE playground: https://llm-web-crawler.vercel.app/  
  
Uses [BuildShip](https://buildship.com/?ref=llm-github) - a visual AI workflow builder to extract and gather data from your websites or sources. This data can then be used as a knowledge base to power your own LLM apps 🤖, or paired with BuildShip's [AI Assistant](https://docs.buildship.com/ai-assistant/assistant) to unlock powerful use cases and enhance your business or services.

## Video Tutorial

<a href="https://www.youtube.com/watch?v=OJZzwcgjKW8" target="_blank">  
<img width="600" alt="yotube" src="https://github.com/rowyio/LLM-Web-Crawler/assets/307298/8c2309ee-c753-4a57-b42c-eba2f0bbc809"/>
</a>

## Features

| Node           | Info                                                                                                                                                                                                                                                                                                                | Documentation                                                                | Template                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Scrape         | Easy to get started with, scrape a given web URL and return the text content. Works great for less complex sites that don't rely on JavaScript to load.                                                                                                                                                             | [Read more](https://docs.buildship.com/utility-nodes/scrape-web-url)         | [Remix](https://buildship.app/remix?template=scrape-static-site)        |
| Dynamic Scrape | Scrape a given web URL and return the text content. This method works well for more complex sites and allows for more interactive scraping by providing a set of steps to execute after loading the page. For example, loading an ecommerce site, searching for an item, and then scraping the search results info. | [Read more](https://docs.buildship.com/utility-nodes/scrape-web-url-dynamic) | [Remix](https://buildship.app/remix?template=scrape-dynamic-site)       |
| Web Crawler    | Extract data from an entire website by crawling through and scraping all its pages. Perfect for aggregating data to create your own custom GPTs or "Chat with Data" apps.                                                                                                                                           | [Read more](https://docs.buildship.com/utility-nodes/crawler)                | [Remix](https://buildship.app/remix?template=gpt-crawler)               |
| LLM Extraction | Extract structured data (just the data you care about) from any website. No need to scrape an entire webpage; simply specify the URL and the fields you want to extract. The LLM will handle the rest, delivering only the relevant data in a structured format.                                                    | [Read more](https://docs.buildship.com/utility-nodes/llm-extract)            | [Remix](https://buildship.app/remix?template=openai-extract-hackernews) |

## How to use

- First clone a template using most relevant to your using the following links.
[LLM Extractor](https://buildship.app/remix?template=openai-extract-hackernews)  
[Crawler](https://buildship.app/remix?template=gpt-crawler)  
[Static Web Scraping](https://buildship.app/remix?template=scrape-static-site)  
[Dynamic Web Scraping](https://buildship.app/remix?template=scrape-dynamic-site)  

- Run or customize the template as per your usecase
- Click Ship to deploy as an API or scheduled job

Read full [documentation](https://docs.buildship.com/utility-nodes/llm-extract) to learn more
