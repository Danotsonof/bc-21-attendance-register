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

  $('span').on('click', function(){
      var item = $(this).closest('.li').text().replace(/ /g, "-");
      //$(this).closest('.li').remove();
      $.ajax({
        type: 'DELETE',
        url: '/adminCopy/' + item,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

  $('li').on('click', function(){
      var item = $(this).text();
      $.ajax({
        type: 'GET',
        url: '/adminCopy',
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});
