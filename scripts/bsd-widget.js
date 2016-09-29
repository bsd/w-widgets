(function (global) {
  !function(e,t,n){function r(e){var t=document.createElement("a");return t.href=e,t}function i(e){var t="No response from sever";return e&&e.responseJSON?e&&e.responseJSON?e.responseJSON:void 0:{status:"fail",code:503,message:t,error:t}}function a(t){return t&&"success"===t.status?t:e.Deferred().rejectWith(this,[t])}function s(e,t,n){e.one("change keyup",function(){e.val()!==n&&t.setCustomValidity("")})}function o(e){this.trigger("bsd-success",[e]),this.data("no_redirect")!==!0&&e.thanks_url&&(t=e.thanks_url)}function u(t){var n=this,r=!1,i={};t&&t.field_errors&&t.field_errors.length&&(e.each(t.field_errors,function(e,t){var a=n.find('[name="'+t.field+'"]'),o=a.get()[0];o&&o.setCustomValidity&&f&&n.data("no_html5validate")!==!0&&(o.setCustomValidity(t.message),s(a,o,t.message),r=!0),t.$field=a,i[t.field]=t.message,a.trigger("invalid",t.message)}),r&&f&&n.find('[type="submit"],[type="image"]').eq(0).click()),n.trigger("bsd-error",[t,i])}function c(n,s,c){return function(l){var f=n.serializeObject(),d=s.replace(/\/page\/(signup|s)/,"/page/sapi"),p=e.ajax({url:d,type:"POST",method:"POST",dataType:"json",timeout:c.timeout||3e4,context:n,data:f,beforeSend:function(n,i){if(i.crossDomain&&!e.support.cors&&(!e.oldiexdr||r(i.url).protocol!==t.protocol)){if(!c.oldproxy)return!1;i.url=c.oldproxy,i.crossDomain=!1,i.data+="&purl="+d}l.preventDefault()}});"canceled"!==p.statusText&&p.then(a,i).done(o).fail(u)}}function l(t,n,r){var i,a=t.find('[name="'+n+'"]');a.length||(a=e("<input/>",{type:"hidden",name:n}).appendTo(t)),r&&(i=a.val(),a.val((""!==i?i+",":"")+r))}e.fn.serializeObject=function(){var t={},r=this.serializeArray();return e.each(r,function(){t[this.name]!==n?(t[this.name].push||(t[this.name]=[t[this.name]]),t[this.name].push(this.value||"")):t[this.name]=this.value||""}),t};var f="reportValidity"in e("<form/>").get()[0],d=function(e){var n=new RegExp("[\\?&]"+e.replace(/(\[|\])/g,"\\$1")+"=([^&#]*)"),r=n.exec(t.href);return null===r?"":r[1]},p="source",h="subsource",m=d(p)||d("fb_ref"),g=d(h);e.fn.bsdSignup=function(t){return this.each(function(){var n=e(this),r=n.attr("action");n.is("form")&&r.indexOf("page/s")>-1&&(l(n,p,m),l(n,h,g),e.isPlainObject(t)&&n.data(t),n.on("submit",c(n,r,t)))})}}(jQuery,window.location);
//# sourceMappingURL=bsd-signup-jsapi-simple.js.map
  var token = jQuery('#w-embed').data('token');

  $.ajax({
      url: 'https://widget.www.test.which-testing.co.uk/embed.php',
                      method: 'GET',
                      dataType: 'json',
                      data: { tkn: token},
                      success: function(data) {

                        jQuery('#w-embed').html(data[0].embed_html);

                        jQuery('<script type="text/javascript">'+data[0].embed_script+'</script>').insertBefore('#w-embed');

                        jQuery('#bsd_widget_source').val(window.location.href);

                        jQuery('#signup_counter').text(data[1].signup);

                        var target = jQuery('.progress-bar').data('target');
                        var signupcounts = data[1].signup;
                        signupcounts = signupcounts.replace(',', '');
                        signupcounts = parseInt(signupcounts);
                        var percentage = (signupcounts * 100) / target;
                        if(percentage > 100) { percentage = 100 }
                        jQuery('.progress').css({'width': percentage + '%'});

                        if(jQuery('.bsd-embed-intro').length > 0) {
                          jQuery('.bsd-embed-form').hide();
                          jQuery('#w-embed').on('click', '.bsd-embed-intro .expand-petition', function() {
                            jQuery('.bsd-embed-intro').toggle();
                            jQuery('.bsd-embed-form').toggle();

                          });
                        }

                        jQuery(".thankyou-wrapper").hide();

                        jQuery('.apiform').on('submit', function(e) {
                          e.preventDefault();

                        jQuery.getJSON("/proxy.php?callback=?&" + jQuery(".apiform").serialize(), function(){
                            // e.preventDefault();
                            //thank you page
                            if(jQuery('.thankyou-wrapper').length > 0) {
                              jQuery('.bsd-embed-form').hide();

                              if(jQuery('.form-post').length > 0) {

                                var formStr = '';

                                jQuery('#w-embed .form-row').each(function() {
                                  if(jQuery(this).find('.visible-label').not('.visible-label--select').length > 0) {
                                    formStr += '<p>' + jQuery(this).find('.form-radio--label').text() + ' : '
                                    if(jQuery(this).find('.w--input-field:checked').val()) {
                                        formStr += jQuery(this).find('.w--input-field:checked').prev('.visible-label').text() + ' <br />';
                                    }
                                    formStr += '</p>';
                                  }
                                  else {

                                  if(jQuery(this).find('.w--input-field').val()) {
                                    formStr += '<p>' + jQuery(this).find('label').text() + ' : ' + jQuery(this).find('.w--input-field').val() + '</p>';
                                  }
                                  }
                                });
                              }

                              jQuery('.form-post').append(formStr);
                              jQuery(".thankyou-wrapper").show();
                            }
                            else {
                              window.location.replace(data[0].thankyou_redirect);
                            }
                            //update form data

                        });

                        });

                      },
                      error: function() {
                          return false;
                      }
                  });

})(this);