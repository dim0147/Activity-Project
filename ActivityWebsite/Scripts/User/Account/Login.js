$(document).ready(() => {

    $('.signup-btn').click(function(e){
        e.preventDefault();
        const provider = $(this).attr("provider");
        $("#provider").val(provider);
        $("#form-login-service").submit();
    })

})