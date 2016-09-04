    //some docs: http://stackoverflow.com/questions/28576002/ajax-jquery-django (about: jdjangp +jquery + models +json)
    $(document).ready(function() {

    //we catch the values rendered by Django template
    var idTicket = document.getElementById("idTicket").value;
    var idPercentage = document.getElementById("idPercentage").value;
    
    function update_percentage(final_value)
    {
     $.ajax({
            type: "POST",
            url: "/tickets/set_percentage/"+idTicket+"/range/",
            dataType: "json",
            data: { "range_value": final_value },
            success: function(data) {
                    //console.log("Post update_percentage: " + final_value);
                    }
            });
     }

    var $range = $(".range_time24");+

    $(".range_time24").ionRangeSlider({
          type: "single",
          min: 0,
          max: 100,
          step: 10,
          from: idPercentage,
          max_interval: 0,
          onFinish: function (data) {
                    //Log final value for test purpouses
                    var raw_value = data.from;
                    //console.log("Value: " + raw_value);
                    update_percentage(raw_value);
                }

        });

    var slider = $(".range_time24").data("ionRangeSlider");


    function update_comments_new()
    {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/tickets/get_comments/"+idTicket+"",
            success: function(data) {
                        var dataparsed = (data);
                        //console.log(data);
                        //alert(data.length);
                        $( ".comment_box" ).empty();
                        $.each(dataparsed, function(i, item){
                            $(".comment_box").append(
                            '<div id="comment" class="col-md-12 col-sm-12 col-xs-12 form-group">'+
                            '<img alt="Avatar" class="avatar" src="/static/media/'+item.avatar_data+'">'+
                            '<span class="pull-right" style="margin-top: 10px;">'+item.date_data+'</span>'+
                            '<h5>'+item.human_name+'</h5>'+
                            '<div class="well">'+
                            '<p class="message">'+item.comment_data+'</p>'+
                            '<div class="comment-toolbar pull-right">'+
                            '<input type="hidden" id="idPMessage" name="idPMessage" value="'+item.id+'">'+
                            '<a href="#" class="del-message" onClick="return false;">Delete comment</a>'+
                            '</div>'+
                            '</div>'+
                            '</div>'
                             );
                        });
                        
                    }
             });
    }



    // AJAX POST
    $('.add-message').click(function(){
      //console.log('am i called');
        $.ajax({
            type: "POST",
            url: "/tickets/add_comment/"+idTicket+"",
            dataType: "json",
            data: { "message_text": $("#message_data").val() },
            success: function(data) {
		                    $("#message_data").val("");
                            //console.log(data);
                            update_comments_new();
                    },
            error: function(xhr, status, error) {
                            //$("#message_data").val("");
                            var json = JSON.parse(xhr.responseText);
                            var error_message = json.message;
                            new PNotify({
                                  title: 'Oops!',
                                  text: ''+error_message+'',
                                  type: 'error',
                                  styling: 'bootstrap3'
                              });
                            //update_comments_new();
                    }
            });
    });

    //With ON class we can keep changes in new dinamically created objects!
    $('.comment_box').on("click", ".del-message", function(){
        //var idActualMessage = $(".del-message").closest("#idPMessage").attr("value");
        var idActualMessage = $(this).closest("div#comment").find("input[name='idPMessage']").val();
        $.ajax({
            type: "POST",
            url: "/tickets/del_comment/",
            dataType: "json",
            data: { "message_id": idActualMessage, "ticket_id": idTicket},
            success: function(data) {
                    update_comments_new();
                    }
            });
    });

    // CSRF code
    function getCookie(name) {
        var cookieValue = null;
        var i = 0;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (i; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    }); 





});
