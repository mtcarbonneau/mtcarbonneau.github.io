let currentPage = 1;
const resultsPerPage = 5;
let allPapers = [];

async function searchArxiv() {
    const tableBody = document.getElementById('resultsBody');
    tableBody.innerHTML = '<tr><td colspan="4">Loading papers...</td></tr>';

    try {
        // Direct arXiv API query
        const base_url = 'https://export.arxiv.org/api/query?';
        const query = encodeURIComponent(
            `(cat:q-bio.GN OR cat:q-bio.QM) AND ` +
            `(ti:"spatial transcriptomics" OR abs:"spatial genomics")`
        );
        
        const params = `search_query=${query}&start=0&max_results=30&sortBy=submittedDate&sortOrder=descending`;
        const response = await fetch(base_url + params);
        const xmlText = await response.text();
        
        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const entries = xmlDoc.getElementsByTagName('entry');
        
        if (!entries.length) {
            tableBody.innerHTML = '<tr><td colspan="4">No papers found</td></tr>';
            return;
        }

        // Store and display papers
        allPapers = Array.from(entries).map(entry => ({
            title: entry.getElementsByTagName('title')[0].textContent,
            authors: Array.from(entry.getElementsByTagName('author'))
                .map(author => author.getElementsByTagName('name')[0].textContent)
                .join(', '),
            published: new Date(entry.getElementsByTagName('published')[0].textContent)
                .toLocaleDateString(),
            link: entry.getElementsByTagName('id')[0].textContent,
            pdf_link: entry.getElementsByTagName('link')[1].getAttribute('href')
        }));

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
    
    if (pageResults.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No papers to display</td></tr>';
        return;
    }
    
    pageResults.forEach(paper => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paper.title}</td>
            <td>${paper.authors}</td>
            <td>${paper.published}</td>
            <td>
                <a href="${paper.pdf_link}" target="_blank" class="button">PDF</a>
                <a href="${paper.link}" target="_blank" class="button">Abstract</a>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('pageInfo').textContent = 
        `Page ${pageNum} of ${Math.ceil(allPapers.length / resultsPerPage)}`;
}

function changePage(delta) {
    const maxPages = Math.ceil(allPapers.length / resultsPerPage);
    const newPage = currentPage + delta;
    
    if (newPage >= 1 && newPage <= maxPages) {
        currentPage = newPage;
        displayPage(currentPage);
    }
}

// Initialize with direct arXiv query
document.addEventListener('DOMContentLoaded', searchArxiv);

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
    if (tabName === 'latest') {
        searchArxiv('submittedDate');
    } else if (tabName === 'cited') {
        searchArxiv('citations');
    } else if (tabName === 'related') {
        searchArxiv('relevance');
    }
}
