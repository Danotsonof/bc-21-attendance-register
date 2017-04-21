
function addEvent() {
  var eventAdded = getElementById('newEvent').value;
  var eventList = getElementsById('event-list');
  eventList.innerHTML += '<li><a href="#">' +eventAdded + '</a></li>';
}
