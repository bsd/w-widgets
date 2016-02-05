/*global jQuery:false */

/* TO DO
  custom fields not coming through
*/
(function($) {
  'use strict';
    var s, signupInfo, wrapperHTML = '', signupFields,
    Widgets = {
      settings: {
        formURL: '/form.php',
        fieldsURL: '/fields.php'
      },

      init: function() {
        s = this.settings;
        Widgets.bindUIActions();
      },
      validate: function(el) {

        var flagValidation = 0;
        var msgValidation = '';
        //check for presence
        $('.form-error').remove();
        if(el.data('validate').indexOf('presence') >= 0) {
          if(!el.val()) {
            flagValidation = 1;
            //put in template
            msgValidation = '<p class="error">' + el.data('validatemsg') + '</p>';
          }
        }

        if(el.data('validate').indexOf('numeric') >= 0) {
          if(!$.isNumeric(el.val())) {
            flagValidation = 1;
            //put in template
            msgValidation = '<p class="error form-error">' + el.data('validatemsg') + '</p>';
          }
        }

        if(flagValidation > 0) {
          el.after(msgValidation);
          return false;
        }
        else {
          return true;
        }

      },
      personaliseForm: function() {

        $('#personaliseForm .hide-row').hide();

        //if thankyou option selected then show extra options
        $('#destination').on('change', function() {
          if($(this).val() === 'content') {
            $('.hide-row').show();
            $('.thankyouurl-row').hide();
          }
          else {
            $('.thankyouurl-row').show();
            $('.hide-row').hide();
          }
        });
      },
      thankyouCode: function() {


          var shareText = encodeURIComponent($('#shareTweet').val().trim());

          var thankyouCode = '<h2 class="thankyou-header">' + $('#thankyouHeader').val() + '</h2><div class="thankyou-content">' + $('#thankyouContent').val() + '</div>';
          if($('#formEntry').is(':checked'))
          {
            var formpostCode = '<div class="form-post"><p>Thank you for submitting the following information:</p></div>';
          }
          var shareCode = '<div class="share-content"><img src="' + $('#shareImg').val() + '" alt="share this page" /><div class="social-share"><a href="https://www.facebook.com/sharer/sharer.php?u=' + $('#sharePage').val() + '" class="fb-btn">Share on Facebook</a><a href="https://twitter.com/home?status=' + shareText + '" class="tw-btn">Share on Twitter</a></div></div>';

          return thankyouCode + formpostCode + shareCode;
      

      },
      buildEmbedCode: function() {

        var inputPaddH = 0;
        var inputPaddV = 0;
        var inputMarginH = 0;
        var inputMarginV = 0;

        //set padding
        if($('#paddingVertical').val().length > 0) {
          inputPaddV = $('#paddingVertical').val();
        }

        //set padding
        if($('#paddingHoriz').val().length > 0) {
          inputPaddH = $('#paddingHoriz').val();
        }

        //set margin
        if($('#marginVertical').val().length > 0) {
          inputMarginV = $('#marginVertical').val();
        }

        if($('#marginHoriz').val().length > 0) {
          inputMarginH = $('#marginHoriz').val();
        }

        var inputPadd = inputPaddV + ' ' + inputPaddH;
        var inputMargin = inputMarginV + ' ' + inputMarginH;

        //build the css
        var embedCSS = '<style type="text/css">';

        if($('#linkColour').val().length > 0) {
          embedCSS += '.signup-wrapper a { color: ' + $('#linkColour').val() + '  }';
        }
        if($('#textColour').val().length > 0) {
          embedCSS += '.signup-wrapper { color: ' + $('#textColour').val() + '  }';
        }

        if($('#bgImg').val().length > 0) {
          embedCSS += '.signup-wrapper { background: url(' + $('#bgImg').val() + ') no-repeat ' + $('#bgColour').val() + '; background-size:cover;  }';
        }

        //social buttons
        embedCSS += ' .fb-btn {  background-color: #2b4170; /* fallback color */  background: -moz-linear-gradient(top, #3b5998, #2b4170);  background: -ms-linear-gradient(top, #3b5998, #2b4170);  background: -webkit-linear-gradient(top, #3b5998, #2b4170);  border: 1px solid #2b4170;  text-shadow: 0 -1px -1px #1f2f52;} .fb-btn:hover {  background-color: #3b5998; /* fallback color */   background: -moz-linear-gradient(top, #2b4170, #3b5998);  background: -ms-linear-gradient(top, #2b4170, #3b5998);   background: -webkit-linear-gradient(top, #2b4170, #3b5998);}';
        embedCSS += ' .tw-btn {  background-color: #0081ce; /* fallback color */  background: -moz-linear-gradient(top, #00aced, #0081ce);  background: -ms-linear-gradient(top, #00aced, #0081ce);  background: -webkit-linear-gradient(top, #00aced, #0081ce); border: 1px solid #0081ce;  text-shadow: 0 -1px -1px #005ea3;} .tw-btn:hover { background-color: #00aced; /* fallback color */  background: -moz-linear-gradient(top, #0081ce, #00aced);  background: -ms-linear-gradient(top, #0081ce, #00aced);  background: -webkit-linear-gradient(top, #0081ce, #00aced); } .tw-btn, .fb-btn {  border-radius: 3px;  box-shadow: 0 1px 1px #999;  color: #fff;  display: inline-block;  font-size: 16px;  margin: 0 20px 20px 0;  margin: 0 1rem 2rem 0;  padding: 10px 15px;  padding: 1rem 1.5rem;  text-align: center;  width: 140px;}';
        embedCSS += ' body .signup-wrapper label.visible-label {display:inline-block; padding-right: 10px;}  body .signup-wrapper label {display:none;} .form-row--half input:not([type="submit"]):not([type="radio"]):not([type="checkbox"]), .form-row--half select { width:80%; box-sizing:border-box; } .row-hidden { display:none!important; } .form-row--half { display: inline;  float: left;  width: 47.5609756098%;  margin: 0 1.2195121951%; } .signup-wrapper input:not([type=submit]), .signup-wrapper textarea, .signup-wrapper select, .signup-wrapper label, .signup-wrapper .form-radio--label, .signup-wrapper .form-field-static, .signup-wrapper .form-radio--label { padding: ' + inputPadd + '; width:85%; margin: ' + inputMargin + '; } .b--btn.b--btn__submit { box-shadow:0px 2px #a6132c; background-color: #e83755;  border-right-color: #bd1632; width:auto; padding: 12px 60px 12px 25px; color: #ffffff; font-size: 14px; } .signup-wrapper input([type=checkbox]), .signup-wrapper input([type=radio]) { width:auto; } </style>';
        //build the js
        //will include signup API call
        var embedJS = '<script type="text/javascript">jQuery(document).ready(function() { jQuery(".thankyou-wrapper").hide();';

        //add code to validate JS -- only include if checkbox is select
          if($('#formValidation').is(':checked')) {
              embedJS += 'jQuery(".apiform").on("submit", function() {';
              //run through each .row-required
              embedJS += 'jQuery(".row-required").each(function(index) {';
              embedJS += 'var selectedInput = jQuery(this).find(".w--input-field");';
              embedJS += 'if(selectedInput.data("validate") === "presence" && selectedInput.val().length === 0) {';
              embedJS += 'jQuery(this).append(\'<p class="form-error">\' + selectedInput.data("validatemsg") + \'</p>\');';
              embedJS += 'selectedInput.addClass("invalid-fields");';
              embedJS += '  selectedInput.on("blur", function() {';
              embedJS += '    if(jQuery(this).length > 0) { jQuery(this).next("p.form-error").remove(); jQuery(this).removeClass("invalid-fields"); }';
              embedJS += '    else {';
              embedJS += '      jQuery(this).addClass("invalid-fields");';
              embedJS += ' } return false; });}});});';
          }
          embedJS += 'jQuery(".apiform").bsdSignup({no_redirect:true}).on("bsd-success",function(e, response){ e.preventDefault();';

          //if redirect to URL build script to redirect window to set URL
          if($('#formEntry').is(':checked'))
          {
            embedJS += ' var postedHTML = ""; jQuery(".apiform .form-row").not(".row-hidden").each(function(index) { if($(this).find(".form-radio--label").length > 0) {      var postedLabel = $(this).find(".form-radio--label").text();  }    else if ($(this).find("label").length > 0) {      var postedLabel = $(this).find("label").text(); } else { var postedLabel = ""; }  var postedInput = $(this).find(":input").val(); if(postedInput.length > 0 && postedLabel.length > 0) {  postedHTML += postedLabel + " : " + postedInput + "<br />";    }  });';
            embedJS += ' jQuery(".thankyou-content").append(\'<p class="wg-form-posted">\' + postedHTML + \'</p>\');';
          }
          if($('#destination').val() === 'url') {
            embedJS += ' window.location.replace("' + jQuery('#thankyouURL').val() + '"); ';
          }
          else {
            //if show thankyou content, hide the form on success and show thank you content
            embedJS += ' jQuery(".apiform").hide(); jQuery(".thankyou-wrapper").show(); ';
          }
          embedJS += '});});</script>';

        //build the html
        var embedHTML = '<div class="bsd-embed-form widgetainer widget-styled">';

        embedHTML += '<form name="' + signupInfo.signup_form_name + '" class="apiform" action="' + $('#branch').val() + '/page/s/' + signupInfo.signup_form_slug + '" method="post" id="' + signupInfo.signup_form_id + '">';

        embedHTML += $('#customiseForm form').html();
        embedHTML = embedHTML.replace('Personalise form', 'Submit form');
        embedHTML += '</form>';
        embedHTML += '</div>';

        wrapperHTML += '<div class="signup-wrapper">';
        //only show logo if it exists
        if($('#logo').val().length > 0) {
          wrapperHTML += '<div class="signup-logo" style="text-align: ' + $('#logoAlignment').val() + ';"><img src="' + $('#logo').val() + '" alt="logo" /></div>';
        }
        wrapperHTML += embedHTML;
        
        if($('#destination').val() !== 'url') {
          var tyCode = Widgets.thankyouCode();
          wrapperHTML += '<div class="thankyou-wrapper">' + tyCode + '</div>';
        }
        wrapperHTML += '</div>';

        $('#generateForm #embedScript').val(embedJS);
        $('#generateForm #embedStyle').val(embedCSS);
        $('#generateForm #embedTextbox').val(wrapperHTML);

        embedJS = '';
        embedCSS = '';
        wrapperHTML = '';

      },
      editForm: function() {

        //on site load should be hidden
        $('.e--edit-form').hide();

        $('.e--edit-form').on('click', 'a', function(event) {

          event.preventDefault();

          $('.e--edit-form').hide();
          $('#tabbedBox').hide();
          $('#fetchForm').fadeIn();

        });

      },
      fetchForm: function() {

        $('#fetchForm').on('submit', 'form', function(event) {
          event.preventDefault();

            //remove form missing message
            $('p.form-missing').remove();
            //validate input
            var formValidates = Widgets.validate($('#formID'));


            if(formValidates === false) {
              return false;
            }

            $('#fetchForm .b--btn').addClass('loading-animation').attr('disabled', true).css({'cursor': 'default'});

            $.ajax({
                      url: s.formURL,
                      method: 'GET',
                      data: { formID: $('#formID').val(), branch: $('#branch').val() },
                      success: function(data) {
                        data = JSON.parse(data);
                        var arr = $.makeArray( data );
                        signupInfo = arr[0].signup_form;
                        Widgets.fetchFields();
                      },
                      error: function() {
                          //Something went so wrong
                          $('#formID').after('<p class="error form-missing">I am sorry this signup form does not exist within this branch in the Blue State Digital Tools.</p>');
                          //reset button
                          $('#fetchForm .b--btn').removeClass('loading-animation').attr('disabled', false).css({'cursor': 'pointer'});
                          return false;
                      }
                  });

        });
      },
      fieldType: function(k, fieldName, fieldType, validationTxt) {
         switch(k.format) {
          case '1':
          //if input type text
          signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
          signupFields += '<input class="w--input-field" type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          case '2':
          //if textarea
          signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
          signupFields += '<textarea class="w--input-field" ' + validationTxt + ' name="' + fieldName + '">' + k.label + '</textarea>';
          break;
          case '3':
            //selectbox
            if(k.label === 'Country') {
              signupFields += '<label class="visible-label" for="country">Country</label>';
              signupFields += '<select  class="w--input-field" id="country" name="country"><option value=""></option><option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BR">Brazil</option><option value="VG">British Virgin Islands</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CO">Colombia</option><option value="KM">Comoros Islands</option><option value="CD">Congo, Democratic Republic of the</option><option value="CG">Congo, Republic of the</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote D\'ivoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="TP">East Timor</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Republic of Ireland</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KR">South Korea</option><option value="XK">Kosovo</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macau</option><option value="MK">Macedonia</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia</option><option value="MD">Moldova, Republic of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn Island</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="VC">Saint Vincent and the Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SH">St. Helena</option><option value="PM">St. Pierre and Miquelon</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SY">Syria</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks and Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB" selected="selected">United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VI">Virgin Islands (U.S.)</option><option value="WF">Wallis and Futuna Islands</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select>';
            }
            else {

              //selectbox
              signupFields += '<label class="visible-label" for="' + fieldName + '">' + k.label + '</label>';
              signupFields += '<select ' + validationTxt + ' class="w--input-field" name="' + fieldName + '" id="' + fieldName + '">';
              var optionFields = k.extra_def.options;
                //split options by breaking chars
                optionFields = optionFields.split('\r\n');

                //iterate through options
                $.each(optionFields, function(key, value) {
                  var radioArr = value.split('|');
                  //if value == key
                  if(radioArr.length > 1) {
                    signupFields += '<option value="' + radioArr[0] + '">' + radioArr[1] + '</option>';
                  }
                  else {
                    signupFields += '<option value="' + radioArr[0] + '">' + radioArr[0] + '</option>';
                  }
             });
            signupFields += '</select>';
          }
          break;
          case '4':
            //multiple checkboxes
            signupFields += '<p class="form-radio--label">' + k.label + '</p>';
            optionFields = k.extra_def.options;
            //split options by breaking chars
            optionFields = optionFields.split('\r\n');
            //iterate through options
            $.each(optionFields, function(key, value) {
              var radioArr = value.split('|'),
                  checkLabel = '';

              if(radioArr.length > 1) {
                checkLabel = radioArr[1];
              } else {
                checkLabel = radioArr[0];
              }
                signupFields += '<label class="visible-label" for="' + fieldName + '_' + key + '">' + checkLabel + '</label>';
                signupFields += '<input class="w--input-field" type="checkbox" name="' + fieldName + '[]" ' + validationTxt + ' value="' + radioArr[0] + '" id="' + fieldName + '_' + key + '" onclick="if(this.checked) { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'' + checkLabel + '\'; } else { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'\'; }" />';
                signupFields += '<input type="hidden" name="' + fieldName + '[' + key + ']" />';
            });
          break;
          case '5':
            //if radio buttons
            signupFields += '<p class="form-radio--label">' + k.label + '</p>';
            optionFields = k.extra_def.options;
            //split options by breaking chars
            optionFields = optionFields.split('\r\n');

            //iterate through options
            $.each(optionFields, function(key, value) {
              var radioArr = value.split('|'),
                  checkLabel = '';

              if(radioArr.length > 1) {
                checkLabel = radioArr[1];
              } else {
                checkLabel = radioArr[0];
              }


                signupFields += '<label class="visible-label" for="' + fieldName + '_' + key + '">' + checkLabel + '</label>';
              signupFields += '<input class="w--input-field" type="checkbox" name="' + fieldName + '[]" ' + validationTxt + ' value="' + radioArr[0] + '" id="' + fieldName + '_' + key + '" onclick="if(this.checked) { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'' + checkLabel + '\'; } else { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'\'; }" />';
                signupFields += '<input type="hidden" name="' + fieldName + '[' + key + ']" />';
            });
          break;
          case '6':
            //static text
            signupFields += '<p class="form-field-static">' + k.extra_def.text + '</p>';
          break;
          case '7':
            //if single checkbox
            if(k.extra_def.desc.length > 0 && k.label !== k.extra_def.desc) {
              signupFields += '<p class="checkbox-text">' + k.label + '</p>';
              signupFields += '<label  class="visible-label" for="' + fieldName + '">' + k.extra_def.desc + '</label>';
            }
            else {
              signupFields += '<label  class="visible-label" for="' + fieldName + '">' + k.label + '</label>';
            }
            signupFields += '<input class="w--input-field" type="checkbox" name="' + fieldName + '" ' + validationTxt + ' value="1" id="' + fieldName + '" />';
          break;
          case '8':
            //if sample upload file
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input  class="w--input-field" type="file" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
            signupFields += '<p class="desc">Max upload size: ' + k.extra_def.file_size + 'mb ';
          break;
          case '9':
            //autocomplete text box
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input  class="w--input-field" type="text" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          case '10':
            //if hidden type text
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input  class="w--input-field" type="hidden" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          default:
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input  class="w--input-field" type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          }

      },
      buildFields: function(k) {
        //reset fields
        var fieldType = 'text',
        extraClasses = '',
        fieldName = '',
        validationTxt = '';

        if(k.is_custom_field === '0') {
          if(k.description === 'Postal Code') {
            fieldName = 'zip';
          }
          else {
            fieldName = k.description.replace(/\s+/g, '').toLowerCase();
          }
        }
        else {
          fieldName = 'custom-' + k['@attributes'].id;
        }
        //check if it's a hidden field
        if(k.is_shown === '0') {
          fieldType = 'hidden';
          extraClasses = ' row-hidden';
        }

        //check if email type
        if(k.description === 'Email') {
          fieldType = 'email';
        }

        //check if required
        if(k.is_required === '1') {
          extraClasses += ' row-required';
          validationTxt = ' data-validate="presence" data-validateMsg="Please enter a valid ' + k.label + '" ';
        }

          signupFields += '<div class="form-row form-row--left ' + extraClasses + '">';
          Widgets.fieldType(k, fieldName, fieldType, validationTxt);
          signupFields += '</div>';


      },
      fetchFields: function() {

                      $.ajax({
                             url: s.fieldsURL,
                             method: 'GET',
                             data: { formID: $('#formID').val()},
                              success: function(data) {
                                data = JSON.parse(data);
                                var arr = $.makeArray( data );
                                signupFields = '';
                                arr = arr[0].signup_form_field;
                                //build input fields up
                                $.each(arr, function(i, k) {
                                  Widgets.buildFields(k);


                                  });
                                  signupFields += '<div class="form-row"><input type="submit" class="b--btn b--btn__submit" name="fetchform" value="Personalise form" /></div>';

                                  $('#customiseForm fieldset').html(signupFields);
                                  $('#fetchForm').hide();
                                  $('#tabbedBox').fadeIn();
                                  //populate and show edit form box
                                  $('.form-id--display').html($('#formID').val());
                                  $('.e--edit-form').show();

                                  //toggle field width functionality - simply add/remove a class to form rows when the toggle button is selected
                                   $('.form-row').on('click', function() {
                                      if($('.toggle-btn').hasClass('is-active')) {
                                        if($(this).hasClass('form-row--half')) {
                                          $(this).removeClass('form-row--half');
                                        }
                                        else {
                                          $(this).addClass('form-row--half');
                                        }
                                      }
                                   });


                                  //remove loading animation from submit button and remove disable
                                  $('#fetchForm .b--btn').removeClass('loading-animation').attr('disabled', false).css({cursor: 'pointer'});


                            },
                            error: function() {
                                //Something went so wrong
                            }
                        });
      },
      fieldSort: function() {
        //identify draggable fields
         $('#customiseForm fieldset').sortable({
            revert: true
          });

         $('#customiseForm fieldset').disableSelection();

         $('#customiseForm .form-row').on('mouseup', function() {
            $(this).removeClass('.is-dragging');
         });
         $('#customiseForm .form-row').on('mousedown', function() {
            $(this).addClass('is-dragging');
         });


         $('.toggle-btn').on('click', function() {
            if($(this).hasClass('is-active')) {
              $(this).removeClass('is-active');
              $(this).parent().removeClass('row-toggled');
            }
            else {
              $(this).addClass('is-active');
              $(this).parent().addClass('row-toggled');
            }
            return false;
         });


        $('#customiseForm .form-row').droppable({
          greedy: true,
          tolerance: 'pointer'
        });

      },

      copyClipboard: function(textbox) {

        // Create a "hidden" input
        var aux = document.createElement('input');
        // Assign it the value of the specified element
        aux.setAttribute('value', textbox);
        // Append it to the body
        document.body.appendChild(aux);
        // Highlight its content
        aux.select();
        // Copy the highlighted text
        document.execCommand('copy');
        // Remove it from the body
        document.body.removeChild(aux);

      },

      toggleBtn: function(el, btn) {
          if(el.val().length > 0) {
            btn.removeClass('btn-disabled');
          }
          else {
            btn.addClass('btn-disabled');
          }
      },
      formListener: function() {

      $('#personaliseForm form').on('submit', function(event) {
          event.preventDefault();

          //check that if thank you content is selected these fields have been completed
          if(($('#destination').val() === 'content') && ($('#thankyouHeader').val().length === 0 || $('#thankyouContent').val().length === 0 || $('#shareImg').val().length === 0)) {

            $('#shareImg').after('<p class="error form-missing">Please complete the highlighted fields.</p>');
            $('.required').addClass('invalid-fields');
            return false;
          }
          else if($('#destination').val() === 'url' && $('#thankyouURL').val().length === 0) {
            $('#thankyouURL').after('<p class="error form-missing">Please complete the highlighted fields.</p>');
            $('.required').addClass('invalid-fields');
            return false;
          }
          else {
            $('.required').removeClass('invalid-fields');
            $('.form-missing').remove();
          }
          //generate HTML
          Widgets.buildEmbedCode();
          $('#tabbedBox').tabs({ disabled: '' });
          //move to the next tab
          $('#tabbedBox').tabs( 'option', 'active', 2);

        });

        $('#formID').blur(function() {
          Widgets.toggleBtn($('#formID'), $('#fetchForm').find('input[type="submit"]'));
        });

        $('#formID').keydown(function() {
          Widgets.toggleBtn($('#formID'), $('#fetchForm').find('input[type="submit"]'));
        });

        $('#customiseForm').on('submit', 'form', function(event) {
            event.preventDefault();
            //move to the next tab
            $('#tabbedBox').tabs( 'option', 'active', 1);
        });

        //copy to clipboard functionality
        $('#generateForm').on('click', '.b--btn__submit', function (e) {
          e.preventDefault();
          var copyTextarea = $(this).data('copy');

          Widgets.copyClipboard($('#' + copyTextarea).val());
          $(this).val('Copied to clipboard');

          setTimeout(function(){
             $(this).val('Copy to clipboard');
          }, 5000);
          return false;
        });

        $('body').on('blur', '.invalid-fields', function() {
          if($(this).length > 0) {
            $(this).removeClass('invalid-fields');
          }
          else {
            $(this).addClass('invalid-fields');
          }
        });

      },
      bindUIActions: function() {
        //disable the form button until necessary fields are populate
        $('#fetchForm').find('input[type="submit"]').addClass('btn-disabled');

        $('#tabbedBox').tabs({ disabled: [2] } );
        //$('#personaliseForm form').accordion();
        $('.picker').spectrum({
            showInput: true,
            className: 'full-spectrum',
            showInitial: false,
            showPalette: true,
            showSelectionPalette: true,
            maxSelectionSize: 10,
            preferredFormat: 'hex',
              palette: [
                  ['rgb(227,6,19)', 'rgb(45, 53, 61)', 'rgb(231, 55, 85)', 'rgb(58, 85, 175)',
                  'rgb(76, 98, 108)']
              ]
          });
      }
    };
    Widgets.init();
    Widgets.formListener();
    Widgets.fetchForm();
    Widgets.editForm();
    Widgets.personaliseForm();
    Widgets.fieldSort();


})(jQuery);
