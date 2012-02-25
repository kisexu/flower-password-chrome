(function(options, messages) {
    function sendEnabled() {
        messages.extension.send('setLocalEnabled', {value: options.isEnabled()});
    }

    function triggerOnSetEnabled() {
        if (options.onSetEnabled) options.onSetEnabled();
    }

    $.extend(options.global, {
        setCache: function(value) {
            if (!isUndefined(value)) {
                options.global.cache = value;
                sendEnabled();
                triggerOnSetEnabled();
            }
        },
        loadAll: function() {
            messages.extension.send('getGlobalOptions', {}, options.global.setCache);
        },
        set: function(name, value) {
            options.global.cache[name] = value;
            messages.extension.send('setGlobalOption',{ name: name, value: value});
        }
    });

    $.extend(options, {
        isTransparent: function() {
            return options.global.cache.transparent;
        },

        onSetEnabled: null,
        isDefaultEnabled: function() {
            return options.global.cache.defaultEnabled;
        },
        isEnabled: function() {
            if (isUndefined(options.local.cache.enabled)) {
                return options.isDefaultEnabled();
            } else {
                return options.local.cache.enabled;
            }
        },
        setEnabled: function(value) {
            options.local.set('enabled', value);
            triggerOnSetEnabled();
        },
        toggleEnabled: function() {
            options.setEnabled(!options.isEnabled());
        },

        setDomain: function(value) {
            options.local.cache.domain = value;
        }
    });

    messages.extension.handles = $.extend(messages.extension.handles, {
        toggleLocalEnabled: function() {
            options.toggleEnabled();
            return options.isEnabled();
        },
        getLocalEnabled: function() {
            return options.isEnabled();
        },
        setGlobalOptions: function(data) {
            options.global.setCache(data.value);
        }
    });
    messages.page.handles = $.extend(messages.page.handles, {
        getLocalOptions: function() {
            return options.local.cache;
        },
        setLocalOption: function(data) {
            options.local.set(data.name, data.value);
        }
    });
})(options, messages);
