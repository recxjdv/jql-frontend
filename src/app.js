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

// TODO:
function getData(id) {
  // if id
  // return object containing a GET /events/{id} output
  // else
  // get /events/
}

function createApplicationView(view, applicationDiv) {
  applicationDiv.innerHTML = '';
  applicationDiv.appendChild(addHeader('h2', view));
}

// Ref: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
function doNavigation(event) {
  // Remove the existing active class
  const makeInActiveAnchor = document.getElementsByClassName('nav-link active')[0];
  makeInActiveAnchor.className = 'nav-link';

  // Set the selected list item as active
  const listTarget = `nav-item anchor-${event.currentTarget.destination}`;
  const makeActiveList = document.getElementsByClassName(listTarget)[0];
  const makeActiveAnchor = makeActiveList.getElementsByTagName('a')[0];
  makeActiveAnchor.classList.add('active');

  // Render the view
  // FIXME: the hard coding of the div id here
  const applicationDivId = 'application';
  const applicationDiv = document.getElementById(applicationDivId);
  createApplicationView(event.currentTarget.destination, applicationDiv);
}

function createNavigationView(destinations, navgationDiv) {
  // List of destinations, each with click event handler
  const unorderedList = document.createElement('ul');
  unorderedList.className = 'nav nav-tabs';
  // Sequential for loop over each destination
  const destinationsLength = destinations.length;
  for (let i = 0; i < destinationsLength; i += 1) {
    const listItem = document.createElement('li');
    listItem.className = `nav-item anchor-${destinations[i]}`;
    const listAnchor = document.createElement('a');
    if (destinations[i] === 'home') {
      listAnchor.className = 'nav-link active';
    } else {
      listAnchor.className = 'nav-link';
    }
    listAnchor.href = '#';
    const listAnchorText = document.createTextNode(destinations[i]);
    listAnchor.appendChild(listAnchorText);
    listAnchor.addEventListener('click', doNavigation, false);
    listAnchor.destination = destinations[i];
    listItem.appendChild(listAnchor);
    unorderedList.appendChild(listItem);
  }
  navgationDiv.appendChild(unorderedList);
}

// Todo this should render a complete page.
function renderPage(destinations, applicationDiv, navgationDiv) {
  createNavigationView(destinations, navgationDiv);
  createApplicationView('home', applicationDiv);
}

// Create outer Bootstrap container
const boostrapContainerClass = 'container';
const boostrapContainerId = 'boostrapContainer';
document.body.appendChild(createDiv(boostrapContainerId, boostrapContainerClass));
const boostrapContainer = document.getElementById(boostrapContainerId);

// Create title header
// boostrapContainer.appendChild(addHeader('h1', 'jql FrontEnd'));

// Create navigation container
const navigationDivClass = 'navigation';
const navigationDivId = 'navigation';
boostrapContainer.appendChild(createDiv(navigationDivId, navigationDivClass));

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
const navgationDiv = document.getElementById(navigationDivId);
renderPage(destinations, applicationDiv, navgationDiv);
