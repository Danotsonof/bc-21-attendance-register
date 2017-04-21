$(document).ready(function(){

  $('form').on('submit', function(){

      var user = $( "form" ).serialize();

      $.ajax({
        type: 'POST',
        url: '/signupCopy',
        data: user,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });
});
