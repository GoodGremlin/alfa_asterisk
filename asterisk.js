$(document).ready(function() {

	var phone;
	var address_ajax = '/gmm/ftpweb/asterisk/asterisk.php';



	$('#vp_button_close').on('click', close_message);
	$('#vp_button_hide').on('click', hide_message);
	$('#vp_hide_panel').on('click', hide_message);

	function hide_message(){
		$('#vp_main_message').slideToggle();
		$('#vp_hide_panel').slideToggle();
	}

	function close_message(){
		$('#vp_main_message').hide();
	}

	function vp_setCookie(name, values, expires, path, domain, secure )
    {
      var today = new Date();
      today.setTime( today.getTime() );
      if ( expires )
        {
           expires = expires * 1200000;
        }
      var expires_date = new Date( today.getTime() + (expires) );
      document.cookie = name + "=" +escape( values ) +
      ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
      ( ( path ) ? ";path=" + path : "" ) +
      ( ( domain ) ? ";domain=" + domain : "" ) +
      ( ( secure ) ? ";secure" : "" );
    }

    function getCookieChats(cookName) {
        var name = cookName + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    var id_oper = getCookieChats('phone');

    $.ajax({ 
    	type: 'POST',
    	url: address_ajax,
    	data: { 
    		id_oper: id_oper
    	},
    	success: function(date){
    		phone = parseInt(date);
    	    openSocet(phone);		
    	}
    });

    function openSocet(phone){
    	var socket = new WebSocket("wss://asterisk.alfa.tv:8888?phone="+phone);

    	socket.onopen = function() {
   		};

   		socket.onmessage = function(event) {
			var incomingMessage = event.data;
			showMessage(incomingMessage, phone);
		};
    }

   

	function showMessage(message, phone_oper) {
		arr = message.split('", "');
		nt_oper = arr[0];
		nt_abon = arr[1];
		name_c = arr[2];
		number_telephone = nt_abon.split(':');
		phone_a = parseInt(number_telephone[1].replace(/\D+/g,""));
		phone_a = phone_a+'';
		date = new Date();
		var time = date.getHours()+':'+date.getMinutes();
		if (phone_a.length > 4) {
			$.ajax({
	        type: "POST",
	        url: address_ajax,
	        data: { phone: phone_a
	        },
	        success: function(date){
	        	if (date) 
	        	{
	        		arr_date = date.split(':');
		        	$('#vp_name_message').text(arr_date[0]);
		        	$('#vp_address_message').text(arr_date[2]+' '+arr_date[3]);
		        	$('#vp_telephone_message').text(arr_date[1]);
		        	$('#vp_open_card').attr('href', 'https://172.15.1.250/gmm/abonents/index.php?Ed=1&rq=1&Id='+arr_date[4]+'');
		        	$('#vp_open_card').text('Открыть карточку абонента');
		        	$('#vp_time_call').text(time);
		        	$('#vp_main_message').show();

	        	}
	        	else {
	        		$('#vp_name_message').text('Абонент не зарегестрирован');
		        	$('#vp_address_message').text('Адрес не известный.');
		        	$('#vp_telephone_message').text(phone_a);
		        	$('#vp_open_card').attr('href', 'javascript:void(0);');
		        	$('#vp_open_card').text('');
		        	$('#vp_time_call').text(time);
		        	$('#vp_main_message').show();
	        	}
	        }
	        });
		}
		if (phone_a.length < 4 && phone_a.length !== 0  && phone_a != phone_oper) {
			name_x = name_c.split(':');
			name = name_x[1].replace(/[^A-Za-zА-Яа-яЁё]/g, "");
			$('#vp_name_message').text('Внутренний звонок');
        	$('#vp_address_message').text(name);
        	$('#vp_telephone_message').text(phone_a);
        	$('#vp_main_message').show();
        	$('#vp_open_card').text('');
        	$('#vp_time_call').text(time);
		}
	}

});
