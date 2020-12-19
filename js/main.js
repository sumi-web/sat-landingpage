function validateForm(formID) {
  //[ Validate ]
  var input = $('#' + formID + ' .inp-validate');

  //Validate each input field
  var check = true;

  for (var i = 0; i < input.length; i++) {
    if (validate(input[i]) === false) {
      showValidate(input[i]);
      check = false;
    }
  }
  //If form is validated then post data to API
  if (check) {
    sendOTP();
  }
}

function validate(input) {
  if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    //Match regex with control value
    var regex = new RegExp(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/),
      email = $(input).val();
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  } else {
    if ($(input).attr('name') === 'phone') {
      //Validate Phone number also
      //Match regex with control value
      var regex = new RegExp(/^[4-9][0-9]{9}$/),
        phone = $(input).val();
      if (regex.test(phone)) {
        return true;
      } else {
        return false;
      }
    } else {
      if ($(input).val().trim() === '') {
        return false;
      } else {
        return true;
      }
    }
  }
}

function showValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass('alert-validate');
  $(thisAlert).append('<span class="btn-hide-validate">&#xf135;</span>');
  $('.btn-hide-validate').each(function () {
    $(this).on('click', function () {
      hideValidate(this);
    });
  });
}

function hideValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).removeClass('alert-validate');
  $(thisAlert).find('.btn-hide-validate').remove();
}

function sendOTP() {
  //get the input values
  var nameVar = $('#txtName').val(),
    emailVar = $('#txtEmail').val(),
    phoneVar = $('#txtPhone').val(),
    queryVar = $('#txtQuery').val();
  if (nameVar != '' && emailVar != '' && phoneVar != '' && queryVar != '') {

    $('#loader').show();
    //Generate ajax request to send OTP
    $.ajax({
      type: "GET",
      url: "/api/data/otp2",
      contentType: "application/json; charset=utf-8",
      data: {
        number: phoneVar,
        email: emailVar,
        pageURL: window.location.href,
        token: $('#token').val()
      },
      dataType: "json",
      success: function (res) {
        if (res.status === true) {
          $('#otp').val(res.otp);
          //Show OTP Panel
          $('#otpPanel').show();
          //Hide Submit button panel
          $('#submitBtnPanel').hide();
          //Disable text box
          $('#txtPhone').attr('disabled', 'disabled');
          $('#txtEmail').attr('disabled', 'disabled');
        } else {
          notification(res.message, 'error');
        }

        $('#loader').hide();
      },
      failure: function (response) {
        notification('Error!! Please contact support for more information.', 'error');

        $('#loader').hide();
      },
      error: function (jqXHR) {
        notification('Error!! Please contact support for more information.', 'error');

        $('#loader').hide();
      }
    });
  }
}

function registerStudent(queryForStr, countryStr) {
  //Verify with OTP
  if ($('#otp').val() === $('#txtOTP').val().trim()) {

    var name = $('#txtName').val(),
      email = $('#txtEmail').val(),
      phone = $('#txtPhone').val(),
      query = $('#txtQuery').val();
    var obj = {
      studentName: name,
      studentContact: phone,
      emailAddress: email,
      message: query,
      queryFor: queryForStr,
      country: countryStr,
      pageURL: window.location.href,
    };

    $('#loader').show();
    $.ajax({
      url: "/api/register/student2",
      type: "POST",
      dataType: 'json',
      data: obj,
      success: function (res) {
        if (res.status === true) {
          //Clear form values
          $('#txtName').val('');
          $('#txtPhone').val('');
          $('#txtEmail').val('');
          $('#txtQuery').val('');
          if (queryForStr === 'IELTS-Academic' || queryForStr === 'IELTS-General') {
            //Redirect to thanks page of IELTS
            window.location.href = "/IELTS/Thanks";
          } else {
            //Redirect to thanks page of study visa
            window.location.href = "/StudyVisa/Thanks";
          }
        } else {
          notification(res.message, 'error');
        }

        $('#loader').hide();
      },
      failure: function (response) {
        notification('Error!! Please contact support for more information.', 'error');

        $('#loader').hide();
      },
      error: function (jqXHR) {
        notification('Error!! Please contact support for more information.', 'error');

        $('#loader').hide();
      }
    });
  } else {
    notification('Wrong OTP!!', 'error');
  }
}

function notification(text, type) {
  alert(text);
}

// making sticky navbar
const navbar = document.querySelector(".navbar-section");
window.addEventListener("scroll", function () {
  const scrollHeight = window.pageYOffset;
  const navbarHeight = navbar.getBoundingClientRect().height;
  if (scrollHeight > navbarHeight) {
    navbar.classList.add("fixed-navbar");

  } else {
    navbar.classList.remove("fixed-navbar")
  }
});
// /////code for smooth scroll
const scrollLinks = document.querySelectorAll(".scroll-link");
const linkContainer = document.querySelector(".collapse")
scrollLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // prevent default
    e.preventDefault();
    // navigate to specific spot
    const id = e.currentTarget.getAttribute("href").slice(1);
    const element = document.getElementById(id);

    // calculate the heights
    const navbarHeight = navbar.getBoundingClientRect().height;
    const linkContainerHeight = linkContainer.getBoundingClientRect().height;
    const fixNavbar = navbar.classList.contains("fixed-navbar");
    let position = element.offsetTop - navbarHeight;
    console.log(position);
    console.log(navbarHeight)
    if (!fixNavbar) {
      position = position - (navbarHeight);
    }
    if (navbarHeight > 90) {
      position = position + linkContainerHeight;
    }
    window.scrollTo({
      left: 0,
      top: position
    });
    // closing link container
    linkContainer.classList.remove("show");
  })
});

$('#topheader .navbar-nav a').on('click', function () {
  $('#topheader .navbar-nav').find('li.active').removeClass('active');
  $(this).parent('li').addClass('active');
});