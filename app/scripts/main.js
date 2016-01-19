/*global jQuery:false */

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
      signupJS: function() {
        $('.apiform').bsdSignup({no_redirect:true}).on('bsd-success',function(e, response){
          console.log('submission success',response);
          /* do something to celebrate your success other than redirecting the user */
        });
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

        //TO DO: Could this be a class?
        $('#personaliseForm .hide-row').hide();

        //if thankyou option selected then show extra options
        $('#destination').on('change', function() {
          if($(this).val() === 'content') {
            $('.hide-row').show();
          }
        });
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
        var embedCSS = '<style type="text/css"> .signup-wrapper a { color: ' + $('#linkColour').val() + '  } .form-row--half input, .form-row--half select { width:100%; } .row-hidden {display:none!important;} .form-row--half { display: inline;  float: left;  width: 47.5609756098%;  margin: 0 1.2195121951%; } .signup-wrapper  { color: ' + $('#textColour').val() + '; background: url(' + $('#bgImg').val() + ') no-repeat ' + $('#bgColour').val() + '; background-size:cover; } .signup-wrapper input, .signup-wrapper textarea .signup-wrapper select { padding: ' + inputPadd + '; margin: ' + inputMargin + '; } </style>';


        //build the js
        //will include signup API call
        var embedJS = '!function(e,t,r){function n(e){var t=document.createElement("a");return t.href=e,t}function i(t){var r="No response from sever";if(t&&t.responseJSON)return t.responseJSON;try{return e.parseJSON(t.responseText)}catch(n){return{status:"fail",code:503,message:r,error:r}}}function s(t){return t&&"success"===t.status?t:e.Deferred().rejectWith(this,[t])}function a(e,t,r){e.one("change keyup",function(){e.val()!==r&&t.setCustomValidity("")})}function o(e){this.trigger("bsd-success",[e]),this.data("no_redirect")!==!0&&e.thanks_url&&(t=e.thanks_url)}function u(t){var r=this,n=!1,i={};t&&t.field_errors&&t.field_errors.length&&(e.each(t.field_errors,function(e,s){var o=r.find(\'[name="\'+s.field+\'"]\'),u=o.get()[0];"submit-btn"===s.field?t.message=s.message:u&&u.setCustomValidity&&f&&r.data("no_html5validate")!==!0&&(u.setCustomValidity(s.message),a(o,u,s.message),n=!0),s.$field=o,i[s.field]=s.message,o.trigger("invalid",s.message)}),n&&f&&r.find(\'[type="submit"],[type="image"]\').eq(0).click()),r.trigger("bsd-error",[t,i])}function c(r,a,c){return function(l){var f=r.serializeObject(),d=a.replace(/\/page\/(signup|s)/,"/page/sapi"),p=e.ajax({url:d,type:"POST",method:"POST",dataType:"json",timeout:c.timeout||3e4,context:r,data:f,beforeSend:function(r,i){if(c.proxyall||i.crossDomain&&!e.support.cors&&(!e.oldiexdr||n(i.url).protocol!==t.protocol)){if(!c.oldproxy&&!c.proxyall)return!1;i.url=c.oldproxy||c.proxyall,i.crossDomain=!1,i.data+="&purl="+d}l.preventDefault()}});"canceled"!==p.statusText&&(r.trigger("bsd-submit",f),p.then(s,i).done(o).fail(u))}}function l(t,r,n){var i,s=t.find(\'[name="\'+r+\'"]\');s.length||(s=e("<input/>",{type:"hidden",name:r}).appendTo(t)),n&&(i=s.val(),s.val((""!==i?i+",":"")+n))}e.fn.serializeObject=function(){var t={},n=this.serializeArray();return e.each(n,function(){t[this.name]!==r?(t[this.name].push||(t[this.name]=[t[this.name]]),t[this.name].push(this.value||"")):t[this.name]=this.value||""}),t};var f="reportValidity"in e("<form/>").get()[0],d=function(e){var r=new RegExp("[\\?&]"+e.replace(/(\[|\])/g,"\\$1")+"=([^&#]*)"),n=r.exec(t.href);return null===n?"":n[1]},p="source",m="subsource",h=d(p)||d("fb_ref"),g=d(m);e.fn.bsdSignup=function(t){return this.each(function(){var r=e(this),n=r.attr("action");r.is("form")&&n.indexOf("page/s")>-1&&(l(r,p,h),l(r,m,g),e.isPlainObject(t)?r.data(t):t={},r.on("submit",c(r,n,t)))})}}(jQuery,window.location);';


        embedJS += '<script type="text/javascript">jQuery(".apiform").bsdSignup({no_redirect:true}).on("bsd-success",function(e, response){ });</script>';

        //build the html
        var embedHTML = '<div class="bsd-embed-form widgetainer widget-styled">';

        //TODO: add absolute URL before action

        embedHTML += '<form name="' + signupInfo.signup_form_name + '" class="apiform" action="' + signupInfo.signup_form_slug + '" method="post" id="' + signupInfo.signup_form_id + '">';

        embedHTML += $('#customiseForm form').html();
        //TODO: add submit button

        embedHTML += '</form>';
        embedHTML += '</div>';

        wrapperHTML += '<div class="signup-wrapper">';
        //only show logo if it exists
        if($('#logo').val().length > 0) {
          wrapperHTML += '<div class="signup-logo" style="text-align: ' + $('#logoAlignment').val() + ';"><img src="' + $('#logo').val() + '" alt="logo" /></div>';
        }
        wrapperHTML += embedHTML;
        wrapperHTML += '</div>';

        $('#generateForm textarea').val(embedCSS + embedJS + wrapperHTML);


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
          signupFields += '<input type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          case '2':
          //if textarea
          signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
          signupFields += '<textarea ' + validationTxt + ' name="' + fieldName + '">' + k.label + '</textarea>';
          break;
          case '3':
            //selectbox
            if(k.label === 'Country') {
              signupFields += '<label class="visible-label" for="country">Country</label>';
              signupFields += '<select id="country" name="country"><option value=""></option><option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BR">Brazil</option><option value="VG">British Virgin Islands</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CO">Colombia</option><option value="KM">Comoros Islands</option><option value="CD">Congo, Democratic Republic of the</option><option value="CG">Congo, Republic of the</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote D\'ivoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="TP">East Timor</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Republic of Ireland</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KR">South Korea</option><option value="XK">Kosovo</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macau</option><option value="MK">Macedonia</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia</option><option value="MD">Moldova, Republic of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn Island</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="VC">Saint Vincent and the Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SH">St. Helena</option><option value="PM">St. Pierre and Miquelon</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SY">Syria</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks and Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB" selected="selected">United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VI">Virgin Islands (U.S.)</option><option value="WF">Wallis and Futuna Islands</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select>';
            }
            else {

              //selectbox
              signupFields += '<label class="visible-label" for="' + fieldName + '">' + k.label + '</label>';
              signupFields += '<select ' + validationTxt + ' name="' + fieldName + '" id="' + fieldName + '">';
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
              var radioArr = value.split('|');
              signupFields += '<label class="visible-label" for="' + fieldName + '' + radioArr[1] + '">' + radioArr[1] + '</label>';
              signupFields += '<input type="checkbox" name="' + fieldName + '[]" ' + validationTxt + ' value="' + radioArr[0] + '" id="' + fieldName + '' + radioArr[1] + '" />';
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
              var radioArr = value.split('|');
              signupFields += '<label class="visible-label" for="' + fieldName + '' + radioArr[1] + '">' + radioArr[1] + '</label>';
              signupFields += '<input type="radio" name="' + fieldName + '[]" ' + validationTxt + '  value="' + radioArr[0] + ' " id="' + fieldName + ' ' + radioArr[1] + '" />';
            });
          break;
          case '6':
            //static text
            signupFields += '<p class="form-field-static">' + k.extra_def.text + '</p>';
          break;
          case '7':
            //if single checkbox
            signupFields += '<label  class="visible-label" for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<p class="checkbox-text">' + k.extra_def.desc + '</p>';
            signupFields += '<input type="checkbox" name="' + fieldName + '" ' + validationTxt + ' value="1" id="' + fieldName + '" />';
          break;
          case '8':
            //if sample upload file
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input type="file" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
            signupFields += '<p class="desc">Max upload size: ' + k.extra_def.file_size + 'mb ';
          break;
          case '9':
            //autocomplete text box
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input type="text" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          case '10':
            //if hidden type text
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input type="hidden" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          break;
          default:
            signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
            signupFields += '<input type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' placeholder="' + k.label + '" id="' + fieldName + '" />';
          }

      },
      buildFields: function(k) {
        //reset fields
        var fieldType = 'text',
        extraClasses = '',
        fieldName = '',
        validationTxt = '';

        if(k.is_custom_field === 0) {
          fieldName = k.description.replace(/\s+/g, '').toLowerCase();
        }
        else {
          fieldName = 'custom_' + k['@attributes'].id;
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

         //TODO: Better language around the toggle btn

         $('.toggle-btn').on('click', function() {
            if($(this).hasClass('is-active')) {
              $(this).removeClass('is-active');
            }
            else {
              $(this).addClass('is-active');
            }
            return false;
         });


        $('#customiseForm .form-row').droppable({
          greedy: true,
          tolerance: 'pointer'
        });

      },

      copyClipboard: function() {

        // Create a "hidden" input
        var aux = document.createElement('input');
        // Assign it the value of the specified element
        aux.setAttribute('value', document.getElementById('embedTextbox').value);
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
        $('#generateForm').on('click', '.b--btn__submit', function () {
          Widgets.copyClipboard( $('#generateForm textarea').val() );
          $(this).val('Copied to clipboard');
          return false;
        });

      },
      bindUIActions: function() {
        //disable the form button until necessary fields are populate
        $('#fetchForm').find('input[type="submit"]').addClass('btn-disabled');

        $('#tabbedBox').tabs({ disabled: [2] } );
        //$('#personaliseForm form').accordion();
        $('.picker').spectrum({
            color: '#e30613',
            showInput: true,
            className: 'full-spectrum',
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            maxSelectionSize: 10,
            preferredFormat: 'hex',
              palette: [
                  ['rgb(45, 53, 61)', 'rgb(231, 55, 85)', 'rgb(58, 85, 175)',
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
