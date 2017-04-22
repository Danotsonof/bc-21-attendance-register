function del() {
  var myList = document.getElementById('del');
  myList.innerHTML = '';
}

$(document).ready(function(){

  $('form').on('submit', function(){
    var todo = $( "form" ).serialize();
      $.ajax({
        type: 'POST',
        url: '/adminCopy',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
      return false;
  });

  // $('li#events').on('click', function(){
  //       var item = $(this).text();
  //       $.ajax({
  //         type: 'DELETE',
  //         url: '/adminCopy/' + item,
  //         success: function(data){
  //           //do something with the data via front-end framework
  //           location.reload();
  //         }
  //       });
  //   });

  $('li.todoo').on('click', function(){
    var item = $(this).text();
    //console.log(item);
    $.ajax({
      type: 'GET',
      url: '/adminCopy/'+item,
      data: item,
      success: function(data){
        console.log(item);
        if (data.length === 0){
          $('.log').text('Users registered for '+ item)
          $('.eventUsers').text('none')
        } else {
        $('.log').text('Users registered for '+ data[0].option)
        for(var i = 0; i<data.length; i++) {
        $('.eventUsers').text(data[i].firstname + ' ' + data[i].lastname)
      }
    }
    }
  });
});

});
