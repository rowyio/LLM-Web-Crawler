import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Clipboard } from "lucide-react";
import JSONPretty from "react-json-pretty";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

const formSchema = z
  .object({
    url: z.string().url(),
    selector: z.string().optional(),
    mode: z.string({ message: "Please select a scrape mode" }),
    maxConcurrency: z.coerce.number().optional(),
    maxRequestsPerCrawl: z.coerce.number().optional(),
    proxyUrls: z.array(z.string()).optional(),
    crawlId: z.string().optional(),
    llmExtractionFields: z.string().optional(),
    llmExtractionMode: z.enum(["html", "text"]).default("html"),
  })
  .refine(
    (data) => {
      if (
        data.mode === "llmExtraction" &&
        data.llmExtractionFields === undefined
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "LLM Extraction Fields are required when LLM Extraction mode is selected.",
      path: ["llmExtractionFields"],
    }
  )
  .refine(
    (data) => {
      if (
        data.mode === "llmExtraction" &&
        data.llmExtractionMode === undefined
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "LLM Extraction Mode is required when LLM Extraction mode is selected.",
      path: ["llmExtractionMode"],
    }
  );

type ScrapeOption = {
  value: string;
  label: string | React.ReactNode;
  description: string;
  image: string;
  docsUrl?: string;
  remixUrl?: string;
};

const scrapeOptions: ScrapeOption[] = [
  {
    value: "llmExtraction",
    label: (
      <div className="flex">
        <h3 className="font-semibold">LLM Extraction</h3>
        <div>
          <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 text-xs leading-none text-secondary no-underline group-hover:no-underline">
            New
          </span>
        </div>
      </div>
    ),
    description: "Easily extract structured data from any web page using GPT.",
    image: "llmExtractor.png",
    remixUrl: "https://buildship.app/remix?template=openai-extract-hackernews",
  },
  {
    value: "crawl",
    label: "Crawl",
    description:
      "Crawl a given web url and return the text content. Works great for sites that have multiple pages to scrape.",
    image: "crawler.png",
    docsUrl: "https://docs.buildship.com/utility-nodes/crawler",
    remixUrl: "https://buildship.app/remix?template=gpt-crawler",
  },
  {
    value: "static",
    label: "Static",
    description:
      "Scrape a given web url and return the text content. Works great for less dynamic sites that don't rely on javascript to load.",
    image: "static.png",
    docsUrl: "https://docs.buildship.com/utility-nodes/scrape-web-url",
    remixUrl: "https://buildship.app/remix?template=scrape-static-site",
  },
  {
    value: "dynamic",
    label: "Dynamic",
    description:
      "Scrape a given web url and return the text content. Works great for more complex sites that rely on javascript to load.",
    image: "dynamic.png",
    docsUrl: "https://docs.buildship.com/utility-nodes/scrape-web-url-dynamic",
    remixUrl: "https://buildship.app/remix?template=scrape-dynamic-site",
  },
];

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [content, setContent] = useState<string>("");
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = import.meta.env.VITE_BUILDSHIP_WORKFLOW;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        let content = "";
        if (form.getValues().mode === "dynamic") {
          content = await response.text();
        } else {
          const data = await response.json();
          if (
            form.getValues().mode === "crawl" ||
            form.getValues().mode === "llmExtraction"
          ) {
            content = JSON.stringify(data, null, 2); // Render content as JSON for crawl mode
            setAccordionOpen(false);
          } else {
            content = data.content;
          }
        }
        setContent(content);
      } else {
        // Handle error response
        console.error("Failed to post form values");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred while posting form values", error);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const mode = form.getValues().mode;
    setContent("");
    if (mode !== "crawl") {
      form.reset({
        url: form.getValues().url,
        selector: form.getValues().selector,
        mode: mode,
      });
    }
  }, [form.watch("mode")]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="px-4 pb-8 pt-4 space-y-14 max-w-7xl mx-auto">
        <header className="border-b pb-2 flex justify-between items-center">
          <div className="flex items-center">
            <img src="logo.webp" alt="" width={35} />
            <h2 className="text-lg">BuildShip Scrape Playground</h2>
          </div>
          <ModeToggle />
        </header>
        <div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                autoComplete="off"
              >
                <div className="md:grid md:grid-cols-2 md:gap-10 block">
                  <div className="space-y-3">
                    <div>
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://buildship.com"
                              />
                            </FormControl>
                            <FormDescription>
                              The url to scrape or crawl.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <Accordion
                        type="single"
                        collapsible
                        value={accordionOpen ? "item-1" : ""}
                      >
                        <AccordionItem value="item-1">
                          <AccordionTrigger
                            onClick={() => setAccordionOpen(!accordionOpen)}
                          >
                            Options
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <FormField
                                control={form.control}
                                name="selector"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Selector</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="body, .content, #main, etc."
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Optional html selector to scrape.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {form.getValues().mode === "crawl" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <FormField
                                    control={form.control}
                                    name="maxConcurrency"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Max Concurrency</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Number of crawls to run in parallel
                                          (max limit: 20
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="maxRequestsPerCrawl"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Max Requests per Crawl
                                        </FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Max requests to be executed per crawl
                                          (max limit: 50).
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="proxyUrls"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Proxy URLs</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          List of proxy urls to be used
                                          automatically by crawler for all
                                          connections.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="crawlId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Crawl ID</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Use crawlId returned from previous
                                          crawling to continue crawling
                                          remaining urls.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}

                              {form.getValues().mode === "llmExtraction" && (
                                <div className="space-y-3">
                                  <FormField
                                    control={form.control}
                                    name="llmExtractionFields"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Extraction Fields</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="title,price,url,description"
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Comma-separated list of fields to
                                          extract using LLM.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="llmExtractionMode"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Extraction Mode</FormLabel>
                                        <FormControl>
                                          <Select
                                            {...field}
                                            defaultValue="html"
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="html">
                                                HTML
                                              </SelectItem>
                                              <SelectItem value="text">
                                                Text
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormDescription>
                                          Select the LLM extraction mode: HTML,
                                          which preserves web page semantics, or
                                          Text, which provides a concise context
                                          without URLs, images, etc.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {content && (
                      <div>
                        <div className="rounded p-4 relative bg-secondary mt-10">
                          <div className="bg-primary-foreground rounded p-4 max-h-96 overflow-y-auto">
                            <Button
                              type="button"
                              className="absolute top-2 right-2"
                              size="sm"
                              variant="secondary"
                              onClick={copyToClipboard}
                            >
                              {copied ? (
                                <Check size={16} />
                              ) : (
                                <Clipboard size={16} />
                              )}
                            </Button>
                            {form.getValues().mode === "crawl" ||
                            (form.getValues().mode == "llmExtraction" &&
                              content !== "") ? (
                              isValidJSON(content) ? (
                                <JSONPretty
                                  data={JSON.parse(content)}
                                  style={{ fontSize: ".9em" }}
                                />
                              ) : (
                                <div>{content}</div>
                              )
                            ) : (
                              <div>{content}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BuildShip Node (Scrape Mode)</FormLabel>
                          <div className="space-2-4">
                            {scrapeOptions.map((option) => (
                              <label
                                key={option.value}
                                className={`block space-y-1 md:flex md:items-center md:space-x-4 cursor-pointer  rounded p-4 ${
                                  field.value === option.value
                                    ? "bg-secondary"
                                    : "bg-transparent"
                                }`}
                              >
                                <input
                                  type="radio"
                                  {...field}
                                  value={option.value}
                                  className="hidden"
                                />
                                <img
                                  src={option.image}
                                  alt={option.value}
                                  className="w-52 rounded"
                                />
                                <div>
                                  {typeof option.label === "string" ? (
                                    <h3 className="font-semibold">
                                      {option.label}
                                    </h3>
                                  ) : (
                                    <>{option.label}</>
                                  )}

                                  <p className="text-sm">
                                    {option.description}
                                  </p>
                                  <div className="space-x-2">
                                    {option.docsUrl && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 text-xs"
                                        asChild
                                      >
                                        <a
                                          href={option.docsUrl}
                                          target="_blank"
                                        >
                                          Docs
                                          <ArrowUpRight className="ml-1 h-4 w-4" />
                                        </a>
                                      </Button>
                                    )}
                                    {option.remixUrl && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 text-xs"
                                        title="Clone template in BuildShip"
                                        asChild
                                      >
                                        <a
                                          href={option.remixUrl}
                                          target="_blank"
                                        >
                                          Remix
                                          <ArrowUpRight className="ml-1 h-4 w-4" />
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="sticky bottom-0 bg-background py-3 z-10">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full"
                      >
                        {form.formState.isSubmitting
                          ? form.getValues().mode === "crawl"
                            ? "Crawling..."
                            : form.getValues().mode === "llmExtraction"
                            ? "Extracting..."
                            : "Scraping..."
                          : form.getValues().mode === "crawl"
                          ? "Crawl"
                          : form.getValues().mode === "llmExtraction"
                          ? "Extract"
                          : "Scrape"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
