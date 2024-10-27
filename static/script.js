// JavaScript for handling interactions and data management
// Function to save data to a file
let animeList = [];
let iframedata = null;
window.animeList = animeList;
window.animePropertyList = ['name', 'episodesWatched', 'status', 'rating', 'link', 'image'];
window.visibleProperties = ['rating', 'episodesWatched'];
window.decimalProperties = {
  rating: 0.1,
  episodesWatched: 1,
};
window.animeListState = {};
window.sortBy = 'rating';
window.options = {};

const sections = ['long', 'short', 'inactive'];

// #############################################
// ############## Event listeners ##############
// #############################################
document.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;
  // change sortby radio button to rating
  const options = localStorage.getItem('options');
  
  const sortBy = options ? JSON.parse(options).sortBy : 'rating';
  document.getElementById(sortBy).checked = true;

  const horviewstyle = options ? JSON.parse(options).horviewstyle : false;
  document.getElementById('horviewstyle').checked = horviewstyle;

  loadDataFromLocalStorage();
  // window.animePropertyList = Object.keys(window.animeList[0]);
  renderAllSections();

  // Add a scroll event listener to the animeSection div to scroll horizontally
  const scrollContainer = document.querySelector('.animeSection');
  scrollContainer.addEventListener('wheel', (event) => {
      if (event.deltaY !== 0) {
          const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          console.log(scrollContainer.scrollLeft, maxScrollLeft);
          if (scrollContainer.scrollLeft >= maxScrollLeft-30 && event.deltaY > 0) {
              // Scroll down if at the right edge and scrolling down
              window.scrollBy(0, event.deltaY);
          } else if (scrollContainer.scrollLeft === 0 && event.deltaY < 0) {
              // Scroll up if at the left edge and scrolling up
              window.scrollBy(0, event.deltaY);
          } else {
              // Scroll horizontally
              scrollContainer.scrollLeft += event.deltaY;
          }
          event.preventDefault();
      }
  });
});
// Click event listener for add anime button
document.getElementById('addAnimeBtn').addEventListener('click', addNewAnime);
document.getElementById('loadDataBtn').addEventListener('click', loadData);
document.getElementById('saveDataBtn').addEventListener('click', saveData);
document.getElementById('resetLocal').addEventListener('click', resetLocalStorage);
// Event listener for add/del property button
document.getElementById('addPropBtn').addEventListener('click', addProperty);
document.getElementById('delPropBtn').addEventListener('click', delProperty);
// Event listener for options buttons
document.getElementById('hideRecent').addEventListener('click', () => {
  const hideRecent = document.getElementById('hideRecent').checked;
  window.options.hideRecent = hideRecent;
  updateLocalStorage();
  renderAllSections();
});
// Add an event listener to the radio buttons to store the selected value in the session storage when a radio button is selected
document.querySelectorAll('input[name="sortBy"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        changeSortBy(this.value);
    });
});
document.getElementById('horviewstyle').addEventListener('change', () => {
  const horviewstyle = document.getElementById('horviewstyle').checked;
  window.options.horviewstyle = horviewstyle;
  updateLocalStorage();
  renderAllSections();
  window.location.reload();
});
// Add on change listener for element id filter to call function filter
document.getElementById('filter').addEventListener('change', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;
  loadDataFromLocalStorage();

  renderAllSections();
}
);
window.addEventListener('scroll', handleScroll);
// add event listeners for show/hide buttons in for loop
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

// ####################################
// ############# FUNCTION #############
// ####################################
// Function to render all sections
function renderAllSections() {
  // render anime list based on status of anime from list of statuses 
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    renderAnimeList(section);
  }
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
  // console.log("apl", animePropertyList)

  // properties 
  const properties = window.animePropertyList;
  const invisibleProeprties = ["status", "link", "name", "image"];
  
  for (let i = 0; i < properties.length; i++) {

    if (invisibleProeprties.includes(properties[i])) {
      continue;
    }

    
    // if horizontal view is selected then continue on all properties except episodesWatched and rating
    // console.log("horviewstyle cp", properties[i]);
    if (window.options.horviewstyle && properties[i] !== 'episodesWatched' && properties[i] !== 'rating') {
      // of visible properties does not contain the property then remove from visible properties
      if (window.visibleProperties.includes(properties[i])) {
        const index = window.visibleProperties.indexOf(properties[i]);
        if (index !== -1) {
          window.visibleProperties.splice(index, 1);
        }
      }

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

      renderAllSections();
    });
  }

  // Render Properties
  const filteredList = filter(window.animeList).filter(anime => anime.status === status);
  const listElement = document.getElementById(`${status}List`);
  listElement.innerHTML = '';

  tobeAppended = [];

  // check sortBy property and sort the list accordingly
  console.log("sortBy rating", window.sortBy, window.sortBy === 'rating')
  if (window.sortBy === 'rating') {
    filteredList.sort((a, b) => b.rating - a.rating); // Sort by rating
  } else {
    const matchedProperty = window.sortBy;
    filteredList.sort((a, b) => b[matchedProperty] - a[matchedProperty]); // Sort by rating
  }

  filteredList.forEach(anime => {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'anime-item'); // Add this line
    // const animeNameSpan = document.createElement('span');
    // animeNameSpan.textContent = `${anime.name} - Episodes watched: `;
    // listItem.appendChild(animeNameSpan);

    // Add a watched/not watched checkbox with small size
    const watchedCheckbox = document.createElement('input');
    watchedCheckbox.setAttribute('type', 'checkbox');
    watchedCheckbox.setAttribute('class', 'watched-checkbox');
    watchedCheckbox.checked = window.animeListState[anime.name] !== undefined;
    listItem.appendChild(watchedCheckbox);

    // change background color to shades of gray with delta of time from last watched to current time
    if (watchedCheckbox.checked) {

      const currentTime = new Date();
      const lastWatched = new Date(window.animeListState[anime.name].lastWatched);
      const delta = Math.abs(currentTime - lastWatched) / 1000;
      const days = Math.floor(delta / 86400);
      const hours = Math.floor(delta / 3600) % 24;
      const minutes = Math.floor(delta / 60) % 60;
      const seconds = Math.floor(delta % 60);

      // if days are greater than 2 then click 
      if (days > 2) {
        watchedCheckbox.click();
      }
      else {
        // change opacity to shades of gray with delta of time from last watched to current time
        const opacity = 1 - (days * 0.2 + hours * 0.1 + minutes * 0.05 + seconds * 0.01)*0.2;
        listItem.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        listItem.style.border = 'none';
        console.log(anime.name, opacity);
      }

      // if horizontal view then make opacity 0.7
      if (window.options.horviewstyle && days <= 2) {
        listItem.style.opacity = 0.6;
      }
    }
    else{
      listElement.style.opacity = 1;
    }

    // add event listener on click that updates the animeliststate with anime name as key
    // and value as a dictionary with key as lastWatched and values as current time
    watchedCheckbox.addEventListener('click', (event) => {
      const animeName = anime.name;
      const animeListState = window.animeListState;
      const currentTime = new Date();
      const lastWatched = currentTime.toLocaleString();

      // if checked then update time else remove from animeListState
      if (event.target.checked) {
        window.animeListState[animeName] = { lastWatched: lastWatched };
      } else {
        delete window.animeListState[animeName];
      }
      updateLocalStorage();
      renderAnimeList(anime.status);
    });
    
    // updating the link to item
    const link = document.createElement('a');
    link.setAttribute('href', anime.link);
    link.setAttribute('target', '_blank');
    link.textContent = anime.name;
    // link.style.width = '20px'; // Set the width to 200 pixels
    listItem.appendChild(link);
    const hideRecent = document.getElementById('hideRecent');

    // save hideRecent checkbox state to window.options
    window.options.hideRecent = hideRecent.checked;

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

        // if property is episodes watched then trigger the checkbox click event
        if (property === 'episodesWatched') {
          watchedCheckbox.click();
        }
      });
      listItem.appendChild(propertyInput);
    }

    // Add an update button
    const updateButton = document.createElement('button');
    updateButton.classList.add('updateBtn');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      // Update all properties at once
      // call update function
      updateAnimeForm(anime.name);
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

    // if horizontal view is selected and anime has image link then add image as background
    if (window.options.horviewstyle && anime.image !== undefined) {
      listItem.style.backgroundImage = `url(${anime.image})`;
      listItem.style.backgroundSize = 'cover';
      listItem.style.backgroundPosition = 'center';
      listItem.style.backgroundRepeat = 'no-repeat';
    }

    // if the checkbox of id hideRecent is checked then do not show the anime in the list
    if (watchedCheckbox.checked && hideRecent.checked) {
      tobeAppended.push(listItem);
    }
    else {
      listElement.appendChild(listItem);
    }
    
  });

  // append the list items to listElement
  for (let i = 0; i < tobeAppended.length; i++) {
    listElement.appendChild(tobeAppended[i]);
  }

  // style change
  if (window.options.horviewstyle) {
    const listElementParent = listElement.parentElement;
    listElement.style.display = 'inline-flex';
    // listElement.style.flexWrap = 'wrap';
    listElement.style.justifyContent = 'space-between';
    // listElementParent.style.overflow = 'hidden';
    listElementParent.style.overflowX = 'scroll';
    
    // make the scroll bar invisible
    listElementParent.style.scrollbarWidth = 'none';

    // iterate over each child element and set width to 30% of screen width
    for (let i = 0; i < listElement.childElementCount; i++) {
      listElement.children[i].classList.add('horview');
      // add a hover back background tranparent div
      const hoverDiv = document.createElement('div');
      hoverDiv.classList.add('hoverDivBG');
      listElement.children[i].appendChild(hoverDiv);
    }
  }

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
// Function to save anime list
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
// reset local storage
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

  return updateAnimeForm();
}
// Function to load animes
function loadData() {
  loadFromFile();
  renderAllSections();
  console.log('Started Rendering data');

  // Add a 1-second delay before refreshing the window
  setTimeout(() => {
    location.reload();
  }, 3000);
}
// Function to save animes
function saveData() {

  // If animelist contains null values for any property then remove that anime from animeList
  const animeList = window.animeList;
  for (let i = 0; i < animeList.length; i++) {
    const anime = animeList[i];
    const properties = Object.keys(anime);
    for (let j = 0; j < properties.length; j++) {
      const property = properties[j];
      if (anime[property] === null) {
        animeList.splice(i, 1);
        i--;
        break;
      }
    }
  }

  saveToFile(animeList);
  // Logic to add a new anime to animeList
  // Then update localStorage and re-render the lists
}
// Function to change sortBy property
function changeSortBy(value) {
  const sortBy = value;
  window.sortBy = sortBy;
  window.options.sortBy = sortBy;
  updateLocalStorage();
  renderAllSections();
}
// function to update localStorage
function updateLocalStorage() {
  // Update localStorage
  localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update animeList
  localStorage.setItem('propertyList', JSON.stringify(window.animePropertyList)); // Update propertyList
  localStorage.setItem('visibleProperties', JSON.stringify(window.visibleProperties)); // Update visibleProperties
  localStorage.setItem('decimalProperties', JSON.stringify(window.decimalProperties)); // Update decimalProperties
  localStorage.setItem('animeListState', JSON.stringify(window.animeListState)); // Update animeListState
  localStorage.setItem('options', JSON.stringify(window.options)); // Update options
  console.log("working", window.options);
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
  const storedAnimeListState = localStorage.getItem('animeListState');
  window.animeListState = storedAnimeListState ? JSON.parse(storedAnimeListState) : window.animeListState;
  const storedOptions = localStorage.getItem('options');
  window.options = storedOptions ? JSON.parse(storedOptions) : window.options;
  window.sortBy = window.options.sortBy;
  const hideRecent = document.getElementById('hideRecent');
  hideRecent.checked = window.options.hideRecent;
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
  renderAllSections();
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
  renderAllSections();
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
// Handler for scrolling
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
// function to show a popup when update is clicked to show all properties in a form to be updated
// each row will contain a name of property and input field to update the property in left and right respectively
// anime status, language, will be a limited list of options to choose from using a dropdown
// number properties will have a step value to be updated
// other properties will be text input
// same functions should be used to add a new anime as well if input anime name is empty
function updateAnimeForm(animeName) {

  // try to find existing form and remove it
  var form = document.getElementById('updateAnimeForm');
  if (form) {
    document.body.removeChild(form);
  }

  // try to find existing background and remove it
  var background = document.getElementsByClassName('fadeBackground')[0];
  if (background) {
    document.body.removeChild(background);
  }

  if (animeName === undefined || animeName === null || animeName === '')
  {
    anime = {};
  }
  else{
    var anime = window.animeList.find(anime => anime.name === animeName);
  }

  form = document.createElement('form');
  form.setAttribute('id', 'updateAnimeForm');
  form.setAttribute('class', 'updateAnimeForm');

  const properties = window.animePropertyList;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const propertyLabel = document.createElement('label');
    propertyLabel.setAttribute('class', 'propertyLabelFormUpdate');
    propertyLabel.setAttribute('for', property);
    propertyLabel.textContent = `${property.charAt(0).toUpperCase()}${property.slice(1)}: `;

    form.appendChild(propertyLabel);

    const propertyInput = document.createElement('input');
    propertyInput.setAttribute('type', 'text');
    propertyInput.setAttribute('name', property);
    propertyInput.setAttribute('class', 'propertyInputFormUpdate');

    // if the property is status then add a suggestion to inpue
    if (property === 'status') {
      // show only limited options for status as suggested in statusOptions
      const statusOptions = ['long', 'short', 'inactive'];
      propertyInput.setAttribute('list', 'statusOptions');
      const datalist = document.createElement('datalist');
      datalist.setAttribute('id', 'statusOptions');
      for (let i = 0; i < statusOptions.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', statusOptions[i]);
        datalist.appendChild(option);
      }
      form.appendChild(datalist);
    }
    else{
      // if property is number then add step value
      if (window.decimalProperties[property] !== undefined) {
        propertyInput.setAttribute('type', 'number');
        propertyInput.setAttribute('step', `${window.decimalProperties[property]}`);
      }
      else{
        propertyInput.setAttribute('type', 'text');
      }
    }

    if (anime[property] !== undefined) {
      propertyInput.setAttribute('value', anime[property]);
    }
    form.appendChild(propertyInput);
  }

  // Add a submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  // set margin
  submitButton.style.margin = '1vh';
  form.appendChild(submitButton);

  // add event listener to submit button to update anime properties
  form.addEventListener('submit', (event) => {
    // updates anime properties

    event.preventDefault();
    const formData = new FormData(form);
    console.log('Form submitted with values:', formData);

    // remove form and background
    document.body.removeChild(form);
    document.body.removeChild(background);

    const updatedAnime = {};
    for (let [key, value] of formData) {
      updatedAnime[key] = value;
    }
    const index = window.animeList.findIndex(a => a.name === animeName);
    if (index !== -1) {
      window.animeList[index] = updatedAnime;
      localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
      renderAnimeList(updatedAnime.status);
    }
    else{
      window.animeList.push(updatedAnime);
      localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
      renderAnimeList(updatedAnime.status);
    }

    // TODO: save animes to file
  });

  // change CSS to display form in center of screen and display to block
  form.style.display = 'block';

  // Add a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  // set margin
  closeButton.style.margin = '1vh';

  // add event listener to close button to remove form and background
  closeButton.addEventListener('click', () => {
    var form = document.getElementById('updateAnimeForm');
    var background = document.getElementsByClassName('fadeBackground')[0];
    document.body.removeChild(form);
    document.body.removeChild(background);
  });

  form.appendChild(closeButton);
  document.body.appendChild(form);

  // process link url to get some properties by parsing the link in respective function
  const processLinkButton = document.createElement('button');
  processLinkButton.textContent = 'ProLink';
  // set margin
  processLinkButton.style.margin = '1vh';

  // add event listener to close button to remove form and background
  processLinkButton.addEventListener('click', async (event) => {
    event.preventDefault();
    url = prompt('Enter link to process:');
    const animeProps = await processLink(url);

    // update anime properties in form above and update in display
    const form = document.getElementById('updateAnimeForm');
    const formData = new FormData(form);
    
    for (let [key, value] of Object.entries(animeProps)) {
      const propertyInput = document.querySelector(`input[name="${key}"]`);
      // set the value of propertyInput to value to show in form
      // propertyInput.setAttribute('value', value);
      // show the updated value in form by displaying the value in form
      propertyInput.value = value;
    }

    // update anime properties in form
    for (let [key, value] of formData) {
      const propertyInput = document.querySelector(`input[name="${key}"]`);
      propertyInput.setAttribute('value', value);
    }
  });
  form.appendChild(processLinkButton);
  
  // add a backgrround to fade below this
  background = document.createElement('div');
  background.setAttribute('class', 'fadeBackground');
  document.body.appendChild(background);
}

// ############### FUINCTIONS FOR PARSING DIRECTLY FROM ANIMESITES ###############
// function to process link and get anime properties
async function processLink(urlLink) {
  // if link contains luciferdonghua.in
  if (urlLink.includes('lucifer')) {
    return await processLuciferDonghua(urlLink);
  }
  else{
    return {};  
  }
}

// function to process luciferdonghua.in
async function processLuciferDonghua(urlLink) {
  var result = await loadHtmlContent(urlLink, 'http://localhost:8000/api/scrapelucifer');
  result['link'] = urlLink;
  result['episodesWatched'] = 0;
  console.log(result);
  return result;
}

// function to load html content from a url
async function loadHtmlContent(url, fetchUrl) {
  return new Promise((resolve, reject) => {
    // hit the local path with a post call to get the html content
    var data = {url: url};

    // fetch data from url
    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(
      response => resolve(response.json())
    )
    .catch(
      error => reject(error)
    );
  });
}