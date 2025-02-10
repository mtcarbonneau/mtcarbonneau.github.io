let currentPage = 1;
const resultsPerPage = 5;
let allPapers = [];

async function loadPapers() {
    const tableBody = document.getElementById('resultsBody');
    tableBody.innerHTML = '<tr><td colspan="4">Loading papers...</td></tr>';

    try {
        // Fix: Update path to be relative to the HTML file
        const response = await fetch('../data/papers_data.json');
        console.log('Attempting to fetch from:', response.url); // Debug log
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded data:', data); // Debug log
        
        if (!data.length) {
            tableBody.innerHTML = '<tr><td colspan="4">No papers found</td></tr>';
            return;
        }

        allPapers = data;
        displayPage(1);
        
    } catch (error) {
        console.error('Detailed error:', error);
        tableBody.innerHTML = `<tr><td colspan="4">Error loading papers: ${error.message}</td></tr>`;
    }
}

function displayPage(pageNum) {
    const tableBody = document.getElementById('resultsBody');
    const startIndex = (pageNum - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageResults = allPapers.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    pageResults.forEach(paper => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paper.title}</td>
            <td>${paper.authors}</td>
            <td>${new Date(paper.published).toLocaleDateString()}</td>
            <td>
                <a href="${paper.pdf_link}" target="_blank" class="button">PDF</a>
                <a href="${paper.link}" target="_blank" class="button">Abstract</a>
            </td>
        `;
        tableBody.appendChild(row);
    });

    currentPage = pageNum;
    document.getElementById('pageInfo').textContent = 
        `Page ${pageNum} of ${Math.ceil(allPapers.length / resultsPerPage)}`;
}

function changePage(delta) {
    const maxPages = Math.ceil(allPapers.length / resultsPerPage);
    const newPage = currentPage + delta;
    
    if (newPage >= 1 && newPage <= maxPages) {
        displayPage(newPage);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadPapers);
