let currentPage = 1;
const resultsPerPage = 5;
let allPapers = [];

async function loadPapers() {
    const tableBody = document.getElementById('resultsBody');
    tableBody.innerHTML = '<tr><td colspan="4">Loading papers...</td></tr>';

    try {
        const response = await fetch('/data/papers_data.json');
        if (!response.ok) throw new Error('Failed to load papers data');
        
        const data = await response.json();
        if (!data.length) {
            tableBody.innerHTML = '<tr><td colspan="4">No papers found</td></tr>';
            return;
        }

        allPapers = data;
        displayPage(1);
        
    } catch (error) {
        console.error('Error:', error);
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

function displayResults(papers) {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = ''; // Clear existing results

    papers.forEach(paper => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paper.title}</td>
            <td>${paper.authors}</td>
            <td>${new Date(paper.published).toLocaleDateString()}</td>
            <td>
                <a href="${paper.pdf_link}" target="_blank">PDF</a>
                <a href="${paper.link}" target="_blank">Abstract</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Load content for the selected tab
    loadPapers();
}
