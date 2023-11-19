// JavaScript for handling interactions and data management
// Function to save data to a file
let animeList = [];
window.animeList = animeList;

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
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const contents = event.target.result;
      const data = JSON.parse(contents);
      window.animeList = data;
      localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
      console.log('Is localStorage empty?', isLocalStorageEmpty()); // Output: true or false
      console.log('Loaded data:', window.animeList);
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
  const newAnime = {
    name: prompt('Enter anime name:'),
    episodesWatched: parseInt(prompt('Enter number of episodes watched:')),
    status: prompt('Enter status (long, short, inactive):'),
    rating: parseFloat(prompt('Enter rating:')),
    link: prompt('Enter link:'),
  };
  window.animeList.push(newAnime);
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
  
  // Add a 1-second delay before refreshing the window
  setTimeout(() => {
    location.reload();
  }, 2000);
}

// Function to save animes
function saveData() {
  saveToFile(window.animeList);
  // Logic to add a new anime to animeList
  // Then update localStorage and re-render the lists
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;

  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');
});

document.getElementById('addAnimeBtn').addEventListener('click', addNewAnime);
document.getElementById('loadDataBtn').addEventListener('click', loadData);
document.getElementById('saveDataBtn').addEventListener('click', saveData);
document.getElementById('resetLocal').addEventListener('click', resetLocalStorage);

  // Function to render anime list based on status
function renderAnimeList(status) {
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

    // updating episode watched
    const episodesWatched = document.createElement('input');
    episodesWatched.setAttribute('type', 'number');
    episodesWatched.setAttribute('class', 'editable-rating');
    episodesWatched.setAttribute('value', anime.episodesWatched);
    // add text before the input
    const episodesWatchedText = document.createElement('span');
    episodesWatchedText.textContent = 'Episodes watched:';
    listItem.appendChild(episodesWatchedText);
    episodesWatched.addEventListener('change', (event) => {
      const newepisodesWatched = parseInt(event.target.value);
      updateEpisodeCount(anime.name, newepisodesWatched);
    });
    listItem.appendChild(episodesWatched);

    // updating rating of item
    const ratingInput = document.createElement('input');
    ratingInput.setAttribute('type', 'number');
    ratingInput.setAttribute('class', 'editable-rating');
    ratingInput.setAttribute('value', anime.rating);
    // add text before the input
    const ratingText = document.createElement('span');
    ratingText.textContent = 'Rating:';
    listItem.appendChild(ratingText);
    ratingInput.setAttribute('step', '0.1'); // Set step attribute to allow floating point values
    ratingInput.addEventListener('change', (event) => {
      const newRating = parseFloat(event.target.value);
      updateRating(anime.name, newRating);
    });
    listItem.appendChild(ratingInput);

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
}

// Function to update the anime rating
function updateRating(animeName, newRating) {
  const anime = window.animeList.find(anime => anime.name === animeName);
  if (anime) {
    anime.rating = newRating;
    localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
    renderAnimeList(anime.status);
  }
}

// Function to update the anime episodes watched
function updateEpisodeCount(animeName, episodesWatched) {
  const anime = window.animeList.find(anime => anime.name === animeName);
  if (anime) {
    anime.episodesWatched = episodesWatched;
    localStorage.setItem('animeList', JSON.stringify(window.animeList)); // Update localStorage
    renderAnimeList(anime.status);
  }
}

document.getElementById('longButton').addEventListener('click', () => {
  const longSection = document.getElementById('longSection');
  longSection.style.display = longSection.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('shortButton').addEventListener('click', () => {
  const shortSection = document.getElementById('shortSection');
  shortSection.style.display = shortSection.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('inactiveButton').addEventListener('click', () => {
  const inactiveSection = document.getElementById('inactiveSection');
  inactiveSection.style.display = inactiveSection.style.display === 'none' ? 'block' : 'none';
});

// Add on change listener for element id filter to call function filter
document.getElementById('filter').addEventListener('change', () => {
  // Load data from localStorage or use initial data
  const storedData = localStorage.getItem('animeList');
  window.animeList = storedData ? JSON.parse(storedData) : window.animeList;

  renderAnimeList('long');
  renderAnimeList('short');
  renderAnimeList('inactive');}
  );

// Function to filter anime list based on input given in filter element, input is of format property sign value, e.g. rating > 3.
function filter() {
  const filterInput = document.getElementById('filter').value;

  if (filterInput === '') {
    return window.animeList;
  }

  const filterInputArray = filterInput.split(' ');

  if (filterInputArray.length !== 3) {
    return window.animeList;
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

  return filteredList;
}

