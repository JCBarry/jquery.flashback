(function($) {
    $.Flashback = function(el, options) {
        // Call the function if given a string, otherwise initialize a new flashback
        if (typeof options == 'string' && typeof $(el).data('Flashback')[options] == 'function') {
            $(el).data('Flashback')[options](this, $(el).data('Flashback').options)
        } else {
            var base = this;
            base.protected = {};
            base.fbInterval;
            base.$el = $(el);
            base.el = el;
            base.$el.data("Flashback", base);

            base.init = function() {
                base.options = $.extend({}, $.Flashback.defaultOptions, options);
                    var form = base.$el.is('form') ? base.$el : base.$el.find('form')
                    form.each(function(i, el) {
                        $(el).attr('fbid', $('[fbid]').length + 1);
                    });

                if (base.options.autoSaveUnload) {
                    base.protected.create_page_events();
                };

                if (base.options.autoSaveInterval > 0) {
                    base.protected.create_interval();
                };
            };

            base.save = function() {
                var form_data = {};
                if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                    form_data = JSON.parse(base.protected.load_localstorage('fb')) || {}
                } else {
                    form_data = JSON.parse(base.protected.load_cookie('fb')) || {};
                }
                base.protected.clear_all();

                if(base.$el.is('form')) {
                    var id =  base.$el.attr('fbid')
                    form_data['fb_' + id] = base.protected.create_json(id);
                } else {
                    base.$el.find('[fbid]').each(function() {
                        var id =  $(this).attr('fbid')
                        form_data['fb_' + id] = base.protected.create_json(id);
                    })
                }



                if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                    base.protected.save_localstorage('fb', JSON.stringify(form_data))
                } else {
                    base.protected.save_cookie('fb', JSON.stringify(form_data), base.options.expires);
                }
            };

            base.load = function() {
                var form_data = {};
                if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                    form_data = JSON.parse(base.protected.load_localstorage('fb')) || {}
                } else {
                    form_data = JSON.parse(base.protected.load_cookie('fb'));
                }

                if(base.$el.is('form')) {
                    var id =  base.$el.attr('fbid');
                    base.protected.parse_json(id, form_data);
                } else {
                    base.$el.find('[fbid]').each(function() {
                        var id =  $(this).attr('fbid');
                        base.protected.parse_json(id, form_data);
                    });
                }
            }

            base.clear = function() {
                var form_data = {};
                if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                    form_data = JSON.parse(base.protected.load_localstorage('fb')) || {}
                } else {
                    form_data = JSON.parse(base.protected.load_cookie('fb'));
                }

                if(base.$el.is('form')) {
                    delete form_data['fb_' + base.$el.attr('fbid')]
                } else {
                    base.$el.find('[fbid]').each(function() {
                        delete form_data['fb_' + $(this).attr('fbid')]
                    })
                }



                if(!$.isEmptyObject(form_data)) {
                    if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                        base.protected.save_localstorage('fb', JSON.stringify(form_data))
                    } else {
                        base.protected.save_cookie('fb', JSON.stringify(form_data), base.options.expires);
                    }
                } else {
                    if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                        delete localStorage.fb
                    } else {
                        base.protected.clear_cookie('fb')
                    }
                }
            }

            // PROTECTED METHODS \\
            // setup the auto-saving interval
            base.protected.create_interval = function() {
                base.fbInterval = setInterval(function() {
                    base.save();
                }, base.options.autoSaveInterval);
            }

            // setup the page load/unload events
            base.protected.create_page_events = function() {
                $(window).bind('unload.flashback', function() {
                    base.save();
                });
                $(window).bind('load.flashback', function() {
                    base.load();
                });
            }

            // save a localstorage object with key and value
            base.protected.save_localstorage = function(key, value) {
                localStorage.setItem(key, value);
            }

            // load the object from localstorage at key
            base.protected.load_localstorage = function(key) {
                return localStorage.getItem(key);
            }

            // check if the browser supports localstorage
            base.protected.localstorage_supported = function() {
                try {
                    if (window['localStorage'] !== null) {
                        return true;
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            }

            // save the cookie
            base.protected.save_cookie = function(key, value, expiry) {
                var expiration = new Date();
                expiration.setDate(expiration.getDate() + expiry);
                document.cookie = key + "=" + encodeURIComponent(value) + "; expires=" + expiration.toGMTString();
            }

            // load the cookie
            base.protected.load_cookie = function(key) {
                if(document.cookie.indexOf(key) > -1) {
                    return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"))
                } else {
                    return null;
                }
            }

            // clear the cookie
            base.protected.clear_cookie = function(key) {
                base.protected.save_cookie(key, "", -1)
            }

            // clear all storage
            base.protected.clear_all = function() {
                if(base.protected.localstorage_supported() && base.options.useLocalStorage) {
                    delete localStorage.fb
                } else {
                    base.protected.clear_cookie('fb')
                }
            }

            // create the json object from elements specified by location
            base.protected.create_json = function(fbid) {
                var json = {};
                $('[fbid=' + fbid + ']').find('input, select, textarea').each(function() {
                    if($(this).attr('name')<='') return false;
                    if($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
                        json[$(this).attr('name')] = $(this).is(':checked') ? $(this).val() : json[$(this).attr('name')];
                    }
                    if($(this).attr('type') == 'text' || $(this).is('select') || $(this).is('textarea')) {
                        json[$(this).attr('name')] = $(this).val();
                    }
                });
                return json;
            }

            // parse the saved json object back into their respective elements in location
            base.protected.parse_json = function(fbid, json) {
                if(typeof json != 'object') return false
                var $form = $('[fbid=' + fbid + ']');
                var json_form = json['fb_' + fbid];

                for(var field in json_form) {
                    var $el = $form.find('[name="' + field + '"][value="' + json_form[field] + '"]')

                    if( $el.attr('type') == 'radio' || $el.attr('type') == 'checkbox') {
                        $el.attr('checked','checked');
                    }

                    $el = $form.find('[name="' + field + '"]');
                    if($el.attr('type') == 'text' || $el.is('select') || $el.is('textarea')) {
                        $el.val(json_form[field]);
                    }
                }
            }

            // initialize flashback!
            base.init();
        }
    };

    $.Flashback.defaultOptions = {
        autoSaveInterval: 0,
        autoSaveUnload: true,
        useLocalStorage: true,
        expires: ''
    };

    $.fn.flashback = function(options) {
        return this.each(function() {
            (new $.Flashback(this, options));
        });
    };

})(jQuery);