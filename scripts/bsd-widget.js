(function (global) {
  var jQuery;

  /******** Load jQuery if not present *********/
  if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.2.4') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        // For old versions of IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          scriptLoadHandler();
        }
      };
    } else {
      // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
  } else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
  }
  function getParam(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }

  /******** Called once jQuery has loaded ******/
  function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
  }
  //# sourceMappingURL=bsd-signup-jsapi-simple.js.map
  function main() {
    !function (e, t, s) {
      function a(e) {
        var t = document.createElement("a");return t.href = e, t;
      }function r(t) {
        var s = "No response from sever";if (t && t.responseJSON) return t.responseJSON;try {
          return e.parseJSON(t.responseText);
        } catch (a) {
          return { status: "fail", code: 503, message: s, error: s };
        }
      }function i(t) {
        return t && "success" === t.status ? t : e.Deferred().rejectWith(this, [t]);
      }function n(e, t, s) {
        e.one("change keyup", function () {
          e.val() !== s && t.setCustomValidity("");
        });
      }function o(e) {
        this.trigger("bsd-success", [e]), this.data("bsdsignup").no_redirect !== !0 && e.thanks_url && (t.href = e.thanks_url);
      }function u(t) {
        var s = this,
            a = !1,
            r = this.data("bsdsignup"),
            i = {};t && t.field_errors && t.field_errors.length && (e.each(t.field_errors, function (e, o) {
          var u = s.find('[name="' + o.field + '"]'),
              d = u.get()[0];"submit-btn" === o.field ? t.message = o.message : d && d.setCustomValidity && l && !s[0].noValidate && !r.no_html5validate && (d.setCustomValidity(o.message), n(u, d, o.message), a = !0), o.$field = u, i[o.field] = o.message, u.trigger("invalid", o.message);
        }), a && l && s.find('[type="submit"],[type="image"]').eq(0).click()), s.trigger("bsd-error", [t, i]);
      }function d(s, n, d) {
        return function (c) {
          var l = s.serializeObject();if (s.data("isPaused") !== !0) {
            s.data("isPaused", !0);var f = n.replace("/\/page\/(signup|s)/", "/page/sapi"),
                p = e.ajax({ url: f, type: "POST", method: "POST", dataType: "json", timeout: d.timeout || 3e4, context: s, data: l, beforeSend: function (s, r) {
                if (d.proxyall || r.crossDomain && !e.support.cors && (!e.oldiexdr || a(r.url).protocol !== t.protocol)) {
                  if (!d.oldproxy && !d.proxyall) return !1;r.url = d.oldproxy || d.proxyall, r.crossDomain = !1, r.data += "&purl=" + f;
                }c.preventDefault();
              } });"canceled" !== p.statusText && (s.trigger("bsd-submit", l), p.then(i, r).always(function () {
              s.data("isPaused", !1);
            }).done(o).fail(u));
          } else c.preventDefault(), s.trigger("bsd-ispaused", l);
        };
      }function c(t, s, a) {
        var r,
            i = t.find('[name="' + s + '"]');i.length || (i = e("<input/>", { type: "hidden", name: s }).appendTo(t)), a && (r = i.val(), i.val(("" !== r ? r + "," : "") + a));
      }e.fn.serializeObject = function () {
        var t = {},
            a = this.serializeArray();return e.each(a, function () {
          t[this.name] !== s ? (t[this.name].push || (t[this.name] = [t[this.name]]), t[this.name].push(this.value || "")) : t[this.name] = this.value || "";
        }), t;
      };var l = "reportValidity" in e("<form/>").get()[0],
          f = function (e) {
        var s = new RegExp("[\\?&]" + e.replace(/(\[|\])/g, "\\$1") + "=([^&#]*)"),
            a = s.exec(t.href);return null === a ? "" : a[1];
      },
          p = "source",
          m = "subsource",
          g = f(p) || f("fb_ref"),
          h = f(m);e.fn.bsdSignup = function (t) {
        return t = t || {}, this.each(function () {
          var s = e(this),
              a = s.attr("action");"remove" === t ? s.off("submit.bsdsignup").removeData("bsdsignup isPaused") : s.is("form") && a.indexOf("page/s") > -1 && (s.data("bsdsourced") === !0 || t.nosource || (c(s, p, g), c(s, m, h), s.data("bsdsourced", !0)), s.data("bsdsignup", t), t.startPaused && s.data("isPaused", !0), s.on("submit.bsdsignup", d(s, a, t)));
        });
      };
    }(jQuery, window.location);
    var token = jQuery('#w-embed').data('token');
    if (!token) {
      var token = getParam('tkn');
    }

    jQuery.ajax({
      url: 'https://widget.www.test.which-testing.co.uk/embed.php',
      method: 'GET',
      dataType: 'json',
      data: { tkn: token },
      success: function (data) {

        jQuery('#w-embed').html(data[0].embed_html);

        jQuery('<script type="text/javascript">  var jQuery;if(void 0===window.jQuery||"2.2.4"!==window.jQuery.fn.jquery){var script_tag=document.createElement("script");script_tag.setAttribute("type","text/javascript"),script_tag.setAttribute("src","//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"),script_tag.readyState?script_tag.onreadystatechange=function(){"complete"!=this.readyState&&"loaded"!=this.readyState||scriptLoadHandler()}:script_tag.onload=scriptLoadHandler,(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(script_tag)}else jQuery=window.jQuery,main(); function scriptLoadHandler(){jQuery=window.jQuery.noConflict(!0),main()} function main(){ !function(e,t,r){function n(e){var t=document.createElement("a");return t.href=e,t}function i(t){var r="No response from sever";if(t&&t.responseJSON)return t.responseJSON;try{return e.parseJSON(t.responseText)}catch(n){return{status:"fail",code:503,message:r,error:r}}}function s(t){return t&&"success"===t.status?t:e.Deferred().rejectWith(this,[t])}function a(e,t,r){e.one("change keyup",function(){e.val()!==r&&t.setCustomValidity("")})}function o(e){this.trigger("bsd-success",[e]),this.data("no_redirect")!==!0&&e.thanks_url&&(t=e.thanks_url)}function u(t){var r=this,n=!1,i={};t&&t.field_errors&&t.field_errors.length&&(e.each(t.field_errors,function(e,s){var o=r.find(\'[name="\'+s.field+\'"]\'),u=o.get()[0];"submit-btn"===s.field?t.message=s.message:u&&u.setCustomValidity&&f&&r.data("no_html5validate")!==!0&&(u.setCustomValidity(s.message),a(o,u,s.message),n=!0),s.$field=o,i[s.field]=s.message,o.trigger("invalid",s.message)}),n&&f&&r.find(\'[type="submit"],[type="image"]\').eq(0).click()),r.trigger("bsd-error",[t,i])}function c(r,a,c){return function(l){var f=r.serializeObject(),d=a.replace("/page/(signup|s)/","/page/sapi"),m=e.ajax({url:d,type:"POST",method:"POST",dataType:"json",timeout:c.timeout||3e4,context:r,data:f,beforeSend:function(r,i){if(i.crossDomain&&!e.support.cors&&(!e.oldiexdr||n(i.url).protocol!==t.protocol)){if(!c.oldproxy)return!1;i.url=c.oldproxy,i.crossDomain=!1,i.data+="&purl="+d}l.preventDefault()}});"canceled"!==m.statusText&&m.then(s,i).done(o).fail(u)}}function l(t,r,n){var i,s=t.find(\'[name="\'+r+\'"]\');s.length||(s=e("<input/>",{type:"hidden",name:r}).appendTo(t)),n&&(i=s.val(),s.val((""!==i?i+",":"")+n))}e.fn.serializeObject=function(){var t={},n=this.serializeArray();return e.each(n,function(){t[this.name]!==r?(t[this.name].push||(t[this.name]=[t[this.name]]),t[this.name].push(this.value||"")):t[this.name]=this.value||""}),t};var f="reportValidity"in e("<form/>").get()[0],d=function(e){var r=new RegExp("[\?&]"+e.replace(/([|])/g,"\$1")+"=([^&#]*)"),n=r.exec(t.href);return null===n?"":n[1]},m="source",p="subsource",h=d(m)||d("fb_ref"),g=d(p);e.fn.bsdSignup=function(t){return this.each(function(){var r=e(this),n=r.attr("action");r.is("form")&&n.indexOf("page/s")>-1&&(l(r,m,h),l(r,p,g),e.isPlainObject(t)&&r.data(t),r.on("submit",c(r,n,t)))})}}(jQuery,window.location); ' + data[0].embed_script + '   }</script>').insertBefore('#w-embed');

        jQuery('#bsd_widget_source').val(window.location.href);

        jQuery('#signup_counter').text(data[1].signup);

        var target = jQuery('.progress-bar').data('target');
        var signupcounts = data[1].signup;
        signupcounts = signupcounts.replace(',', '');
        signupcounts = parseInt(signupcounts);
        var percentage = signupcounts * 100 / target;
        if (percentage > 100) {
          percentage = 100;
        }
        jQuery('.progress').css({ 'width': percentage + '%' });

        if (jQuery('.bsd-embed-intro').length > 0) {
          jQuery('.bsd-embed-form').hide();
          jQuery('#w-embed').on('click', '.bsd-embed-intro .expand-petition', function () {
            jQuery('.bsd-embed-intro').toggle();
            jQuery('.bsd-embed-form').toggle();
          });
        }

        jQuery(".thankyou-wrapper").hide();

        jQuery('.apiform').on('submit', function (e) {
          e.preventDefault();

          jQuery.getJSON("https://widget.www.test.which-testing.co.uk/proxy.php?callback=?&" + jQuery(".apiform").serialize(), function () {
            // e.preventDefault();
            //thank you page
            if (jQuery('.thankyou-wrapper').length > 0) {
              jQuery('.bsd-embed-form').hide();

              if (jQuery('.form-post').length > 0) {

                var formStr = '';

                jQuery('#w-embed .form-row').each(function () {
                  if (jQuery(this).find('.visible-label').not('.visible-label--select').length > 0) {
                    formStr += '<p>' + jQuery(this).find('.form-radio--label').text() + ' : ';
                    if (jQuery(this).find('.w--input-field:checked').val()) {
                      formStr += jQuery(this).find('.w--input-field:checked').prev('.visible-label').text() + ' <br />';
                    }
                    formStr += '</p>';
                  } else {

                    if (jQuery(this).find('.w--input-field').val()) {
                      formStr += '<p>' + jQuery(this).find('label').text() + ' : ' + jQuery(this).find('.w--input-field').val() + '</p>';
                    }
                  }
                });
              }

              jQuery('.form-post').append(formStr);
              jQuery(".thankyou-wrapper").show();
            } else {
              window.location.replace(data[0].thankyou_redirect);
            }
            //update form data
          });
        });
      },
      error: function () {
        return false;
      }
    });
  }
})(this);
//# sourceMappingURL=bsd-widget.js.map
//# sourceMappingURL=bsd-widget.js.map
