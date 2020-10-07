// import $ from 'jquery';
// import bootstrap from 'bootstrap';

// Import CSS
// - Bootstrap
import './css/assets/bootstrap.css';

function createDiv(boostrapContainerId, containerClass) {
  const element = document.createElement('div');
  element.id = boostrapContainerId;
  element.className = containerClass;
  return element;
}

function addHeader(headerSize, headerText) {
  const element = document.createElement(headerSize);
  const elementBody = document.createTextNode(headerText);
  element.appendChild(elementBody);
  return element;
}

// Ref: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
function doNavigation(event) {
  console.log(`You clicked: ${event.currentTarget.destination}`);
}

function createNavigationView(destinations, applicationDiv) {
  // List of destinations, each with click event handler
  const unorderedList = document.createElement('ul');
  // Sequential for loop
  const destinationsLength = destinations.length;
  for (let i = 0; i < destinationsLength; i += 1) {
    const listItem = document.createElement('li');
    listItem.id = `nav-${destinations[i]}`;
    const listText = document.createTextNode(destinations[i]);
    listItem.appendChild(listText);
    listItem.addEventListener('click', doNavigation, false);
    listItem.destination = destinations[i];
    unorderedList.appendChild(listItem);
  }
  applicationDiv.appendChild(unorderedList);
}

function renderPage(destinations, applicationDiv) {
  const destinationsLength = destinations.length;
  for (let i = 0; i < destinationsLength; i += 1) {
    if (destinations[i] === 'home') {
      createNavigationView(destinations, applicationDiv);
    } else {
      console.log(`Unhandled destination: ${destinations[i]}`);
    }
  }
}

// Create outer Bootstrap container
const boostrapContainerClass = 'container';
const boostrapContainerId = 'boostrapContainer';
document.body.appendChild(createDiv(boostrapContainerId, boostrapContainerClass));
const boostrapContainer = document.getElementById(boostrapContainerId);

// Create title header
boostrapContainer.appendChild(addHeader('h1', 'jql FrontEnd'));

// Create outer application container
const applicationDivClass = 'application';
const applicationDivId = 'application';
boostrapContainer.appendChild(createDiv(applicationDivId, applicationDivClass));

// Render page
const destinations = [
  'home',
  'showAllEvents',
  'showEvent',
  'knownSafe',
  'knownUnsafe'
];
const applicationDiv = document.getElementById(applicationDivId);
renderPage(destinations, applicationDiv);
