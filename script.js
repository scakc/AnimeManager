// JavaScript for handling interactions and data management
// Function to save data to a file
let animeList = [];
window.animeList = animeList;
window.animePropertyList = ['name', 'episodesWatched', 'status', 'rating', 'link'];
window.visibleProperties = ['rating', 'episodesWatched'];
window.decimalProperties = {
  rating: 0.1,
  episodesWatched: 1,
};

function saveToFile(data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const fileName = 'animeData.json';
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to load data from a file
function loadFromFile() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      const data = JSON.parse(contents);
      window.animeList = data;
      window.animePropertyList = Object.keys(window.animeList[0]);
      localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
      console.log('Is localStorage empty?', isLocalStorageEmpty()); // Output: true or false
      console.log('Loaded data:', window.animeList);
      loadDataFromLocalStorage();
    };
    reader.readAsText(file);
  });
  fileInput.click();
}

function resetLocalStorage() {
  localStorage.clear();
  const emptyStatus = isLocalStorageEmpty();
  console.log('Is localStorage empty?', emptyStatus); // Output: true or false

  // refresh window
  window.location.reload();
}

// Function to check if localStorage is empty
function isLocalStorageEmpty() {
  return localStorage.length === 0;
}

// Save initial data to a file
// Sample data (initial data or data retrieved from localStorage)
// let animeList = [];
//     { name: 'Anime 1', episodesWatched: 5, status: 'long', rating: 4 },
//     { name: 'Anime 2', episodesWatched: 10, status: 'short', rating: 3 },
//     { name: 'Anime 3', episodesWatched: 3, status: 'inactive', rating: 2 },
//     { name: 'Anime 4', episodesWatched: 3, status: 'long', rating: 5 },
//   ];

// saveToFile(animeList); 

// Function to render anime list based on status
// function renderAnimeList(status) {
//   const filteredList = window.animeList.filter(anime => anime.status === status);
//   const listElement = document.getElementById(`${status}List`);
//   listElement.innerHTML = '';

//   filteredList.sort((a, b) => b.rating - a.rating); // Sort by rating

//   filteredList.forEach(anime => {
//     const listItem = document.createElement('li');
//     listItem.textContent = `${anime.name} - Episodes watched: ${anime.episodesWatched} - Rating: ${anime.rating}`;
//     listElement.appendChild(listItem);
//   });
// }

// Function to update episodes watched
function updateEpisodes(animeName, increment) {
  const anime = window.animeList.find(anime => anime.name === animeName);
  if (anime) {
    anime.episodesWatched += increment;
    localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
    renderAnimeList(anime.status);
  }
}

// Function to add a new anime
function addNewAnime() {
  const numAnimes = 1; //parseInt(prompt('Enter the number of animes you want to add:'));
  // console.log(numAnimes);
  for (let i = 0; i < numAnimes; i++) {
    const newAnime = {};

    const properties = window.animePropertyList;

    for (let j = 0; j < properties.length; j++) {
      const property = properties[j];

      if (property === 'status') {
        newAnime[property] = prompt(`Enter Section (long/short/inactive):`);
      }
      else {
        newAnime[property] = prompt(`Enter ${property}:`);
      }

    }

    window.animeList.push(newAnime);
  }

  localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage

  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
}

// Function to load animes
function loadData() {
  loadFromFile();
  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
  console.log('Started Rendering data');

  // Add a 1-second delay before refreshing the window
  setTimeout(() => {
    location.reload();
  }, 3000);
}

// Function to save animes
function saveData() {
  saveToFile(window.animeList);
  // Logic to add a new anime to animeList
  // Then update localStorage and re-render the lists
}

document.getElementById('addAnimeBtn').addEventListener('click', addNewAnime);
document.getElementById('loadDataBtn').addEventListener('click', loadData);
document.getElementById('saveDataBtn').addEventListener('click', saveData);
document.getElementById('resetLocal').addEventListener('click', resetLocalStorage);
// Event listener for add/del property button
document.getElementById('addPropBtn').addEventListener('click', addProperty);
document.getElementById('delPropBtn').addEventListener('click', delProperty);
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;
  loadDataFromLocalStorage();
  // window.animePropertyList = Object.keys(window.animeList[0]);

  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
});

// function to update localStorage
function updateLocalStorage() {
  // Update localStorage
  localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update animeList
  localStorage.setItem('propertyList', JSON.stringify(window.animePropertyList)); // Update propertyList
  localStorage.setItem('visibleProperties', JSON.stringify(window.visibleProperties)); // Update visibleProperties
  localStorage.setItem('decimalProperties', JSON.stringify(window.decimalProperties)); // Update decimalProperties
}

// function to load data from localStorage
function loadDataFromLocalStorage() {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;

  if (window.animeList.length === 0) {
    return;
  }

  window.animePropertyList = Object.keys(window.animeList[0]);
  const storedVisibleProperties = localStorage.getItem('visibleProperties');
  window.visibleProperties = storedVisibleProperties ? JSON.parse(storedVisibleProperties) : window.visibleProperties;
  const storedDecimalProperties = localStorage.getItem('decimalProperties');
  window.decimalProperties = storedDecimalProperties ? JSON.parse(storedDecimalProperties) : window.decimalProperties;
}

// Function to add a new property to animePropertyList
function addProperty() {
  // Add a new property to animePropertyList
  const newProperty = prompt('Enter new property:');
  const newPropertyType = prompt('Enter new property type:');

  if (newProperty === null || newProperty === '' || newProperty === undefined || window.animePropertyList.includes(newProperty)) {
    return;
  }

  window.animePropertyList.push(newProperty);

  if (newPropertyType === 'number') {
    // Add to decimal properties
    const newPropertyStep = prompt('Enter new property step:');
    window.decimalProperties[newProperty] = newPropertyStep;
  }

  // Add a new checkbox to dropdown content
  const dropdownContent = document.querySelector('.dropdown-content');
  const checkboxLabel = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('value', `${newProperty}`);
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(document.createTextNode(` ${newProperty}`));
  dropdownContent.appendChild(checkboxLabel);

  // Add the new property to each anime
  const animeList = window.animeList;
  for (let i = 0; i < animeList.length; i++) {
    animeList[i][newProperty] = null;
  }

  updateLocalStorage();
  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
}

// Function to delete a property from animePropertyList
function delProperty() {
  // Add a new property to animePropertyList
  const newProperty = prompt('Enter Del property:');

  if (newProperty === null || newProperty === '' || newProperty === undefined || !window.animePropertyList.includes(newProperty)) {
    return;
  }

  // Remove the property from animePropertyList
  const index = window.animePropertyList.indexOf(newProperty);
  if (index !== -1) {
    window.animePropertyList.splice(index, 1);
  }

  // Remove from visible properties and decimal properties
  const visiblePropertiesIndex = window.visibleProperties.indexOf(newProperty);
  if (visiblePropertiesIndex !== -1) {
    window.visibleProperties.splice(visiblePropertiesIndex, 1);
  }
  delete window.decimalProperties[newProperty];

  // Remove the property from each anime
  const animeList = window.animeList;
  for (let i = 0; i < animeList.length; i++) {
    delete animeList[i][newProperty];
  }

  // Update localStorage
  updateLocalStorage();
  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
}

// Function to render anime list based on status
function renderAnimeList(status) {

  loadDataFromLocalStorage();

  // Show visible properties
  const dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.innerHTML = ''

  if (window.animeList.length === 0) {
    return;
  }

  window.animePropertyList = Object.keys(window.animeList[0]);
  const properties = window.animePropertyList;
  const invisibleProeprties = ["status", "link", "name"];
  for (let i = 0; i < properties.length; i++) {

    if (invisibleProeprties.includes(properties[i])) {
      continue;
    }

    const checkboxLabel = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', `${properties[i]}`);
    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(document.createTextNode(` ${properties[i]}`));
    dropdownContent.appendChild(checkboxLabel);

    // set checkbox to true for elements in window.visibleProperties
    if (window.visibleProperties.includes(properties[i])) {
      checkbox.checked = true;
    }

    // Add a toggle event listener for checkboxes as is when checked change the visibel properties accordingly
    // as if checked then add to visible properties else remove from visible properties
    checkbox.addEventListener('change', (event) => {
      const property = event.target.value;
      if (event.target.checked) {
        window.visibleProperties.push(property);
      } else {
        const index = window.visibleProperties.indexOf(property);
        if (index !== -1) {
          window.visibleProperties.splice(index, 1);
        }
      }

      // Update localStorage with visible properties, decimal properties, property list
      localStorage.setItem('visibleProperties', JSON.stringify(window.visibleProperties)); // Update visibleProperties
      localStorage.setItem('decimalProperties', JSON.stringify(window.decimalProperties)); // Update decimalProperties
      localStorage.setItem('propertyList', JSON.stringify(window.animePropertyList)); // Update propertyList

      renderAnimeList("long");
      renderAnimeList("short");
      renderAnimeList("inactive");
    });
  }

  // Render Properties
  const filteredList = filter(window.animeList).filter(anime => anime.status === status);
  const listElement = document.getElementById(`${status}List`);
  listElement.innerHTML = '';

  filteredList.sort((a, b) => b.rating - a.rating); // Sort by rating

  filteredList.forEach(anime => {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'anime-item'); // Add this line
    // const animeNameSpan = document.createElement('span');
    // animeNameSpan.textContent = `${anime.name} - Episodes watched: `;
    // listItem.appendChild(animeNameSpan);

    // updating the link to item
    const link = document.createElement('a');
    link.setAttribute('href', anime.link);
    link.setAttribute('target', '_blank');
    link.textContent = anime.name;
    // link.style.width = '20px'; // Set the width to 200 pixels
    listItem.appendChild(link);

    // add visible properties to list item
    for (let i = 0; i < window.visibleProperties.length; i++) {
      const property = window.visibleProperties[i];
      const propertyInput = document.createElement('input');
      propertyInput.setAttribute('type', 'number');

      const isDecimal = window.decimalProperties[property] !== undefined;

      if (isDecimal) {
        propertyInput.setAttribute('type', 'number');
        propertyInput.setAttribute('step', `${decimalProperties[property]}`);
      }
      else {
        propertyInput.setAttribute('type', 'text');
      }

      propertyInput.setAttribute('class', 'editable-rating');
      propertyInput.classList.add(`${property}Input`);
      propertyInput.setAttribute('value', anime[property]);
      propertySpan = document.createElement('span');
      propertySpan.classList.add('propertySpan');
      propertySpan.classList.add(`${property}Span`);
      propertySpan.textContent = `${property.charAt(0).toUpperCase()}${property.slice(1)}`;
      listItem.appendChild(propertySpan);
      propertyInput.addEventListener('blur', (event) => {
        let newProperty = event.target.value;
        if (isDecimal) {
          newProperty = parseFloat(event.target.value);
        }
        // console.log(property, newProperty);
        updateProperty(anime.name, property, newProperty);
      });
      listItem.appendChild(propertyInput);
    }

    // Add an update button
    const updateButton = document.createElement('button');
    updateButton.classList.add('updateBtn');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      // Update all properties at once
      const newName = prompt('Enter new name:', anime.name);
      const newEpisodesWatched = parseInt(prompt('Enter new episodes watched:', anime.episodesWatched));
      const newStatus = prompt('Enter new status:', anime.status);
      const newRating = parseFloat(prompt('Enter new rating:', anime.rating));
      const newLink = prompt('Enter new link:', anime.link);

      anime.name = newName;
      anime.episodesWatched = newEpisodesWatched;
      anime.status = newStatus;
      anime.rating = newRating;
      anime.link = newLink;

      localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
      renderAnimeList(anime.status);
    });
    listItem.appendChild(updateButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteBtn');
    deleteButton.textContent = 'Delete';
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"></i>'; // Use a Font Awesome trash icon
    deleteButton.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to delete this anime?');
      if (confirmation) {
        const index = window.animeList.findIndex(a => a.name === anime.name);
        if (index !== -1) {
          window.animeList.splice(index, 1); // Remove the anime from the list
          localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
          renderAnimeList(anime.status);
        }
      }
    });
    listItem.appendChild(deleteButton);
    listElement.appendChild(listItem);
  });

  // Check if collpaseBtn is visible
  const firstAnimeItem = document.getElementsByClassName('anime-item')[0];

  if (firstAnimeItem === undefined) {
    return;
  }

  const expandButton = document.createElement('button');
  expandButton.setAttribute('id', `${status}ExpandBtn`);
  expandButton.classList.add(`expandBtn`);
  // expandButton.textContent = '▼';

  expandButton.style.width = firstAnimeItem.offsetWidth + 'px';

  // set width of class block same as above
  // const blockDiv = document.getElementsByClassName('block');
  // blockDiv[0].style.width = firstAnimeItem.offsetWidth + 50 + 'px';

  // put text of button at center despite flex and float left
  const expandButtonText = document.createElement('i');
  expandButtonText.classList.add('fas', 'fa-angle-double-down');
  // expandButtonText.textContent = '▼';
  expandButtonText.classList.add(`expandBtnSpan`);
  expandButton.appendChild(expandButtonText);
  expandButtonText.style.marginLeft = parseInt(firstAnimeItem.offsetWidth / 2) + 'px';
  expandButtonText.style.marginTop = '20px';

  const section = document.getElementById(`${status}Section`);
  const collapseBtn = document.getElementsByClassName(`${status}CollapseBtn`);
  // change background of section to linear gradient if number of items in li status section is more than 2
  const animeItemCount = listElement.childElementCount;
  if (animeItemCount > 2) {

    if (section.style.maxHeight != 'none') {
      expandButton.style.display = 'flex';
      // hide collpase button
      collapseBtn[0].style.display = 'none';
    } else {
      // hide expand button
      expandButton.style.display = 'none';
      // show collpase button
      collapseBtn[0].style.display = 'inline-block';
    }
  } else {
    expandButton.style.display = 'none';
    collapseBtn[0].style.display = 'none';
    section.style.maxHeight = 'none';
    section.style.background = 'none';
    section.classList.remove('masked');
  }

  expandButton.addEventListener('click', () => {

    const section = document.getElementById(`${status}Section`);
    section.style.maxHeight = section.style.maxHeight != 'none' ? 'none' : '300px';

    section.style.background = section.style.background != 'none' ? 'none' : 'linear-gradient(to top, #000, transparent);';
    section.classList.toggle('masked');

    // toggle expandButton from bottom of listElement to top of listElement as f
    // when height is none then put expand button at top else put it at bottom
    const collapseBtn = document.getElementsByClassName(`${status}CollapseBtn`);
    // console.log(collapseBtn);
    if (section.style.maxHeight != 'none') {
      expandButton.style.display = 'flex';
      // hide collpase button
      collapseBtn[0].style.display = 'none';
    } else {
      // hide expand button
      expandButton.style.display = 'none';
      // show collpase button
      collapseBtn[0].style.display = 'inline-block';
    }
  });

  listElement.appendChild(expandButton);

  // set width of class block same as content 
  const blockDiv = document.getElementsByClassName('block');
  for (let i = 0; i < blockDiv.length; i++) {
    blockDiv[i].style.width = firstAnimeItem.offsetWidth * 1.05 + 'px';
  }
}

// Function to update the anime rating or episodes watched
function updateProperty(animeName, property, value) {
  const anime = window.animeList.find(anime => anime.name === animeName);
  if (anime) {
    anime[property] = value;
    localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
    renderAnimeList(anime.status);
  }
}

// Usage example:
// updateProperty('Anime 1', 'rating', 5); // Update anime rating
// updateProperty('Anime 2', 'episodesWatched', 15); // Update episodes watched

const sections = ['long', 'short', 'inactive'];

for (let i = 0; i < sections.length; i++) {
  const section = sections[i];
  const button = document.getElementById(`${section}Button`);
  const sectionElement = document.getElementById(`${section}Section`);

  button.addEventListener('click', () => {
    sectionElement.style.display = sectionElement.style.display === 'none' ? 'block' : 'none';
    button.innerText = button.innerText === 'Hide' ? 'Show' : 'Hide';
    handleScroll();
  });
}

// add event listeners for collapse buttons in for loop
for (let i = 0; i < sections.length; i++) {
  const section = sections[i];
  const collapseBtn = document.getElementsByClassName(`${section}CollapseBtn`);

  // add event listener for collapse buttons, on click hide the button and show expand button
  collapseBtn[0].addEventListener('click', () => {
    const sectionElement = document.getElementById(`${section}Section`);
    sectionElement.style.maxHeight = '300px';
    sectionElement.style.background = 'linear-gradient(to top, #000, transparent)';
    sectionElement.classList.toggle('masked');
    collapseBtn[0].style.display = 'none';
    const expandBtn = document.getElementById(`${section}ExpandBtn`);
    expandBtn.style.display = 'flex';
  });
}

// Add on change listener for element id filter to call function filter
document.getElementById('filter').addEventListener('change', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;
  loadDataFromLocalStorage();

  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
}
);

// Function to filter anime list based on input given in filter element, input is of format property sign value, e.g. rating > 3.
function filter() {
  const filterInput = document.getElementById('filter').value;

  if (filterInput === '') {
    return window.animeList;
  }

  const filterInputArray = filterInput.split(' ');

  if (filterInputArray.length !== 3) {
    // search over anime name that matches with the filterInput partially or completely
    const filteredList = window.animeList.filter(anime => anime.name.toLowerCase().includes(filterInput.toLowerCase()));
    console.log(filterInput, filteredList.length);
    return filteredList;
  }

  const property = filterInputArray[0];
  const sign = filterInputArray[1];
  const value = filterInputArray[2];
  const filteredList = window.animeList.filter(anime => {
    if (sign === '>') {
      return anime[property] > value;
    } else if (sign === '<') {
      return anime[property] < value;
    } else if (sign === '>=') {
      return anime[property] >= value;
    } else if (sign === '<=') {
      return anime[property] <= value;
    } else if (sign === '==') {
      return anime[property] == value;
    } else if (sign === '===') {
      return anime[property] === value;
    } else if (sign === '!=') {
      return anime[property] != value;
    } else if (sign === '!==') {
      return anime[property] !== value;
    }
  });

  console.log(property, sign, value, filteredList.length);
  return filteredList;
}

window.addEventListener('scroll', handleScroll);

function handleScroll() {
  var header = document.querySelector('header');
  var stickySections = document.getElementsByClassName('stickysection');

  var headerHeight = header.offsetHeight;

  // for loop
  for (let i = 0; i < stickySections.length; i++) {
    const stickySection = stickySections[i];
    stickySection.style.top = headerHeight + 15 + 'px';
  }

  // Fade any anime-item that scrolls above the header bottom
  var headerBottom = header.offsetTop + header.offsetHeight;
  var animeItems = document.getElementsByClassName('anime-item');
  for (let i = 0; i < animeItems.length; i++) {
    const animeItem = animeItems[i];

    // compute distance of animeItem from screen top
    const animeHeight = animeItem.getBoundingClientRect().y;

    if (animeHeight < headerBottom + 45) {
      // var delta = Math.abs(headerBottom + 50 - animeHeight);
      animeItem.style.opacity = 0.1 //+ delta / 100;
      animeItem.style.transition = 'opacity 0.1s ease-in-out';
    } else {
      animeItem.style.opacity = 1;
    }
  }
}
