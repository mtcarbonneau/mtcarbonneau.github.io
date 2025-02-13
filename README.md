# Madeleine's Coding Website 

A web application that displays projects for BST 236: Computing I.

## Project Structure

```
mcarbonneau_website/
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── arxiv.js
├── pages/
│   ├── arxiv.html
│   ├── projects.html
│   └── contact.html
└── index.html
```

## Features

- Clean, responsive design
- Navigation menu for easy access to different sections
- arXiv integration for searching scientific papers
- Pagination support for paper results

## Getting Started

### Option 1: Visit Website (Recommended)
Simply visit: https://mtcarbonneau.github.io/
- No installation required
- Always up to date
- Access from any device with a web browser

### Option 2: Static Files
1. Clone the repository
2. Open `index.html` in a web browser
3. Navigate through the site using the menu
   Note: arXiv paper data will not load without using Option 3

### Option 3: Local Server
1. Clone the repository
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the local server:
   ```bash
   python server.py
   ```
4. Open your browser to: http://localhost:8000
5. Navigate through the site using the menu

Note: Options 2 and 3 are mainly for development purposes. For regular use, Option 1 is recommended.

## arXiv Search Tool

How to access the arXiv search tool:
Navigate from home page: Home → Projects → arXiv Papers

Features:
- View latest papers in spatial transcriptomics
- Navigate through paginated results
- Access paper details and direct links to arXiv
- Direct PDF downloads available
- Automated daily updates via GitHub Actions at midnight UTC

Note: The server must be running to view paper data. Papers are automatically fetched and updated every night at midnight UTC through GitHub Actions workflow.

## Pac-Man Game

The website also includes a Pac-Man game for entertainment. To play the game:
1. Navigate to the `projects.html` page
2. Click on the Pac-Man game link
3. Enjoy playing Pac-Man directly in your browser

## AI Development Case Study

This project was developed with the assistance of various AI tools. Here's how each component was created:

### Tools Used
- GitHub Copilot
- GitHub Editor
- ChatGPT
- Copy Coder
- Anthropic Claude

### Project Development Process

1. Website Setup (Problem 1)
   - Used GitHub Copilot for initial HTML/CSS structure
   - Prompt example: "Create a responsive navigation menu with hover effects"
   - Iteratively refined design using Copy Coder suggestions: Implement local versions for faster testing
   - Adjusted prompts based on visual feedback
   - Using "Make __ prettier" to improve visual appearance

2. Pac-Man Game (Problem 2)
   - Started with basic game logic prompts to GitHub Copilot
   - Example prompt: "Create Pac-Man movement controls with arrow keys"
   - Refined collision detection with ChatGPT assistance
   - Iteratively improved game mechanics based on testing
   - Referencing files is helpful to avoid creating unnecessary new files

3. arXiv Integration (Problem 3)
   - Used Claude for API integration guidance
   - Example prompt: "How to fetch papers from arXiv API and display in table"
   - GitHub Copilot for JavaScript table pagination
   - ChatGPT for GitHub Actions automation setup
   - Refined error handling based on AI suggestions

### Prompt Engineering Insights
- Start with broad requirements, then narrow down
- Include specific technical details in follow-up prompts
- Use AI suggestions as starting points, not final solutions
- Iterate based on testing and user feedback
- Combine multiple AI tools for different aspects of development

## Development

To modify the website:
1. Edit HTML files in the root and pages directory
2. Modify styles in `assets/css/styles.css`
3. Update JavaScript functionality in `assets/js/arxiv.js`

## License

Copyright © 2024 Madeleine Carbonneau. All rights reserved.
