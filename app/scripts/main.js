/*global jQuery:false */

(function($) {
  'use strict';
    var sortedFields = [], signupInfo, embedCode, dragEl, signupFields, fieldsHTML,
    wg = {
      init: function() {
        sortedFields = '';
      },
      validate: function(el) {

        var flagValidation = 0;
        var msgValidation = '';
        //check for presence
        $('.form-error').remove();
        if(el.data('validate').indexOf('presence') >= 0) {
          if(!el.val()) {
            flagValidation++;
            msgValidation = '<p class="error">'+el.data('validatemsg')+'</p>';
          }
        }

        if(el.data('validate').indexOf('numeric') >= 0) {
          if(!$.isNumeric(el.val())) {
            flagValidation++;
            msgValidation = '<p class="error form-error">'+el.data('validatemsg')+'</p>';
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

        
        
      },
      buildEmbedCode: function() {

        embedCode = '';

        //build the css
        var embedCSS = '<style type="text/css"></style>';


        //build the js
        //will include signup API call
        var embedJS = '<script type="text/javascript"></script>';

        //build the html
        var embedHTML = '<div class="bsd-embed-form">';
  
        //TODO: add absolute URL before action

        embedHTML = '<form name="'+signupInfo.signup_form_name+'" action="'+signupInfo.signup_form_slug+'" method="post" id="'+signupInfo.signup_form_id+'">';

        $('#customiseForm .form-row').each(function(key, value) {
          
          //TODO: don't add submit button from form
          //TODO: handle other field types (select)
          //TODO: add if half a row

          embedHTML += '<div class="form-row">';
          embedHTML += '<label for="'+$(this).find('input').attr('id')+'" >'+$(this).find('label').html()+'</label>';
          embedHTML += '<input type="'+$(this).find('input').attr('type')+'" id="'+$(this).find('input').attr('id')+'" name="'+$(this).find('input').attr('name')+'" placeholder="'+$(this).find('label').html()+'" />';
          embedHTML += '</div>';  

        });

        //TODO: add submit button


        embedHTML += '</form>';
        embedHTML += '</div>';

        $('#generateForm textarea').val(embedHTML); 


      },
      editForm: function() {
        //ux for editing the inital form ID

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

            //validate input
            var formValidates = wg.validate($('#formID'));


            if(formValidates === false) {
              return false;
            }

            var stuff = {};
            $.ajax({
                      url: '/form.php',
                      method: "GET",
                      data: { formID : $('#formID').val() },
                      success : function(data) {
                        data = JSON.parse(data);
                        var arr = $.makeArray( data );
                        signupInfo = arr[0]['signup_form'];

                      },
                      error : function(r2) {
                          //Something went so wrong
                          console.log('error');
                          $('#formID').after('<p>I am sorry this signup form does not exist in our systems</p>');
                          return false;
                      }
                  });

                  $.ajax({
                          url: '/fields.php',
                          method: "GET",
                         data: { formID : $('#formID').val() },
                          success : function(data) {
                            data = JSON.parse(data);
                            var arr = $.makeArray( data );
                            signupFields = '';
                            arr = arr[0]['signup_form_field'];
                            //build input fields up
                            $.each(arr, function(i, k) {
                       
                              var fieldType = 'text';
                              var extraClasses = '';
                                var fieldName = '';
                
                              var validationTxt = '';

                              if(k.is_custom_field === 0) { 
                                fieldName = k.description.replace(/\s+/g, '').toLowerCase()
                              }
                              else {
                                fieldName = 'custom_'+k["@attributes"]['id'];
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
                                validationTxt = ' data-validate="presence" data-validateMsg="Please enter a valid '+k.label+'" ';
                              }


                              signupFields += '<div class="form-row '+extraClasses+'">';
                              signupFields += '<label for="'+fieldName+'">'+k.label+'</label>';
                              signupFields += '<input type="'+fieldType+'" disabled name="'+fieldName+'" '+validationTxt+' placeholder="'+k.label+'" id="'+fieldName+'" />';
                              signupFields += '</div>';


                            });

                              signupFields += '<div class="form-row"><input type="submit" class="b--btn b--btn__submit" name="fetchform" value="Personalise form" /></div>';

                                $('#customiseForm fieldset').html(signupFields);

                                $('#fetchForm').hide();
                                $('#tabbedBox').fadeIn();

                                wg.fieldSort();

                              
                                //populate and show edit form box
                                $('.form-id--display').html($('#formID').val());
                                $('.e--edit-form').show();
                          },
                          error : function(r2) {
                              //Something went so wrong
                          }
                      });


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
            dragEl = '';
         });
         $('#customiseForm .form-row').on('mousedown', function() {
            $(this).addClass('is-dragging');
            dragEl = $(this);
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

         $('#customiseForm .form-row').on('click', function() {
            if($('.toggle-btn').hasClass('is-active')) { 
              if($(this).hasClass('form-row--half')) {
                $(this).removeClass('form-row--half');
              }
              else {
                $(this).addClass('form-row--half');
              }
            }
         });


        $('#customiseForm .form-row').droppable({
            
            greedy:true,
          
          
              //hoverClass: "form-row--half",

               tolerance: "pointer", 

               /*
            drop: function(event,ui) {
                $(ui.draggable).addClass("form-row--half");
                $(this).addClass("form-row--half");
            },

            over: function(event, ui) {
                $('.ui-sortable-helper').addClass("form-row--half");
                 $('.ui-sortable-helper').css({
                    width: '252px',
                    margin: '0 1.2195121951%'
                 })
                $(this).addClass("form-row--half");

            },
             out: function(event, ui) {
                $('.ui-sortable-helper').removeClass("form-row--half");
                $('.ui-sortable-helper').css({
                    width: '522px',
                    margin: '0 1.2195121951%'
                 })
                $(this).removeClass("form-row--half");
            }*/

        });

      },


      formListener: function() { 

    $('#personaliseForm form').on('submit', function(event) {
            event.preventDefault();
            //update order and position of fields

            //generate HTML
            wg.buildEmbedCode();

            //move to the next tab
            $('#tabbedBox').tabs( 'option', 'active', 2);

        });


        $('#customiseForm').on('submit', 'form', function(event) {
            event.preventDefault();
            //save whole html block for now
            sortedFields = $('#customiseForm');

            //move to the next tab
            $('#tabbedBox').tabs( 'option', 'active', 1);

        });

    


      }
    };
    wg.init();
    wg.formListener();
    wg.fetchForm();
    wg.editForm();
    wg.personaliseForm();

    $(document).ready(function()
    {
      $('#tabbedBox').tabs();
      //$('#personaliseForm form').accordion();
      $('.picker').spectrum({
    color: "#e30613",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
        
    },
    palette: [
        ["rgb(45, 53, 61)", "rgb(231, 55, 85)", "rgb(58, 85, 175)",
        "rgb(76, 98, 108)"]
    ]
});
    });

})(jQuery);
