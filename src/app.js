// import $ from 'jquery';
// import bootstrap from 'bootstrap';

// Import Images
// - favicon (Ref: https://favicon.io/favicon-generator/)
import './images/favicon/android-chrome-192x192.png';
import './images/favicon/android-chrome-512x512.png';
import './images/favicon/apple-touch-icon.png';
import './images/favicon/favicon-16x16.png';
import './images/favicon/favicon-32x32.png';
import './images/favicon/favicon.ico';
import './images/favicon/site.webmanifest';

// Import CSS
// - Bootstrap
import './css/assets/bootstrap.css';
import './css/assets/bootstrap.css.map';

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

function assembleUrl(action) {
  let url = localStorage.getItem('protocol');
  url += '://';
  url += localStorage.getItem('endpoint');
  url += ':';
  url += localStorage.getItem('port');
  url += localStorage.getItem('path');
  url += action;
  return url;
}

async function getAllEvents() {
  const action = '/events';
  const url = assembleUrl(action);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch(err) {
    alert(err);
    return {};
  }
}

function addSimpleTag(parent, tagType) {
  const newTag = document.createElement(tagType);
  parent.appendChild(newTag);
}

function createJqlRecord(id, string, knownSafe) {
  const eventDiv = document.createElement('div');
  eventDiv.id = `div${id}`;
  eventDiv.className = 'jqLogRecord';
  addSimpleTag(eventDiv, 'hr');
  const codeBlockForString = document.createElement('code');
  const codeContent = document.createTextNode(string);
  codeBlockForString.appendChild(codeContent);
  eventDiv.appendChild(codeBlockForString);
  addSimpleTag(eventDiv, 'br');
  addSimpleTag(eventDiv, 'br');
  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.id = id;
  toggleButton.className = 'jqLogRecordButton btn btn-sm';
  if (knownSafe === 0) {
    toggleButton.addClass('btn-outline-success');
  } else {
    toggleButton.addClass('btn-outline-danger');
  }
  const buttonText = document.createTextNode('Mark not safe');
  toggleButton.appendChild(buttonText);
  eventDiv.appendChild(toggleButton);
  return eventDiv;
}

async function createApplicationView(view, applicationDiv) {
  applicationDiv.innerHTML = '';
  applicationDiv.appendChild(addHeader('h2', view));

  if (view === 'showAllEvents') {
    const eventsData = await getAllEvents();
    const eventsDataLength = eventsData.length;
    if (eventsDataLength > 0) {
      for (let i = 0; i < eventsDataLength; i += 1) {
        const eventDataItem = JSON.stringify(eventsData[i], null, 4);
        const eventDiv = document.createElement('div');
        const eventDivPre = document.createElement('pre');
        const eventDivContent = document.createTextNode(eventDataItem);
        eventDivPre.appendChild(eventDivContent);
        eventDiv.appendChild(eventDivPre);
        applicationDiv.appendChild(eventDiv);
      }
    } else {
      const noEventsText = 'No events have been logged.';
      const noEventsParagraph = document.createElement('p');
      const noEventsParagraphText = document.createTextNode(noEventsText);
      noEventsParagraph.appendChild(noEventsParagraphText);
      applicationDiv.appendChild(noEventsParagraph);
    }
  }

  if (view === 'knownSafe') {
    const eventsData = await getAllEvents();
    const eventsDataLength = eventsData.length;
    if (eventsDataLength > 0) {
      for (let i = 0; i < eventsDataLength; i += 1) {
        if (eventsData[i].knownSafe === 1 && eventsData[i].string !== undefined) {
          // eslint-disable-next-line max-len
          const eventDiv = createJqlRecord(eventsData[i]._id, eventsData[i].string, eventsData[i].knownSafe);
          applicationDiv.appendChild(eventDiv);
        }
      }
    } else {
      const noEventsText = 'No events have been logged.';
      const noEventsParagraph = document.createElement('p');
      const noEventsParagraphText = document.createTextNode(noEventsText);
      noEventsParagraph.appendChild(noEventsParagraphText);
      applicationDiv.appendChild(noEventsParagraph);
    }
  }

  // Show logged events that are not safe
  if (view === 'knownUnsafe') {
    const eventsData = await getAllEvents();
    const eventsDataLength = eventsData.length;
    if (eventsDataLength > 0) {
      for (let i = 0; i < eventsDataLength; i += 1) {
        if (eventsData[i].knownSafe === 0 && eventsData[i].string !== undefined) {
          // eslint-disable-next-line max-len
          const eventDiv = createJqlRecord(eventsData[i]._id, eventsData[i].string, eventsData[i].knownSafe);
          applicationDiv.appendChild(eventDiv);
        }
      }
    } else {
      const noEventsText = 'No events have been logged.';
      const noEventsParagraph = document.createElement('p');
      const noEventsParagraphText = document.createTextNode(noEventsText);
      noEventsParagraph.appendChild(noEventsParagraphText);
      applicationDiv.appendChild(noEventsParagraph);
    }
  }
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

// Import variables from the .env file
if (process.env.NODE_ENV === 'development') {
  console.log(`Application running in ${process.env.NODE_ENV} mode`);
  localStorage.setItem('protocol', process.env.DEV_API_PROTOCOL);
  localStorage.setItem('endpoint', process.env.DEV_API_ENDPOINT);
  localStorage.setItem('port', process.env.DEV_API_PORT);
  localStorage.setItem('path', process.env.DEV_API_PATH);
} else if (process.env.NODE_ENV === 'production') {
  console.log(`Application running in ${process.env.NODE_ENV} mode`);
  localStorage.setItem('protocol', process.env.PROD_API_PROTOCOL);
  localStorage.setItem('endpoint', process.env.PROD_API_ENDPOINT);
  localStorage.setItem('port', process.env.PROD_API_PORT);
  localStorage.setItem('path', process.env.PROD_API_PATH);
} else {
  console.log(`Error unknown application environment: ${process.env.NODE_ENV}`);
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
  // 'showEvent',
  'knownSafe',
  'knownUnsafe'
];
const applicationDiv = document.getElementById(applicationDivId);
const navgationDiv = document.getElementById(navigationDivId);
renderPage(destinations, applicationDiv, navgationDiv);
