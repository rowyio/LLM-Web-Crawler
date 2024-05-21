# Web Crawler for LLM Apps

## Overview

This playground features working demos for four of BuildShip's scrape nodes, making it easy to extract and gather data from your own websites or other sources. This data can then be used as a knowledge base to power your own LLM apps 🤖, or paired with BuildShip's AI Assistant to unlock powerful use cases and enhance your business or services.

| Node           | Info                                                                                                                                                                                                                                                                                                                | Documentation                                                                | Template                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Scrape         | Easy to get started with, scrape a given web URL and return the text content. Works great for less complex sites that don't rely on JavaScript to load.                                                                                                                                                             | [Read more](https://docs.buildship.com/utility-nodes/scrape-web-url)         | [Remix](https://buildship.app/remix?template=scrape-static-site)        |
| Dynamic Scrape | Scrape a given web URL and return the text content. This method works well for more complex sites and allows for more interactive scraping by providing a set of steps to execute after loading the page. For example, loading an ecommerce site, searching for an item, and then scraping the search results info. | [Read more](https://docs.buildship.com/utility-nodes/scrape-web-url-dynamic) | [Remix](https://buildship.app/remix?template=scrape-dynamic-site)       |
| Web Crawler    | Extract data from an entire website by crawling through and scraping all its pages. Perfect for aggregating data to create your own custom GPTs or "Chat with Data" apps.                                                                                                                                           | [Read more](https://docs.buildship.com/utility-nodes/crawler)                | [Remix](https://buildship.app/remix?template=gpt-crawler)               |
| LLM Extraction | Extract structured data (just the data you care about) from any website. No need to scrape an entire webpage; simply specify the URL and the fields you want to extract. The LLM will handle the rest, delivering only the relevant data in a structured format.                                                    | Coming soon                                                                  | [Remix](https://buildship.app/remix?template=openai-extract-hackernews) |

## Installation

```sh
$ npm install
```

## Running the app

```sh
$ npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app running.
