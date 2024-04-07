

function fetchPeopleList() {
    return fetch('content/people/people_list.txt')
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

function fetchPeopleContent(path) {
    return fetch(path).then(response => response.text());
}

function parsePeopleContent(content) {
    const metadata = content.split('+++')[1].trim();
    const details = content.split('+++')[2].trim();
    const name = metadata.match(/name = "(.*?)"/)[1];
    const person_role = metadata.match(/person_role = "(.*?)"/)[1];
    const person_designation = metadata.match(/person_designation = "(.*?)"/)[1];
    const person_link = metadata.match(/person_link = "(.*?)"/)[1];
    const person_photofile = metadata.match(/person_photofile = "(.*?)"/)[1];
    const notes = metadata.match(/notes = "(.*?)"/)[1];




    return {name, person_role, person_designation, person_link, person_photofile, notes, details};
}




function createPersonHtml(inputData, fileName, fileNumber) {
    // Check if abstract is empty, else create the abstract div
    let detailsHtml = '';
    if (inputData.details && inputData.details.trim() !== '') {

        if (inputData.notes && inputData.notes.trim() !== '') {
            detailsHtml = `
                        <div class="card-description-holder">
                            <div class="card-description-short" onclick="seeMoreAbstract(this)">
                                <b>Details:</b> 
                                ${inputData.details}
                                <br><br>
                                <b>Notes:</b> 
                                ${inputData.notes}
                            </div>
                        </div>
                        `;
        } else {

            detailsHtml = `
                        <div class="card-description-short" onclick="seeMoreAbstract(this)">
                                <b>Bio:</b> 
                                ${inputData.details}                                
                        </div>
                        `;
        }

    }

    if (inputData.person_role=== "professor"){
        designationHTML = ``;
    } else {
        designationHTML = `<div class="card-person-designation">
                                <a class="card-person-href" href="${inputData.person_link}" target="_blank">
                                    ${inputData.person_designation} 
                                </a>
                            </div>
                          `;
    }


    return `
            <div class="person-card" id="${fileNumber}_${fileName}">
                <div class="card-image-holder">
                    <a class="card-image-link-href" href="${inputData.person_link}" target="_blank">
                        <img class="card-image" src="${inputData.person_photofile}" alt="${inputData.person}">
                    </a>
                </div>
                <div class="card-content">
                    <div class="card-title">
                        <a class="card-link-href" href="${inputData.person_link}" target="_blank">
                            ${inputData.name} 
                        </a>
                    </div>
                    ${designationHTML}
                    <div class="card-description" id="card_description_${fileNumber}">
                        ${detailsHtml}
                    </div>
                </div>
            </div>
        `;
}


let currentCardIndex = 0;
const cardsPerPage = 50;

function loadPeopleList(inputList, startIndex) {
    const endIndex = startIndex + cardsPerPage;
    for (let i = startIndex; i < endIndex && i < inputList.length; i++) {
        const [fileNumber, filePath] = inputList[i].split(' | ');
        const fileName = filePath.split('/').pop().replace('.md', '');
        fetchPeopleContent(filePath)
            .then(content => parsePeopleContent(content))
            .then(inputData => {
                const personHtml = createPersonHtml(inputData, fileName, fileNumber);
                // document.getElementById('pi-container').innerHTML += personHtml;
                insertContentInOrder(personHtml, fileNumber);
                const div_to_set_seemore =  document.getElementById('card_description_'+fileNumber.toString())
                setAbstractsforDiv(div_to_set_seemore);
            });
    }
}


function insertContentInOrder(elementInnerHtml, fileNumber, containerID = 'pi-container') {
    const elements_container = document.getElementById(containerID);
    let inserted = false;
    // Convert fileNumber to a number for comparison
    const order = parseInt(fileNumber, 10);

    // Create div for this node.
    const tempHTMLNode = document.createElement('div');
    tempHTMLNode.innerHTML = elementInnerHtml;
    var elementHTMLNode = tempHTMLNode.children[0];

    // Find the right place to insert the new content
    const children = elements_container.children;
    for (let i = 0; i < children.length; i++) {
        const childOrder = parseInt(children[i].id.split('_')[0], 10);
        // console.log("childOrder=",childOrder)
        // console.log("order=",order)
        if (order < childOrder) {
            elements_container.insertBefore(elementHTMLNode, children[i]);
            inserted = true;
            break;
        }
    }

    // If not inserted yet, append at the end
    if (!inserted) {
        elements_container.appendChild(elementHTMLNode);
    }
}


function updatePeopleContent() {
    fetchPeopleList().then(inputList => {
        loadPeopleList(inputList, currentCardIndex);
    });
}

function loadMorePeople() {
    fetchPeopleList().then(inputList => {
        loadPeopleList(inputList, currentCardIndex);
        currentCardIndex += cardsPerPage;
        if (currentCardIndex >= inputList.length) {
            // Hide the Load More button if there are no more papers to load
            document.getElementById('load-more').style.display = 'none';
        }
    });
}

function setAbstractsforDiv(abstractdiv) {
    const newdiv = document.createElement("div");
    newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
    newdiv.className = "card-description-seemore"
    newdiv.setAttribute("onClick", "seeMoreDescription(this.parentElement.getElementsByClassName('card-description-short')[0])");

    abstractdiv.appendChild(newdiv);
}

function seeMoreDescription(element) {
    if (element.classList.contains("card-description-short")) {
        element.classList.remove("card-description-short");
        element.classList.add("card-description-extended");


        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See Less<i class=\"arrow up\"></i>";
        newdiv.className = "card-description-seeless";
        newdiv.setAttribute("onClick", "seeLessDescription(this.parentElement.getElementsByClassName('card-description-extended')[0])");
        // newdiv.onclick = "seeLessAbstract(newdiv)";
        element.parentElement.appendChild(newdiv);

        seemore = element.parentElement.getElementsByClassName("card-description-seemore")[0];
        seemore.parentElement.removeChild(seemore);


    }
}

function seeLessDescription(element) {
    console.log("element",element)
    if (element.classList.contains("card-description-extended")) {
        element.classList.remove("card-description-extended");
        element.classList.add("card-description-short");


        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
        newdiv.className = "card-description-seemore"
        newdiv.setAttribute("onClick", "seeMoreDescription(this.parentElement.getElementsByClassName('card-description-short')[0])");
        element.parentElement.appendChild(newdiv);

        seeless = element.parentElement.getElementsByClassName("card-description-seeless")[0];
        seeless.parentElement.removeChild(seeless);
    }

}
