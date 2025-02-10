import feedparser
import json
import os
from datetime import datetime
from urllib.parse import quote

def fetch_papers():
    try:
        base_url = 'http://export.arxiv.org/api/query?'
        query = quote('(cat:q-bio.GN OR cat:q-bio.QM) AND (ti:"spatial transcriptomics" OR abs:"spatial genomics")')
        params = f'search_query={query}&start=0&max_results=30&sortBy=submittedDate&sortOrder=descending'
        
        feed = feedparser.parse(base_url + params)
        if not feed.entries:
            raise RuntimeError("No papers found in feed")

        papers = []
        for entry in feed.entries:
            paper = {
                'title': entry.title.replace('\n', ' '),
                'authors': [author.name for author in entry.authors],
                'published': entry.published,
                'link': entry.id,
                'pdf_link': next(link.href for link in entry.links if link.type == 'application/pdf')
            }
            papers.append(paper)

        # Ensure data directory exists
        os.makedirs('data', exist_ok=True)
        
        # Save to JSON file
        with open('data/papers_data.json', 'w', encoding='utf-8') as f:
            json.dump(papers, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully saved {len(papers)} papers")

    except Exception as e:
        print(f"Error fetching papers: {str(e)}")
        raise

if __name__ == '__main__':
    fetch_papers()
