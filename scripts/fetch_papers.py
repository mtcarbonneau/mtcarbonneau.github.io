"""Query arXiv for papers on spatial transcriptomics and save to JSON file."""

try:
    import feedparser
except ImportError as exc:
    raise ImportError(
        "Please install feedparser: pip install feedparser") from exc

import json
import os
import sys
from urllib.parse import quote


def fetch_papers():
    """
    Fetches the latest papers from the arXiv API based on specific query parameters.
    
    The function performs the following steps:
    1. Verifies that the 'feedparser' module is properly installed.
    2. Constructs a query URL for the arXiv API to search for papers related to
       "spatial transcriptomics" or "spatial genomics" in q-bio.GN or q-bio.QM.
    3. Parses the feed from the arXiv API.
    4. Processes the feed entries to extract title, authors, date, and links.
    5. Ensures that the 'data' directory exists.
    6. Saves the processed paper data to 'papers_data.json' in the 'data' directory.
    
    Raises:
        ImportError: If the 'feedparser' module is not properly installed.
        RuntimeError: If no papers are found in the feed.
        OSError: If there is an error with directory/file operations.
        feedparser.FeedParserError: If there is an error parsing the feed.
        
    Prints:
        Success message with paper count or error message if exception occurs.
    """
    try:
        # Verify feedparser is working
        if not hasattr(feedparser, "parse"):
            raise ImportError("feedparser not properly installed")

        base_url = "http://export.arxiv.org/api/query?"
        query = quote(
            '(cat:q-bio.GN OR cat:q-bio.QM) AND '
            '(ti:"spatial transcriptomics" OR '
            'abs:"spatial genomics")'
        )
        params = (
            f"search_query={query}&"
            f"start=0&"
            f"max_results=30&"
            f"sortBy=submittedDate&"
            f"sortOrder=descending"
        )

        feed = feedparser.parse(base_url + params)
        if not feed.entries:
            raise RuntimeError("No papers found in feed")

        papers = []
        for entry in feed.entries:
            paper = {
                "title": entry.title.replace(
                    "\n",
                    " "),
                "authors": [
                    author.name for author in entry.authors],
                "published": entry.published,
                "link": entry.id,
                "pdf_link": next(
                    link.href for link in entry.links if link.type == "application/pdf"),
            }
            papers.append(paper)

        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)

        # Save to JSON file
        with open("data/papers_data.json", "w", encoding="utf-8") as f:
            json.dump(papers, f, indent=2, ensure_ascii=False)

        print(f"Successfully saved {len(papers)} papers")

    except (RuntimeError, OSError) as e:
        print(f"Error fetching papers: {str(e)}")
        raise


if __name__ == "__main__":
    try:
        fetch_papers()
    except ImportError as imprterror:
        print(f"Import Error: {imprterror}")
        print("Please run: pip install -r requirements.txt")
        sys.exit(1)
    except (RuntimeError, OSError) as runtmerror:
        print(f"Error: {runtmerror}")
        sys.exit(1)
