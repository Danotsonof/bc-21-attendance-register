$(document).ready(function(){

  $('form').on('submit', function(){
    var todo = $( "form" ).serialize();
      $.ajax({
        type: 'POST',
        url: '/admin',
        data: todo,
        success: function(data){
          location.reload();
        }
      });
      return false;
  });

  $('li.eventDelete').on('click', function(){
        var item = $(this).text();
        console.log(item);
        $.ajax({
          type: 'DELETE',
          url: '/admin/' + item,
          success: function(data){
            location.reload();
          }
        });
    });

  $('li.events').on('click', function(){
    var item = $(this).text();
    $.ajax({
      type: 'GET',
      url: '/admin/'+item,
      data: item,
      success: function(data){
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
