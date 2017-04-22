$(document).ready(function(){

  $('form.registration-form').on('submit', function(){

      var user = $( 'form.registration-form' ).serialize();

      $.ajax({
        type: 'POST',
        url: '/signup',
        data: user,
        success:
          alert('Your signup was successful, You can now register')
        
      });

      return false;

  });
});
