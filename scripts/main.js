/*global jQuery:false */

/* TO DO
 seperate out into modules
 */
(function ($) {
    'use strict';

    var s,
        signupInfo,
        wrapperHTML = '',
        signupFields,
        Widgets = {
        settings: {
            formURL: './server/form.php',
            fieldsURL: './server/fields.php'
        },

        init: function () {
            s = this.settings;
            Widgets.bindUIActions();
        },
        validate: function (el) {

            var flagValidation = 0;
            var msgValidation = '';
            //check for presence
            $('.form-error').remove();
            if (el.data('validate').indexOf('presence') >= 0) {
                if (!el.val()) {
                    flagValidation = 1;
                    //put in template
                    msgValidation = '<p class="error">' + el.data('validatemsg') + '</p>';
                }
            }

            if (el.data('validate').indexOf('numeric') >= 0) {
                if (!$.isNumeric(el.val())) {
                    flagValidation = 1;
                    //put in template
                    msgValidation = '<p class="error form-error">' + el.data('validatemsg') + '</p>';
                }
            }

            if (flagValidation > 0) {
                el.after(msgValidation);
                return false;
            } else {
                return true;
            }
        },
        personaliseForm: function () {

            $('#personaliseForm .hide-row').hide();

            //if thankyou option selected then show extra options
            $('#destination').on('change', function () {
                if ($(this).val() === 'content') {
                    $('.hide-row').show();
                    $('.thankyouurl-row').hide();
                    //rte init

                    $('#thankyouContent').easyEditor({
                        buttons: ['bold', 'italic', 'link', 'h3', 'h4', 'h5', 'alignleft', 'aligncenter', 'alignright', 'list', 'x', 'source']
                    });

                    var elem = $('.countdown');
                    if ($('.message').length > 0) {
                        $('.message').limiter(140, elem);
                    }
                } else {
                    $('.thankyouurl-row').show();
                    $('.hide-row').hide();
                }
            });
        },
        thankyouCode: function () {

            var shareCode = '';
            var formpostCode = '';

            var shareText = encodeURIComponent($('#shareTweet').val().trim());

            var thankyouCode = '<div class="thankyou-content">' + $('#thankyouContent').val() + '</div>';

            if ($('#formEntry').is(':checked')) {
                formpostCode = '<div class="form-post"><p>Thank you for submitting the following information:</p>';
                jQuery('#speakout_form input').each(function (i, data) {
                    var txt = jQuery(data).parent().parent().find('label').text();
                    formpostCode += '<p>' + txt + ' : ' + jQuery(data).val() + '</p>';
                });
                formpostCode += '</div>';
            }

            if ($('#shareImg').val().length > 0) {
                shareCode = '<div class="share-content"><img src="' + $('#shareImg').val() + '" alt="share this page" /><div class="social-share"><a href="https://www.facebook.com/sharer/sharer.php?u=' + $('#sharePage').val() + '" class="fb-btn" target="_blank">Share on Facebook</a><a href="https://twitter.com/home?status=' + shareText + '" class="tw-btn"  target="_blank">Share on Twitter</a></div></div>';
            }

            return thankyouCode + formpostCode + shareCode;
        },
        addDB: function (embedJS, embedHTML, thankyouURL) {
            $.ajax({
                url: './server/connect.php',
                type: 'post',
                data: { type: 'insert', JS: embedJS, HTML: embedHTML, thankyouURL: thankyouURL, signupID: signupInfo.signup_form_id, signupInfo: signupInfo },
                success: function (data) {
                    var token = data;

                    jQuery('.wb--btn__submit__widget').attr('href', 'preview.html?tkn=' + token);
                    jQuery('#generateForm #embedScript').val('<script type="text/javascript" id="widget-generator">   var link = document.createElement( "link" );     link.href = "//widget.www.test.which-testing.co.uk/styles/bsd-widget.css";      link.type = "text/css";      link.rel = "stylesheet";      link.media = "screen,print";      document.getElementsByTagName( "head" )[0].appendChild( link );   (function() {        function async_load(){          var s = document.createElement("script");          s.type = "text/javascript";          s.async = true;          var theUrl = "https://widget.www.test.which-testing.co.uk/scripts/bsd-widget.js";          s.src = theUrl;          var embedder = document.getElementById("w-embed");   var token = "' + token + '"; embedder.setAttribute("data-token", token);   embedder.parentNode.insertBefore(s, embedder);        }        if (window.attachEvent)          window.attachEvent("onload", async_load);        else          window.addEventListener("load", async_load, false);      })();    </script><div id="w-embed"></div>');
                }
            });
        },
        buildEmbedCode: function () {

            //build the js
            //will include signup API call
            var embedJS = '';

            embedJS += 'jQuery(document).ready(function() { jQuery(".thankyou-wrapper").hide();';

            embedJS += 'jQuery(".apiform").bsdSignup({no_redirect:true}).on("bsd-success",function(e, response){ e.preventDefault();';

            //if redirect to URL build script to redirect window to set URL
            if ($('#formEntry').is(':checked')) {
                embedJS += ' var postedHTML = ""; jQuery(".apiform .form-row").not(".row-hidden").each(function(index) { if($(this).find(".form-radio--label").length > 0) {      var postedLabel = $(this).find(".form-radio--label").text();  }    else if ($(this).find("label").length > 0) {      var postedLabel = $(this).find("label").text(); } else { var postedLabel = ""; }  var postedInput = $(this).find(":input").val(); if(postedInput.length > 0 && postedLabel.length > 0) {  postedHTML += postedLabel + " : " + postedInput + "<br />";    }  });';
                embedJS += ' jQuery(".thankyou-content").append(\'<p class="wg-form-posted">\' + postedHTML + \'</p>\');';
            }
            if ($('#destination').val() === 'url') {
                embedJS += ' window.location.replace("' + jQuery('#thankyouURL').val() + '"); ';
            } else {
                //if show thankyou content, hide the form on success and show thank you content
                embedJS += ' jQuery(".apiform").hide(); jQuery(".thankyou-wrapper").show(); ';
            }
            embedJS += '});});';

            //build the html


            var embedHTML = '<div class="campaign-header"><div class="wWrapper"><h2>' + jQuery('#form_title').val() + '</h2>';

            if (jQuery('#form_intro').val().length > 0 || jQuery('#form_signatures').is(':checked')) {

                embedHTML += '<div class="bsd-embed-intro ">';

                if (jQuery('#form_intro').val().length > 0) {
                    embedHTML += '' + jQuery('#form_intro').val() + '<br />';
                }

                if (jQuery('#form_signatures').is(':checked')) {
                    if (jQuery('#target_signatures').val().length > 0) {
                        embedHTML += '<div class="supporter_count"><span class="figure group" style="display: block;" id="signup_counter">0</span><div class="progress-bar" data-target="' + jQuery('#target_signatures').val() + '" style="display: block;"><div class="progress" style="width: 0%;"></div></div> Petition Signatures</div>';
                    } else {
                        embedHTML += '<div class="supporter_count"><span class="figure group" id="signup_counter">0</span> Petition Signatures</div>';
                    }
                }

                if (jQuery('#form_cta').val().length > 0) {
                    embedHTML += '<div class="btn btn-primary expand-petition"><span>' + jQuery('#form_cta').val() + '</span></div>';
                } else {

                    embedHTML += '<div class="btn btn-primary expand-petition"><span>Sign the petition</span></div>';
                }
                embedHTML += '</div></div>';

                embedHTML += '<div class="bsd-embed-form widgetainer widget-styled">';
            } else {

                embedHTML += '<div class="bsd-embed-form widgetainer widget-styled expanded-form">';
            }

            embedHTML += '<form name="' + signupInfo.signup_form_name + '" class="apiform" action="' + $('#branch').val() + '/page/s/' + signupInfo.signup_form_slug + '" method="post" id="' + signupInfo.signup_form_id + '">';
            embedHTML += '<input type="hidden" name="signup_form_id" value="' + signupInfo.signup_form_id + '" />';
            embedHTML += '<input type="hidden" name="source" value="" id="bsd_widget_source" />';

            var currForm = $('#customiseForm form').html().split('<div class="form-row--submit">');
            var optinTxt = '<div class="form-row"><input id="email_opt_in" name="email_opt_in" type="checkbox" value="1" ><label for="email_opt_in">' + signupInfo.email_opt_in_label + '</label></div><div class="form-row--submit">';

            embedHTML += currForm[0];
            embedHTML += optinTxt;
            embedHTML += currForm[1];

            embedHTML = embedHTML.replace('name="address"', 'name="addr1');
            embedHTML = embedHTML.replace('Personalise form', jQuery('#form_btn').val());
            embedHTML = embedHTML.replace('requiredplaceholder', 'required aria-required="true"');
            embedHTML += '</form>';
            embedHTML += '</div>';

            wrapperHTML += '<div class="signup-wrapper">';
            //only show logo if it exists
            //if($('#logo').val().length > 0) {
            //wrapperHTML += '<div class="signup-logo" style="text-align: ' + $('#logoAlignment').val() + ';"><img src="' + $('#logo').val() + '" alt="logo" /></div>';
            //}

            wrapperHTML += embedHTML;

            if ($('#destination').val() !== 'url') {
                var tyCode = Widgets.thankyouCode();
                wrapperHTML += '<div class="thankyou-wrapper">' + tyCode + '</div>';
            }

            wrapperHTML += '</div>';

            if ($('#destination').val() === 'url') {
                var thankyouURL = jQuery('#thankyouURL').val();
            }

            Widgets.addDB(embedJS, wrapperHTML, thankyouURL);

            embedJS = '';
            wrapperHTML = '';
        },
        editForm: function () {

            //on site load should be hidden
            $('.e--edit-form').hide();

            $('.e--edit-form').on('click', 'a', function (event) {

                event.preventDefault();

                $('.e--edit-form').hide();
                $('#tabbedBox').hide();
                $('#fetchForm').fadeIn();
            });
        },
        fetchForm: function () {

            $('#fetchForm').on('submit', 'form', function (event) {
                event.preventDefault();

                //remove form missing message
                $('p.form-missing').remove();
                //validate input
                var formValidates = Widgets.validate($('#formID'));

                if (formValidates === false) {
                    return false;
                }

                Widgets.resetBtn();
                $.ajax({
                    url: s.formURL,
                    method: 'GET',
                    data: { formID: $('#formID').val(), branch: $('#branch').val() },
                    success: function (data) {
                        data = JSON.parse(data);
                        var arr = $.makeArray(data);
                        signupInfo = arr[0].signup_form;
                        Widgets.populateFields();
                        Widgets.fetchFields();
                    },
                    error: function () {
                        //Something went so wrong
                        $('#formID').after('<p class="error form-missing">I am sorry this signup form does not exist within this branch in the Blue State Digital Tools.</p>');
                        //reset button
                        Widgets.resetBtn();
                        return false;
                    }
                });
            });
        },
        populateFields: function () {
            jQuery('#form_title').val(signupInfo.form_public_title);
            if (typeof signupInfo.form_html_top === 'string') {
                jQuery('#form_intro').val(signupInfo.form_html_top);
            }
            if (typeof signupInfo.submit_button_label === 'string') {
                jQuery('#form_btn').val(signupInfo.submit_button_label);
            }
            jQuery('#thankyouContent').val(signupInfo.thank_you_html);

            CKEDITOR.replace('form_intro');
            CKEDITOR.replace('thankyouContent');
        },
        fieldType: function (k, fieldName, fieldType, validationTxt) {
            //there are a variety of different field types the tools can return this runs through them and builds out the HTML to be sympathetic to the Tools setup
            switch (k.format) {
                case '1':
                    //if input type text
                    signupFields += '<label for="' + fieldName + '">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</label>';
                    signupFields += '<input class="w--input-field" type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' id="' + fieldName + '" />';
                    break;
                case '2':
                    //if textarea
                    signupFields += '<label for="' + fieldName + '">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</label>';
                    signupFields += '<textarea class="w--input-field" ' + validationTxt + ' name="' + fieldName + '"></textarea>';
                    break;
                case '3':
                    //selectbox
                    if (k.label === 'Country') {
                        signupFields += '<label class="visible-label visible-label--select" for="country">Country';
                        if (k.is_required === 1 || k.is_required === '1') {
                            signupFields += '*';
                        }
                        signupFields += '</label>';

                        signupFields += '<select  class="w--input-field" id="country" name="country"><option value=""></option><option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BR">Brazil</option><option value="VG">British Virgin Islands</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CO">Colombia</option><option value="KM">Comoros Islands</option><option value="CD">Congo, Democratic Republic of the</option><option value="CG">Congo, Republic of the</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote D\'ivoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="TP">East Timor</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Republic of Ireland</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KR">South Korea</option><option value="XK">Kosovo</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macau</option><option value="MK">Macedonia</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia</option><option value="MD">Moldova, Republic of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn Island</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="VC">Saint Vincent and the Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SH">St. Helena</option><option value="PM">St. Pierre and Miquelon</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SY">Syria</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks and Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB" selected="selected">United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VI">Virgin Islands (U.S.)</option><option value="WF">Wallis and Futuna Islands</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select>';
                    } else {

                        //selectbox
                        signupFields += '<label class="visible-label  visible-label--select" for="' + fieldName + '">' + k.label;
                        if (k.is_required === 1 || k.is_required === '1') {
                            signupFields += '*';
                        }
                        signupFields += '</label>';
                        signupFields += '<select ' + validationTxt + ' class="w--input-field" name="' + fieldName + '" id="' + fieldName + '">';
                        var optionFields = k.extra_def.options;
                        //split options by breaking chars
                        optionFields = optionFields.split('\r\n');

                        //iterate through options
                        $.each(optionFields, function (key, value) {
                            var radioArr = value.split('|');
                            //if value == key
                            if (radioArr.length > 1) {
                                signupFields += '<option value="' + radioArr[0] + '">' + radioArr[1] + '</option>';
                            } else {
                                signupFields += '<option value="' + radioArr[0] + '">' + radioArr[0] + '</option>';
                            }
                        });
                        signupFields += '</select>';
                    }
                    break;
                case '4':
                    //multiple checkboxes
                    signupFields += '<p class="form-radio--label">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</p>';
                    optionFields = k.extra_def.options;
                    //split options by breaking chars
                    optionFields = optionFields.split('\r\n');
                    //iterate through options
                    $.each(optionFields, function (key, value) {
                        var radioArr = value.split('|'),
                            checkLabel = '';

                        if (radioArr.length > 1) {
                            checkLabel = radioArr[1];
                        } else {
                            checkLabel = radioArr[0];
                        }
                        signupFields += '<div class="form-row--checkbox"><label class="visible-label" for="' + fieldName + '_' + key + '">' + checkLabel + '</label>';
                        signupFields += '<input class="w--input-field" type="checkbox" name="' + fieldName + '[]" ' + validationTxt + ' value="' + radioArr[0] + '" id="' + fieldName + '_' + key + '" onclick="if(this.checked) { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'' + checkLabel + '\'; } else { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'\'; }" />';
                        signupFields += '<input type="hidden" name="' + fieldName + '[' + key + ']" /></div>';
                    });
                    break;
                case '5':
                    //if radio buttons
                    signupFields += '<p class="form-radio--label">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</p>';
                    optionFields = k.extra_def.options;
                    //split options by breaking chars
                    optionFields = optionFields.split('\r\n');

                    //iterate through options
                    $.each(optionFields, function (key, value) {
                        var radioArr = value.split('|'),
                            checkLabel = '';

                        if (radioArr.length > 1) {
                            checkLabel = radioArr[1];
                        } else {
                            checkLabel = radioArr[0];
                        }

                        signupFields += '<div class="form-row--radio"><label class="visible-label" for="' + fieldName + '_' + key + '">' + checkLabel + '</label>';
                        signupFields += '<input class="w--input-field" type="radio" name="' + fieldName + '[]" ' + validationTxt + ' value="' + radioArr[0] + '" id="' + fieldName + '_' + key + '" onclick="if(this.checked) { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'' + checkLabel + '\'; } else { this.form[\'' + fieldName + '[' + key + ']' + '\'].value=\'\'; }" />';
                        signupFields += '<input type="hidden" name="' + fieldName + '[' + key + ']" /></div>';
                    });
                    break;
                case '6':
                    //static text
                    signupFields += '<p class="form-field-static">' + k.extra_def.text + '</p>';
                    break;
                case '7':
                    //if single checkbox
                    if (k.extra_def.desc.length > 0 && k.label !== k.extra_def.desc) {
                        signupFields += '<div class="form-row--checkbox"><p class="checkbox-text">' + k.label;
                        if (k.is_required === 1 || k.is_required === '1') {
                            signupFields += '*';
                        }
                        signupFields += '</p>';
                        signupFields += '<label  class="visible-label" for="' + fieldName + '">' + k.extra_def.desc + '</label>';
                    } else {
                        signupFields += '<label  class="visible-label" for="' + fieldName + '">' + k.label + '</label>';
                    }
                    signupFields += '<input class="w--input-field" type="checkbox" name="' + fieldName + '" ' + validationTxt + ' value="1" id="' + fieldName + '" /></div>';
                    break;
                case '8':
                    //if sample upload file
                    signupFields += '<label for="' + fieldName + '">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</label>';
                    signupFields += '<input  class="w--input-field" type="file" name="' + fieldName + '" ' + validationTxt + ' id="' + fieldName + '" />';
                    signupFields += '<p class="desc">Max upload size: ' + k.extra_def.file_size + 'mb ';
                    break;
                case '9':
                    //autocomplete text box
                    signupFields += '<label for="' + fieldName + '">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</label>';
                    signupFields += '<input  class="w--input-field" type="text" name="' + fieldName + '" ' + validationTxt + ' id="' + fieldName + '" />';
                    break;
                case '10':
                    //if hidden type text
                    signupFields += '<label for="' + fieldName + '">' + k.label + '</label>';
                    signupFields += '<input  class="w--input-field" type="hidden" name="' + fieldName + '" ' + validationTxt + ' id="' + fieldName + '" />';
                    break;
                default:
                    signupFields += '<label for="' + fieldName + '">' + k.label;
                    if (k.is_required === 1 || k.is_required === '1') {
                        signupFields += '*';
                    }
                    signupFields += '</label>';
                    signupFields += '<input  class="w--input-field" type="' + fieldType + '" name="' + fieldName + '" ' + validationTxt + ' id="' + fieldName + '" />';
            }
        },
        buildFields: function (k) {
            //reset fields
            var fieldType = 'text',
                extraClasses = '',
                fieldName = '',
                validationTxt = '';

            if (k.is_custom_field === '0') {
                if (k.description === 'Postal Code') {
                    fieldName = 'zip';
                } else {
                    fieldName = k.description.replace(/\s+/g, '').toLowerCase();
                }
            } else {
                fieldName = 'custom-' + k['@attributes'].id;
            }
            //check if it's a hidden field
            if (k.is_shown === '0') {
                fieldType = 'hidden';
                extraClasses = ' row-hidden';
            }

            //check if email type
            if (k.description === 'Email') {
                fieldType = 'email';
            }

            //check if required
            if (k.is_required === '1') {
                extraClasses += ' row-required';
                validationTxt = ' data-validate="presence" requiredplaceholder data-validateMsg="Please enter a valid ' + k.label + '" ';
            }

            signupFields += '<div class="form-row form-row--left ' + extraClasses + '">';
            Widgets.fieldType(k, fieldName, fieldType, validationTxt);
            signupFields += '</div>';
        },
        resetBtn: function () {
            if ($('#fetchForm .b--btn').hasClass('loading')) {
                //remove loading animation from submit button and remove disable
                $('#fetchForm .b--btn').removeClass('loading').val('Fetch form').attr('disabled', false).css({ cursor: 'pointer' });
            } else {
                $('#fetchForm .b--btn').addClass('loading').val('Loading...').attr('disabled', true).css({ 'cursor': 'default' });
            }
        },
        fetchFields: function () {

            $.ajax({
                url: s.fieldsURL,
                method: 'GET',
                data: { formID: $('#formID').val(), branch: $('#branch').val() },
                success: function (data) {
                    data = JSON.parse(data);
                    var arr = $.makeArray(data);
                    signupFields = '';
                    arr = arr[0].signup_form_field;
                    //build input fields up

                    //The tools returns the field order a bit messed up - custom fields mixed amongst standard lets ensure that the std fields are always shown first
                    var customArr = arr.filter(function (ar) {
                        return ar.is_custom_field === '1';
                    });

                    arr = arr.filter(function (ar) {
                        return ar.is_custom_field === '0';
                    });

                    $.each(arr, function (i, k) {
                        Widgets.buildFields(k);
                    });

                    $.each(customArr, function (i, k) {
                        Widgets.buildFields(k);
                    });

                    $('#customiseForm .sortable-rows').html(signupFields);
                    $('.row-hidden').remove();
                    $('#fetchForm').hide();
                    $('#tabbedBox').fadeIn();
                    //populate and show edit form box
                    $('.form-id--display').html($('#formID').val());
                    $('.e--edit-form').show();

                    //toggle field width functionality - simply add/remove a class to form rows when the toggle button is selected
                    $('#customiseForm .form-row').on('click', function () {
                        if ($('.l-customise--step2').hasClass('current-step')) {
                            if ($(this).hasClass('form-row--half')) {
                                $(this).removeClass('form-row--half');
                            } else {
                                $(this).addClass('form-row--half');
                            }
                        }
                    });
                    Widgets.resetBtn();
                },
                error: function () {
                    //Something went so wrong
                }
            });
        },
        fieldSort: function () {
            //identify draggable fields
            $('#customiseForm .sortable-rows').sortable({
                revert: true,
                start: function () {}
            });

            $('#customiseForm .sortable-rows').disableSelection();

            $('#customiseForm .form-row').on('mouseup', function () {
                $(this).removeClass('.is-dragging');
                return false;
            });
            $('#customiseForm .form-row').on('mousedown', function () {
                $(this).addClass('is-dragging');
                return false;
            });

            $('#customiseForm .form-row').droppable({
                greedy: true,
                tolerance: 'pointer'
            });
        },

        copyClipboard: function (textbox) {

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

        toggleBtn: function (el, btn) {
            if (el.val().length > 0) {
                btn.removeClass('btn-disabled');
            } else {
                btn.addClass('btn-disabled');
            }
        },
        formListener: function () {

            $('#personaliseForm form').on('submit', function (event) {
                event.preventDefault();

                //check that if thank you content is selected these fields have been completed
                if ($('#destination').val() === 'content' && $('#thankyouContent').val().length === 0) {

                    $('.fieldset--submit').before('<p class="error form-missing">Please complete the highlighted fields.</p>');
                    $('.required').addClass('invalid-fields');
                    return false;
                } else if ($('#destination').val() === 'url' && $('#thankyouURL').val().length === 0) {
                    $('#thankyouURL').after('<p class="error form-missing">Please complete the highlighted fields.</p>');
                    $('.required').addClass('invalid-fields');
                    return false;
                } else {
                    $('.required').removeClass('invalid-fields');
                    $('.form-missing').remove();
                }
                //generate HTML
                Widgets.buildEmbedCode();
                $('#tabbedBox').tabs({ disabled: '' });
                //move to the next tab
                $('#tabbedBox').tabs('option', 'active', 2);
                $('html, body').animate({
                    scrollTop: 0
                }, 100);
                return false;
            });

            $('#formID').blur(function () {
                Widgets.toggleBtn($('#formID'), $('#fetchForm').find('input[type="submit"]'));
            });

            $('#formID').keydown(function () {
                Widgets.toggleBtn($('#formID'), $('#fetchForm').find('input[type="submit"]'));
            });

            $('#customiseForm').on('submit', 'form', function (event) {
                event.preventDefault();
                //move to the next tab
                $('#tabbedBox').tabs('option', 'active', 1);

                $('html, body').animate({
                    scrollTop: 0
                }, 100);
                return false;
            });

            //copy to clipboard functionality
            $('#generateForm').on('click', '.b--btn__submit', function (e) {
                e.preventDefault();
                var copyTextarea = $(this).data('copy');

                Widgets.copyClipboard($('#' + copyTextarea).val());
                $(this).val('Copied to clipboard');

                setTimeout(function () {
                    $(this).val('Copy to clipboard');
                }, 5000);
                return false;
            });

            $('body').on('blur', '.invalid-fields', function () {
                if ($(this).length > 0) {
                    $(this).removeClass('invalid-fields');
                } else {
                    $(this).addClass('invalid-fields');
                }
            });
        },
        customiseFormSetup: function () {
            $('.l-customise--step2').hide();
            $('#customiseSubmit').val('Happy? Continue to the next step').addClass('btn-step-2');

            $('.l-customise--step1 h4').on('click', function () {

                $('.l-customise--step2').hide().removeClass('current-step');
                $('.l-customise--step1').show().addClass('current-step');
                $('html, body').animate({
                    scrollTop: 0
                }, 100);

                $(this).parent().parent().removeClass('row-toggled');
                $('#customiseForm .sortable-rows').sortable({
                    revert: true,
                    start: function () {}
                });
                $('#customiseSubmit').val('Happy? Continue to the next step').addClass('btn-step-2');

                return false;
            });

            $('#customiseForm').on('click', '.btn-step-2', function () {

                $(this).val('Personalise form').removeClass('btn-step-2');
                $('.l-customise--step1').removeClass('current-step');
                $('.l-customise--step2').show().addClass('current-step');

                $('#customiseForm .sortable-rows').sortable('destroy');
                $('html, body').animate({
                    scrollTop: 0
                }, 100);

                $(this).parent().parent().addClass('row-toggled');

                return false;
            });
        },
        bindUIActions: function () {

            //disable the form button until necessary fields are populate
            $('#fetchForm').find('input[type="submit"]').addClass('btn-disabled');

            $('#personaliseForm').on('click', 'h3', function () {

                if ($(this).find('span').hasClass('icon-chevron-up')) {
                    $(this).find('span').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                    $(this).next().removeClass('active-content');
                } else {
                    $(this).find('span').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                    $(this).next().addClass('active-content');
                }

                return false;
            });

            $('#tabbedBox').tabs({ disabled: [2] });
        }
    };
    Widgets.init();
    Widgets.formListener();
    Widgets.fetchForm();
    Widgets.editForm();
    Widgets.customiseFormSetup();
    Widgets.personaliseForm();
    Widgets.fieldSort();
})(jQuery);
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main.js.map
