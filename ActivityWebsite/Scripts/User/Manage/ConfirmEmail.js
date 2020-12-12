﻿$(document).ready(function () {

    $('#btnSendConfirmEmail').click(function (e) {

        $('#modalContext').html(`<div class="text-center"><p><i class="fas fa-spinner fa-spin"></i>   Sending email ...</p></div>`);
        $.ajax({
            url: '/Manage/sendCodeConfirmEmail',
            method: "POST",
            success: response => {
                if (response.success) {
                    $('#modalContext').html(`<div class="alert alert-success">${response.message}</div>`)
                }else{
                    $('#modalContext').html(`<div class="alert alert-success">Send email success!</div>`)
                }
            },
            error: err => {
                if (err.responseJSON) {
                    $('#modalContext').html(`<div class="alert alert-danger">${err.responseJSON.message}</div>`)
                }else{
                    $('#modalContext').html(`<div class="alert alert-danger">Unexpected error</div>`)
                }
            }
        })
    })

})