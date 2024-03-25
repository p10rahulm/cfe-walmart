function fetchNewsListUnsorted() {
    return fetch('content/news/news_list.txt')
        .then(response => response.text())
        .then(text => text.split('\n').filter(line => line.trim().length > 0));
}

function fetchNewsList() {
    return fetch('content/news/news_list.txt')
        .then(response => response.text())
        .then(text => {
            const paths = text.split('\n').filter(line => line.trim().length > 0);
            return paths.sort((a, b) => {
                const aFileName = a.split('/').pop();
                const bFileName = b.split('/').pop();
                return bFileName.localeCompare(aFileName);
            });
        });
}

function fetchNewsContent(path) {
    return fetch(path).then(response => response.text());
}

function parseNewsContent(content) {
    const metadata = content.split('+++')[1].trim();
    const details = content.split('+++')[2].trim();
    const title = metadata.match(/title = "(.*?)"/)[1];
    const person = metadata.match(/person = "(.*?)"/)[1];
    const person_link = metadata.match(/person_link = "(.*?)"/)[1];
    const news_link = metadata.match(/news_link = "(.*?)"/)[1];
    const person_image = metadata.match(/person_image = "(.*?)"/)[1];
    const date = metadata.match(/date = "(.*?)"/)[1];
    const notes = metadata.match(/notes = "(.*?)"/)[1];



    return {title, person, person_link, news_link, person_image, date, notes, details};
}




function createNewsHtml(newsData, fileName, fileNumber) {
    // Check if abstract is empty, else create the abstract div
    let detailsHtml = '';
    if (newsData.details && newsData.details.trim() !== '') {

        if (newsData.notes && newsData.notes.trim() !== '') {
            detailsHtml = `
                        <div class="paper-details-holder">
                            <div class="paper-abstract-short" onclick="seeMoreAbstract(this)">
                                <b>Details:</b> 
                                ${newsData.details}
                                <br><br>
                                <b>Notes:</b> 
                                ${newsData.notes}
                            </div>
                        </div>
                        `;
        } else {

            detailsHtml = `
                        <div class="paper-details-holder">
                            <div class="paper-abstract-short" onclick="seeMoreAbstract(this)">
                                <b>Details:</b> 
                                ${newsData.details}                                
                            </div>
                        </div>
                        `;
        }

    }


    return `
            <div class="news-card">
                <div class="card-image-holder">
                    <a class="card-image-link-href" href="${newsData.person_link}" target="_blank">
                        <img class="card-image" src="${newsData.person_image}" alt="${newsData.person}">
                    </a>
                </div>
                <div class="card-content">
                    <div class="card-title">
                        <a class="card-link-href" href="${newsData.news_link}" target="_blank">
                            ${newsData.title} 
                        </a>
                    </div>
                    <div class="card-description">
                        ${detailsHtml}
                    </div>

                    <div class="card-link-details">
                        For more details, please see 
                        <a class="card-link-details-href"
                           href="${newsData.news_link}"
                           target="_blank">
                            this link
                        </a>
                        
                    </div>
                </div>
            </div>
        `;
}


let currentNewsIndex = 0;
const newsPerPage = 20; // Number of papers per page

function loadNewsList(newsList, startIndex) {
    const endIndex = startIndex + newsPerPage;
    for (let i = startIndex; i < endIndex && i < newsList.length; i++) {
        const [fileNumber, filePath] = newsList[i].split(' | ');
        const fileName = filePath.split('/').pop().replace('.md', '');
        fetchNewsContent(filePath)
            .then(content => parseNewsContent(content))
            .then(newsData => {
                const newsHtml = createNewsHtml(newsData, fileName, fileNumber);
                document.getElementById('news-container').innerHTML += newsHtml;
            });
    }
}

function updateNewsContent() {
    fetchNewsList().then(newsList => {
        loadNewsList(newsList, currentNewsIndex);
        currentNewsIndex += newsPerPage;
        if (currentNewsIndex >= newsList.length) {
            // Hide the Load More button if there are no more papers to load
            document.getElementById('load-more').style.display = 'none';
        }
    });
}

function loadMoreNews() {
    fetchNewsList().then(newsList => {
        loadNewsList(newsList, currentNewsIndex);
        currentNewsIndex += newsPerPage;
        if (currentNewsIndex >= newsList.length) {
            // Hide the Load More button if there are no more papers to load
            document.getElementById('load-more').style.display = 'none';
        }
    });
}

