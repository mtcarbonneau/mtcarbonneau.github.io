# Madeleine's Coding Website 

A web application that displays projects for BST 236: Computing I.
 
Repository that deploys website can be found at: https://github.com/mtcarbonneau/mtcarbonneau.github.io

Website can be found at https://mtcarbonneau.github.io/index.html

## Project Structure

```
mcarbonneau_website/
├── assets/
│   ├── css/
|   |   ├── pacman.js
│   │   └── styles.css
|   ├── images/
│   │   └── madeleine_profile.png
│   └── js/
│       ├── arxiv.js
│       ├── game.js
│       ├── main.js
│       └── navigation.js
├── data/
│   └── papers.json
├── scripts/
│   └── fetch_papers.py
├── pages/
|   ├── about.html
│   ├── arxiv.html
│   ├── projects.html
│   └── contact.html
├── server.py
├── AssignmentREADME.md
├── requirements.txt
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
- GitHub Copilot for code completion and pair programming
- GitHub Editor (Claude 3.5/GPT 4) for complex problem-solving
- ChatGPT for debugging and optimization suggestions

### Project Development Process

1. Website Setup (Problem 1)
   - Started with basic HTML structure via Copilot
   - Built progressively with focused prompts:
     ```
     1. "Create responsive navbar with these links: Home, Projects, Contact"
     2. "Add hover effects and mobile menu toggle"
     3. "Style main content area with flexbox layout"
     ```
   - Validated each component across browsers
   - Used AI suggestions for accessibility improvements
   - Key insight: Build foundational elements first

2. Pac-Man Game (Problem 2)
   - Implemented core mechanics step by step:
     ```
     1. "Initialize game board with walls and dots"
     2. "Add Pac-Man sprite with basic movement"
     3. "Create ghost pathfinding algorithm"
     4. "Implement scoring and win conditions"
     ```
   - Used ChatGPT for performance optimization
   - Copilot helped with collision detection logic
   - Key insight: Break complex features into smaller tasks

3. arXiv Integration (Problem 3)
   - Systematic API implementation:
     ```
     1. "Setup arXiv API connection with error handling"
     2. "Create paper display table with sorting"
     3. "Add pagination and search filters"
     ```
   - Used Claude for API best practices
   - Automated testing setup with AI guidance
   - Key insight: Always validate API responses

### Effective AI Prompting Strategies

1. Clear Context Setting
   - Share relevant code snippets
   - Specify environment details
   - Example: "Using Node.js 16, implement error handling for this API call"

2. Iterative Development
   - Start simple, add complexity
   - Test between iterations
   - Example sequence:
     ```
     Basic: "Create paper display function"
     Refine: "Add sorting by date"
     Optimize: "Cache results for performance"
     ```

3. Debugging Approach
   - Provide complete error messages
   - Include surrounding code context
   - Specify expected behavior

4. Best Practices
   - Review AI code thoroughly
   - Test edge cases
   - Document AI-assisted implementations
   - Regular security reviews

### Tool Selection Guide

- GitHub Copilot: Use for
  - Code completion
  - Standard patterns
  - Quick solutions

- Claude/GPT: Best for
  - Architecture decisions
  - Complex logic
  - Optimization advice

### Lessons Learned
- AI excels at boilerplate code
- Human review crucial
- Combine tools strategically
- Keep prompt history
- Test thoroughly

## Development

To modify the website:
1. Edit HTML files in the root and pages directory
2. Modify styles in `assets/css/styles.css`
3. Update JavaScript functionality in `assets/js/arxiv.js`

## License

Copyright © 2024 Madeleine Carbonneau. All rights reserved.
