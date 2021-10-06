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
  if (localStorage.getItem('port') !== 80 || localStorage.getItem('port') !== 443) {
    url += ':';
    url += localStorage.getItem('port');
  }
  url += localStorage.getItem('path');
  url += action;
  return url;
}

// TODO: check the return code of the request.
async function getAllEvents() {
  const action = '/events';
  const url = assembleUrl(action);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function doSearchEvents() {
  const searchInputId = 'searchFormInput';
  const searchString = document.getElementById(searchInputId).value;
  const resultsDivId = 'resultsDiv';
  const resultsDiv = document.getElementById(resultsDivId);
  resultsDiv.innerHTML = '';
  const action = `/events/?search=${searchString}`;
  const url = assembleUrl(action);
  try {
    const response = await fetch(url);
    const eventsData = await response.json();
    const eventsDataLength = eventsData.length;
    if (eventsDataLength > 0) {
      for (let i = 0; i < eventsDataLength; i += 1) {
        const eventDataItem = JSON.stringify(eventsData[i], null, 4);
        const eventDiv = document.createElement('div');
        const eventDivPre = document.createElement('pre');
        const eventDivContent = document.createTextNode(eventDataItem);
        eventDivPre.appendChild(eventDivContent);
        eventDiv.appendChild(eventDivPre);
        resultsDiv.appendChild(eventDiv);
      }
    } else {
      const noEventsText = 'Search did not match any events.';
      const noEventsParagraph = document.createElement('p');
      const noEventsParagraphText = document.createTextNode(noEventsText);
      noEventsParagraph.appendChild(noEventsParagraphText);
      resultsDiv.appendChild(noEventsParagraph);
    }
    return eventsData;
  } catch (err) {
    console.log(err);
    return {};
  }
}

function addSimpleTag(parent, tagType) {
  const newTag = document.createElement(tagType);
  parent.appendChild(newTag);
}

async function sendTogglePut(url, desiredState) {
  const data = { knownSafe: desiredState };
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const updatedRecord = await response.json();
  if (data.knownSafe === updatedRecord.knownSafe) {
    return true;
  }
  return false;
}

// Ref: https://stackoverflow.com/questions/6911235/is-there-a-better-way-of-writing-v-v-0-1-0
function toggleValue(value) {
  console.log('value is: ' + value);
  if (value === 0) {
    console.log('zero to one');
    return 1;
  }
  console.log('one to zero');
  return 0;
}

// Ref: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
async function doToggleKnownSafe(event) {
  const eventId = event.currentTarget.id;
  const action = `/events/${eventId}`;
  const url = assembleUrl(action);
  const desiredState = toggleValue(event.currentTarget.safeState);
  const alert = {
    class: 'alert alert-success'
  };
  if (desiredState === 0) {
    alert.message = 'String flagged as unsafe';
  }
  if (desiredState === 1) {
    alert.message = 'String flagged as safe';
  }
  const updatedRecord = await sendTogglePut(url, desiredState);
  if (updatedRecord === true) {
    const divID = `div${eventId}`;
    const parentDiv = document.getElementById(divID);
    parentDiv.innerHTML = '';
    const alertDiv = document.createElement('div');
    alertDiv.className = alert.class;
    const alertText = document.createTextNode(alert.message);
    alertDiv.appendChild(alertText);
    parentDiv.appendChild(alertDiv);
  }
}

function doDownloadKnownSafeJson() {
  console.log('Download KnownSafe data as JSON clicked');
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
  let buttonText = '';
  if (knownSafe === 0) {
    toggleButton.className = 'jqLogRecordButton btn btn-sm btn-outline-success';
    buttonText = 'Mark safe';
  } else {
    toggleButton.className = 'jqLogRecordButton btn btn-sm btn-outline-danger';
    buttonText = 'Mark not safe'
  }
  toggleButton.appendChild(document.createTextNode(buttonText));
  toggleButton.addEventListener('click', doToggleKnownSafe, false);
  toggleButton.safeState = knownSafe;
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

  if (view === 'searchEvents') {
    const searchForm = document.createElement('form');
    const searchFormDiv = document.createElement('div');
    searchFormDiv.className = 'form-group';
    const searchFormLabel = document.createElement('label');
    searchFormLabel.setAttribute('for', 'searchInput');
    const searchFormLabelText = document.createTextNode('Events Search');
    searchFormLabel.appendChild(searchFormLabelText);
    searchFormDiv.appendChild(searchFormLabel);
    const searchFormInput = document.createElement('input');
    searchFormInput.type = 'adf';
    searchFormInput.className = 'form-control';
    searchFormInput.id = 'searchFormInput';
    searchFormInput.placeholder = 'Enter search';
    searchFormDiv.appendChild(searchFormInput);
    searchForm.appendChild(searchFormDiv);
    const searchFormButton = document.createElement('button');
    searchFormButton.type = 'submit';
    searchFormButton.className = 'btn btn-primary';
    const searchFormButtonText = document.createTextNode('Submit');
    searchFormButton.appendChild(searchFormButtonText);
    searchFormButton.addEventListener('click', doSearchEvents, false);
    searchForm.appendChild(searchFormButton);
    applicationDiv.appendChild(searchForm);
    addSimpleTag(applicationDiv, 'br');
    addSimpleTag(applicationDiv, 'hr');
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'resultsDiv';
    resultsDiv.id = 'resultsDiv';
    applicationDiv.appendChild(resultsDiv);
  }

  if (view === 'knownSafe') {
    const downloadKnownSafeButton = document.createElement('button');
    downloadKnownSafeButton.type = 'button';
    downloadKnownSafeButton.className = 'btn btn-outline-primary';
    const downloadKnownSafeButtonText = document.createTextNode('Download as JSON');
    downloadKnownSafeButton.addEventListener('click', doDownloadKnownSafeJson, false);
    downloadKnownSafeButton.appendChild(downloadKnownSafeButtonText);
    applicationDiv.appendChild(downloadKnownSafeButton);
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
      const noEventsText = 'No knownSafe events have been logged.';
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
      const noEventsText = 'No unsafe events have been logged.';
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
  localStorage.setItem('protocol', process.env.DEV_API_PROTOCOL.toLowerCase());
  localStorage.setItem('endpoint', process.env.DEV_API_ENDPOINT);
  localStorage.setItem('port', process.env.DEV_API_PORT);
  localStorage.setItem('path', process.env.DEV_API_PATH);
} else if (process.env.NODE_ENV === 'production') {
  console.log(`Application running in ${process.env.NODE_ENV} mode`);
  localStorage.setItem('protocol', process.env.PROD_API_PROTOCOL.toLowerCase());
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
  'searchEvents',
  'knownSafe',
  'knownUnsafe'
];
const applicationDiv = document.getElementById(applicationDivId);
const navgationDiv = document.getElementById(navigationDivId);
renderPage(destinations, applicationDiv, navgationDiv);
