/*!
 * SAP Fiori login v3.5.0
 * (c) Copyright 2013-2019 SAP SE or an SAP affiliate company.
*/
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.sapLogin = f() } })(function () {
    var define, module, exports; return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
        1: [function (require, module, exports) {
            "use strict";

            var log = require("./log");
            var framebusting = require("./framebusting");
            var cssUtil = require("./cssUtil");
            var domUtil = require("./domUtil");
            var getLoginData = require("./login-data");
            var MessageContainer = require("./MessageContainer");

            var ControllerPrototype;

            function Controller(shadowMap) {
                log.debug("Creating login controller");
                this.shadowMap = shadowMap;
                this.listeners = [];
            }

            module.exports = Controller;

            ControllerPrototype = Controller.prototype;

            ControllerPrototype.setup = function () {
                var self = this;
                log.info("Starting login controller");
                this.loginData = getLoginData();
                if (this.hasBackground) {
                    this.initializeBackground();
                }
                this.messageContainer = new MessageContainer();
                this.formSetup();
                if (this.shadowMap) {
                    framebusting.initialize(this.loginData.login_params, this.shadowMap, function () {
                        log.debug("Activating page");
                        self.main();
                        self.startupComplete();
                    });
                }
                else {
                    log.debug("Direct page activation");
                    this.main();
                    this.startupComplete();
                }
                this.initialized = true;
                if (this.shouldActivate) {
                    log.debug("Deferred page activation");
                    framebusting.activate();
                }
            };

            ControllerPrototype.hasBackground = true;
            ControllerPrototype.main = function () {
            };
            ControllerPrototype.formSetup = function () {
            };

            ControllerPrototype.initializeBackground = function () {
                var loginProperties = this.loginData.properties;
                if (loginProperties.img_background) {
                    cssUtil.setUiBackground(loginProperties.img_background);
                }
                domUtil.addClass("sapUiBackground", document.body);
            };

            ControllerPrototype.startupComplete = function () {
                var i, n, listeners = this.listeners;
                for (i = 0, n = listeners.length; i < n; ++i) {
                    try {
                        listeners[i]();
                    }
                    catch (err) {
                        log.warn("Error in startup callback: " + err.message + "\n" + err.stack);
                        throw err;
                    }
                }
            };

            ControllerPrototype.onStarted = function (cb) {
                var err, i, n, listeners = this.listeners;
                if (typeof cb !== "function") {
                    err = new TypeError("Invalid startup callback");
                    log.error(err.message + "\n" + err.stack);
                    throw err;
                }
                for (i = 0, n = listeners.length; i < n; ++i) {
                    if (listeners[i] === cb) {
                        log.debug("Startup callback already registered");
                        return;
                    }
                }
                log.debug("Registering startup callback");
                listeners.push(cb);
            };

            ControllerPrototype.activate = function () {
                log.info("Framing allowed, activating application");
                if (this.shadowMap) {
                    // In case of advanced framing control with a parent in the same origin, activate may ce called too early
                    if (this.initialized) {
                        framebusting.activate();
                    }
                    else {
                        log.debug("Deferring page activation");
                        this.shouldActivate = true;
                    }
                }
            };

        }, { "./MessageContainer": 4, "./cssUtil": 7, "./domUtil": 8, "./framebusting": 10, "./log": 11, "./login-data": 12 }], 2: [function (require, module, exports) {
            "use strict";

            var domUtil = require("./domUtil");
            var events = require("./events");
            var UrlObject = require("./UrlObject");
            var HashMonitorPrototype;

            function HashMonitor(form) {
                var params, self = this, hash = this.getHashField();
                this.form = form;
                if (hash) {
                    window.location.hash = hash;
                }
                else {
                    try {
                        params = UrlObject.parseSearch(window.location.search);
                        if (params["_sap-hash"]) {
                            hash = domUtil.decodeString(params["_sap-hash"]);
                            window.location.hash = hash;
                        }
                    }
                    catch (err) {
                        void 0;
                    }
                }
                this.setHashField();
                events.addEventListener(window, "hashchange", function () {
                    self.setHashField();
                });
            }
            module.exports = HashMonitor;
            HashMonitorPrototype = HashMonitor.prototype;

            HashMonitorPrototype.getHashField = function () {
                var hash = domUtil.getFormField("sap-hash");
                return domUtil.decodeString(hash);
            };

            HashMonitorPrototype.setHashField = function () {
                var url, hash = domUtil.encodeString(window.location.hash);
                url = new UrlObject(this.form.action);
                domUtil.setFormField(this.form, "sap-hash", hash);
                if (hash) {
                    domUtil.setFormField(this.form, "__sap-sl__dummy", "1");
                    url.setParameter("_sap-hash", hash);
                }
                else {
                    domUtil.deleteElementByName("__sap-sl__dummy");
                    url.removeParameter("_sap-hash");
                }
                this.form.action = url.href;
            };

        }, { "./UrlObject": 5, "./domUtil": 8, "./events": 9 }], 3: [function (require, module, exports) {
            "use strict";

            var constants = require("./constants");

            function Message(nwMessage) {
                this.severity = constants.SEVERITY[nwMessage.severity];
                this.text = nwMessage.message;
                this.code = nwMessage.condname;
            }
            module.exports = Message;

        }, { "./constants": 6 }], 4: [function (require, module, exports) {
            "use strict";

            var log = require("./log");
            var domUtil = require("./domUtil");
            var Message = require("./Message");

            function MessageContainer(parent) {
                this.parent = parent || document.getElementById("LOGIN_MAIN") || document.body;
            }

            module.exports = MessageContainer;

            MessageContainer.parseServerMessages = function (nwMessages) {
                nwMessages = nwMessages || [];
                return nwMessages.map(function (msg) {
                    return new Message(msg);
                });
            };

            MessageContainer.prototype.setServerMessages = function (nwMessages) {
                try {
                    this.setMessages(MessageContainer.parseServerMessages(nwMessages));
                }
                catch (err) {
                    log.error("Failed to display server messages: " + err.message);
                    throw err;
                }
            };

            MessageContainer.prototype.setError = function (text) {
                this.setMessages({ severity: "error", text: text });
            };

            MessageContainer.prototype.setMessages = function (messages) {
                var i, message;
                try {
                    this.clear();
                    if (!Array.isArray(messages)) {
                        messages = [messages];
                    }
                    this.messages = messages || [];
                    if (!messages.length) {
                        return;
                    }
                    this.createContainer();
                    log.debug("Adding message nodes");
                    for (i = 0; i < messages.length; ++i) {
                        message = messages[i];
                        MessageContainer.log(message);
                        this.addMessage(message, i, i === 0);
                    }
                    this.showContainer();
                }
                catch (err) {
                    log.error("Failed to set messages: " + err.message);
                    throw err;
                }
            };

            MessageContainer.prototype.clear = function () {
                if (this.container) {
                    log.debug("Destroying old message container");
                    this.parent.removeChild(this.container);
                    this.container = null;
                }
                this.messages = [];
            };

            MessageContainer.prototype.createContainer = function () {
                log.debug("Creating message container");
                var container = document.createElement("div");
                container.id = "LOGIN_ERROR_BLOCK";
                container.className = "loginMessageContainer";
                this.container = container;
            };

            MessageContainer.prototype.showContainer = function () {
                log.debug("Showing message container");
                if (this.parent.firstChild) {
                    this.parent.insertBefore(this.container, this.parent.firstChild);
                }
                else {
                    this.parent.appendChild(this.container);
                }
                domUtil.delayedFocus("LOGIN_MESSAGE_0");
            };

            MessageContainer.log = function (message) {
                var logLevel = message.severity === "success" ? "info" : message.severity;
                if (message.code) {
                    log[logLevel](message.code + " - " + message.text);
                }
                else {
                    log[logLevel](message.text);
                }
            };

            MessageContainer.prototype.getSeverityClass = function (severity) {
                var className;
                switch (severity) {
                    case "error":
                        className = "sapUiError";
                        break;
                    case "warn":
                        className = "sapUiWarning";
                        break;
                    case "success":
                        className = "sapUiSuccess";
                        break;
                    default:
                        className = "sapUiNeutral";
                        break;
                }
                return className;
            };

            MessageContainer.prototype.addMessage = function (message, index) {
                try {
                    var text, msgElt = document.createElement("div");
                    msgElt.id = "LOGIN_MESSAGE_" + index;
                    msgElt.className = "loginMessage " + this.getSeverityClass(message.severity);
                    msgElt.tabIndex = 0;
                    text = document.createTextNode(message.text);
                    msgElt.appendChild(text);
                    this.container.appendChild(msgElt);
                }
                catch (err) {
                    log.error("Failed to add message: " + err.message);
                    throw err;
                }
            };

        }, { "./Message": 3, "./domUtil": 8, "./log": 11 }], 5: [function (require, module, exports) {
            "use strict";
            var UrlObjectPrototype, anchorParser, parseUrl, basePath, currentOrigin, currentLocation = window.location;

            if (typeof window.URL === "function") {
                parseUrl = function (url) {
                    return new URL(url, window.location.href);
                };
            }
            else {
                // IE does not implement URL constructor
                parseUrl = function (url) {
                    if (!anchorParser) {
                        anchorParser = document.createElement("a");
                    }
                    anchorParser.href = url;
                    return anchorParser;
                };
            }

            function dirname(path) {
                if (path === "/") {
                    return "/";
                }
                var p = path.lastIndexOf("/");
                return p === -1 ? "/" : path.substring(0, p + 1);

            }

            basePath = dirname(currentLocation.pathname);

            function resolve(relativePath) {
                var segments = relativePath.split("/"), resolved = basePath, i, n, segment;
                for (i = 0, n = segments.length; i < n; ++i) {
                    segment = segments[i];
                    switch (segment) {
                        case ".":
                            break;
                        case "..":
                            if (resolved !== "/") {
                                resolved = resolved[resolved.length - 1] === "/" ? dirname(resolved.substring(0, resolved.length - 1)) : dirname(resolved);
                            }
                            break;
                        default:
                            resolved = resolved[resolved.length - 1] === "/" ? resolved + segment : resolved + "/" + segment;
                            break;
                    }
                }
                return resolved;
            }

            /**
             * @classdesc Lightweight URL object
             * @desc Creates a new UrlObject
             * @param {string} url
             * @constructor
             * @property {string} protocol e.g. "http:" or "https:"
             * @property {string} hostname
             * @property {string} port Port will be empty if it corresponds to standard protocol port (i.e. 80 for http, 443 for https)
             * @property {string} host Host as hostname[:port]
             * @property {string} origin Origin as protocol//hostname[:port]
             * @property {boolean} crossOrigin URL is in a different origin
             * @property {string} pathname
             * @property {string} search Query string
             * @property {string} hash Fragment identifier
             * @property {string} href Gets or sets the URL as string
             * @property {object} parameters <key, value> hash corresponding to parsed query string
             */
            function UrlObject(url) {
                this._parse(url);
            }

            module.exports = UrlObject;

            /**
             * Retrieves the host of a given URL as hostname[:port]
             * Port will be omitted if it is the standard port (for http or https)
             * @param  {object} url
             * @param {string} url.protocol
             * @param {string} url.hostname
             * @param {string} url.port
             * @returns {string}
             */
            UrlObject.getHost = function (url) {
                var host = url.hostname, port = url.port;
                switch (url.protocol) {
                    case "http:":
                        if (port && port !== "80") {
                            host += ":" + port;
                        }
                        break;
                    case "https:":
                        if (port && port !== "443") {
                            host += ":" + port;
                        }
                        break;
                    default:
                        break;
                }
                return host;
            };

            UrlObjectPrototype = UrlObject.prototype;
            UrlObjectPrototype._parse = function (url) {
                url = String(url) || currentLocation.href;

                var parsed = parseUrl(url), ieRelative;

                // Internet Explorer does not set protocol, hostname and port on relative URLs
                // Normally this should not happen with trick on pathname[0]
                this.protocol = parsed.protocol || currentLocation.protocol;
                if (parsed.hostname) {
                    this.hostname = parsed.hostname;
                    this.port = parsed.port;
                }
                else {
                    ieRelative = url[0] !== "/";
                    this.hostname = currentLocation.hostname;
                    this.port = currentLocation.port;
                }

                // Align behavior between Chrome, Firefox and IE
                if (this.protocol === "http:" && this.port === "80") {
                    this.port = "";
                }
                else if (this.protocol === "https:" && this.port === "443") {
                    this.port = "";
                }

                if (ieRelative) {
                    this.pathname = resolve(parsed.pathname);
                }
                else {
                    // Internet Explorer removes leading / on relative URLs with absolute path
                    this.pathname = parsed.pathname[0] === "/" ? parsed.pathname : "/" + parsed.pathname;
                }
                this.hash = parsed.hash;
                this.parameters = UrlObject.parseSearch(parsed.search);
            };

            /**
             * Parses search parameter
             * @param {string} search
             * @returns {object}
             */
            UrlObject.parseSearch = function (search) {
                var paramRegExp, matches, params;
                params = {};
                if (search) {
                    paramRegExp = /[?&]([^&=]+)=?([^&]*)/g;
                    matches = paramRegExp.exec(search);
                    while (matches) {
                        params[matches[1]] = matches[2];
                        matches = paramRegExp.exec(search);
                    }
                }
                return params;
            };

            /**
             * Gets query string parameter value
             * @param {string} name
             * @returns {string}
             */
            UrlObjectPrototype.getParameter = function (name) {
                var value = this.parameters[name];
                return (value === undefined || value === null) ? value : decodeURIComponent(value);
            };
            /**
             * Removes query string parameter
             * @param {string} name
             */
            UrlObjectPrototype.removeParameter = function (name) {
                delete this.parameters[name];
            };
            /**
             * Sets query string parameter
             * @param {string} name
             * @param {string} value
             */
            UrlObjectPrototype.setParameter = function (name, value) {
                this.parameters[name] = encodeURIComponent(value);
            };
            Object.defineProperties(UrlObjectPrototype, {
                crossOrigin: {
                    get: function () {
                        return (this.origin !== currentOrigin);
                    }
                },
                host: {
                    get: function () {
                        return UrlObject.getHost(this);
                    }
                },
                href: {
                    get: function () {
                        return this.protocol + "//" + this.host + this.pathname + this.search + this.hash;
                    },
                    set: function (url) {
                        this._parse(url);
                    }
                },
                origin: {
                    get: function () {
                        return this.protocol + "//" + this.host;
                    }
                },
                search: {
                    get: function () {
                        var search, params, name, value;
                        search = "";
                        params = this.parameters;
                        for (name in params) {
                            if (params.hasOwnProperty(name)) {
                                value = params[name];
                                if (search.length > 0) {
                                    search += "&";
                                }
                                search += name;
                                if (value) {
                                    search += "=";
                                    search += value;
                                }
                            }
                        }
                        return (search.length > 0) ? ("?" + search) : search;
                    }
                }
            });

            currentOrigin = window.location.protocol + "//" + UrlObject.getHost(window.location);

        }, {}], 6: [function (require, module, exports) {
            "use strict";

            module.exports = {
                CO_EVENT_CANCEL_PASSWORD: "onCancelPwd",
                CO_EVENT_CHANGE_PASSWORD: "onChangePwd",
                CO_EVENT_CONTINUE_PASSWORD: "onContinuePwd",
                CO_EVENT_CONTINUE_SYS_MESSAGE: "onContinueSysMsg",
                CO_EVENT_DO_CHANGE_PASSWORD: "onDoChangePwd",
                CO_EVENT_DO_DELETE_PASSWORD: "onDoDeletePwd",
                CO_EVENT_INPUT_PROCESSING: "sap-system-login-oninputprocessing",
                CO_EVENT_LOGIN: "onLogin",
                CO_EVENT_POST_REDIRECT: "onPostRedirect",
                CO_EVENT_PROCEED: "onProceed",
                CO_EVENT_SESSION_QUERY: "onSessionQuery",
                CO_EVENT_SYSTEM_MESSAGE: "onSystemMessage",
                MESSAGETYPE_ENUM: 0,
                MESSAGETYPE_ERROR: 1,
                MESSAGETYPE_WARNING: 2,
                MESSAGETYPE_OK: 3,
                MESSAGETYPE_STOP: 4,
                MESSAGETYPE_LOADING: 5,
                MESSAGETYPE_NONE: 6,
                MESSAGETYPE_TEXT: 7,
                SEVERITY: ["info", "error", "warn", "success", "error", "info", "info", "info"]
            };



        }, {}], 7: [function (require, module, exports) {
            "use strict";

            var cssUtil = module.exports;

            cssUtil.getStyle = function (id) {
                var elt = document.getElementById(id);
                return elt && elt.sheet;
            };

            cssUtil.getRule = function (styleId, selector) {
                var i, n, rule, rules, css = this.getStyle(styleId);
                if (css) {
                    rules = css.cssRules || css.rules;
                    for (i = 0, n = rules.length; i < n; ++i) {
                        if (rules[i].selectorText === selector) {
                            rule = rules[i];
                            break;
                        }
                    }
                }
                return rule;
            };

            cssUtil.setUiBackground = function (img) {
                var uiBackground = this.getRule("FIORI_LOGIN_CSS", ".sapUiBackground");
                if (uiBackground) {
                    uiBackground.style.backgroundImage = "url(\"" + img + "\")";
                }
            };
        }, {}], 8: [function (require, module, exports) {
            "use strict";

            var domUtil = module.exports;
            var testBase64Chars = /[^0-9A-Za-z+/]/g;

            // Hash helper functions
            domUtil.encodeString = function (s) {
                var encoded;
                if (s) {
                    encoded = btoa(encodeURIComponent(s));
                    encoded = encoded.replace(/=/g, "");
                }
                else {
                    encoded = "";
                }
                return encoded;
            };
            domUtil.decodeString = function (s) {
                var hash = "";
                if (s && !testBase64Chars.test(s)) {
                    try {
                        hash = decodeURIComponent(atob(s));
                    }
                    catch (error) {
                        void 0;
                    }
                }
                return hash;
            };

            // DOM helper functions
            domUtil.delayedFocus = function (elt) {
                setTimeout(function () {
                    if (typeof elt === "string") {
                        elt = document.getElementById(elt);
                    }
                    if (elt) {
                        elt.focus();
                    }
                }, 100);
            };

            domUtil.deleteElement = function (id) {
                var elt = document.getElementById(id);
                if (elt) {
                    elt.parentNode.removeChild(elt);
                }
            };

            domUtil.deleteElementByName = function (name) {
                var elt = document.getElementsByName(name);
                if (elt.length > 0) {
                    elt = elt[0];
                    elt.parentNode.removeChild(elt);
                }
            };

            domUtil.getFormField = function (name) {
                var input = document.getElementsByName(name);
                return input.length === 0 ? "" : input[0];
            };

            domUtil.setFormField = function (form, name, value, type) {
                var input = document.getElementsByName(name);
                if (input.length === 0) {
                    input = document.createElement("input");
                    input.type = type || "hidden";
                    input.name = name;
                    input.value = value;
                    form.appendChild(input);
                }
                else {
                    input[0].value = value;
                }
            };

            domUtil.validateInput = function (id, errorText, messageContainer, validRegexp) {
                var input = document.getElementById(id);
                var inputValid = validRegexp ? validRegexp.test(input.value) : !!input.value;
                if (!inputValid) {
                    messageContainer.setError(errorText);
                    input.focus();
                }
                return inputValid;
            };

            // CSS
            domUtil.addClass = function (className, element) {
                var startClassName = element.className;
                if (startClassName) {
                    var regexp = new RegExp("\\b" + className + "\\b");
                    if (!regexp.test(startClassName)) {
                        element.className = startClassName + " " + className;
                    }
                }
                else {
                    element.className = className;
                }
            };
            domUtil.removeClass = function (className, element) {
                if (element.className) {
                    var regexp = new RegExp("\\b" + className + "\\b");
                    element.className = element.className.replace(regexp, "");
                }
            };

            // Server messages
            domUtil.unescapeText = function (text) {
                var decoded = "", start = 0, end = text.length, cur, cc;
                while (start < end) {
                    cur = text.indexOf('\\', start);
                    if (cur === -1) {
                        decoded += text.substring(start);
                        break;
                    }
                    decoded += text.substring(start, cur);
                    switch (text[++cur]) {
                        case "x":
                            ++cur;
                            cc = parseInt(text.substring(cur, cur + 2), 16);
                            decoded += isNaN(cc) ? "?" : String.fromCharCode(cc);
                            start = cur + 2;
                            break;
                        case "u":
                            ++cur;
                            cc = parseInt(text.substring(cur, cur + 4), 16);
                            decoded += isNaN(cc) ? "?" : String.fromCharCode(cc);
                            start = cur + 4;
                            break;
                        default:
                            decoded += text[cur++];
                            start = cur;
                    }
                }
                return decoded;
            };

        }, {}], 9: [function (require, module, exports) {
            "use strict";

            function addEventListener(target, type, listener, useCapture) {
                if (!target) {
                    return;
                }
                if (target.addEventListener) {
                    target.addEventListener(type, listener, useCapture);
                }
                else if (target.attachEvent) {
                    target.attachEvent("on" + type, listener);
                }
            }
            function removeEventListener(target, type, listener, useCapture) {
                if (!target) {
                    return;
                }
                if (target.removeEventListener) {
                    target.removeEventListener(type, listener, useCapture);
                }
                else if (target.detachEvent) {
                    target.detachEvent("on" + type, listener);
                }
            }
            module.exports = {
                addEventListener: addEventListener,
                removeEventListener: removeEventListener
            };

        }, {}], 10: [function (require, module, exports) {
            "use strict";

            var events = require("./events");
            var log = require("./log");
            var framebusting = module.exports;

            framebusting.initialize = function (loginParams, shadowMap, onActivated) {
                loginParams = loginParams || {};

                this.shadowMap = shadowMap;
                this.onActivated = onActivated;
                if (!loginParams.framing_control) {
                    this.defaultFramebusting(loginParams.no_default_frame_bust);
                }
            };

            framebusting.activate = function () {
                var self = this;
                if (this.shadowMap) {
                    log.info("Activating page elements");
                    Object.keys(this.shadowMap).forEach(function (source) {
                        var sourceElt = document.getElementById(source);
                        var targetElt = document.getElementById(self.shadowMap[source]);
                        var child;
                        if (sourceElt && targetElt) {
                            while (sourceElt.firstChild) {
                                child = sourceElt.firstChild;
                                sourceElt.removeChild(child);
                                targetElt.appendChild(child);
                            }
                            sourceElt.parentNode.removeChild(sourceElt);
                        }
                    });
                }
                setTimeout(function () {
                    log.debug("Framebusting onActivated");
                    self.onActivated();
                }, 100);
            };

            framebusting.defaultFramebusting = function (allowFraming) {
                var self = this, needActivation = true;

                function handleMessage(event) {
                    var origin = window.location.protocol + "//" + window.location.host;
                    if (event.source && (event.source !== window.parent)) {
                        return;
                    }
                    if (event.origin === origin) {
                        log.info("Framing allowed, activating application");
                        events.removeEventListener(window, "message", handleMessage);
                        self.activate();
                    }
                    else {
                        log.error("Framing denied for origin " + event.origin);
                    }
                }

                try {
                    if ((top === self) || (top.location.href)) {
                        needActivation = false;
                        self.activate();
                    }
                }
                catch (e) {
                    needActivation = true;
                }
                if (needActivation) {
                    if (allowFraming) {
                        log.info("Possible cross-origin framing detected, click-jacking protection is disabled");
                        this.activate();
                    }
                    else {
                        // Portal support: hosting page has same origin but performed domain relaxation
                        log.warn("Possible cross-origin framing detected, activation required");
                        events.addEventListener(window, "message", handleMessage);
                        window.parent.postMessage("ClickJackProt:", "*");
                        window.parent.postMessage("SAPFramingControl:", "*");
                        window.parent.postMessage("SAPFrameProtection*require-origin:", "*");
                    }
                }
            };

        }, { "./events": 9, "./log": 11 }], 11: [function (require, module, exports) {
            "use strict";

            var myConsole = require("./my-console.js");
            var LogLevel = { NONE: "none", DEBUG: "debug", INFO: "info", WARN: "warn", ERROR: "error" };
            var Threshold = { debug: 10, info: 20, warn: 30, error: 40, none: 100 };
            var UrlObject = require("./UrlObject");

            var log = module.exports;
            var params = UrlObject.parseSearch(window.location.search);
            var debugMode = ("sap-ui-debug" in params);

            Object.defineProperty(log, "level", {
                get: function () {
                    return this._level;
                },
                set: function (level) {
                    if (!level || typeof level !== "string") {
                        throw new TypeError("Invalid log level");
                    }
                    level = level.toLowerCase();
                    if (Threshold[level] === undefined) {
                        throw new TypeError("Invalid log level " + level);
                    }
                    this._level = level;
                    this._threshold = Threshold[level];
                }
            });

            log.level = debugMode ? LogLevel.DEBUG : LogLevel.INFO;
            log.buffer = [];

            function format(category, level, message) {
                return category + " [" + level + "] " + message;
            }

            function formatWithTimestamp(category, level, message) {
                return myConsole.timestamp() + " " + format(category, level, message);
            }

            log.pushMessage = function (msg) {
                if (this.buffer.length > 1100) {
                    this.buffer = this.buffer.slice(100);
                }
                this.buffer.push(msg);
            };

            log.debug = function (message, category) {
                if (this._threshold <= Threshold.debug) {
                    myConsole.log(format(category || "login", "DEBUG", message));
                }
                this.pushMessage(formatWithTimestamp(category || "login", "DEBUG", message));
            };

            log.info = function (message, category) {
                if (this._threshold <= Threshold.info) {
                    myConsole.log(format(category || "login", "INFO", message));
                }
                this.pushMessage(formatWithTimestamp(category || "login", "INFO", message));
            };

            log.warn = function (message, category) {
                if (this._threshold <= Threshold.warn) {
                    myConsole.warn(format(category || "login", "WARN", message));
                }
                this.pushMessage(formatWithTimestamp(category || "login", "WARN", message));
            };

            log.error = function (message, category) {
                if (this._threshold <= Threshold.error) {
                    myConsole.error(format(category || "login", "ERROR", message));
                }
                this.pushMessage(formatWithTimestamp(category || "login", "ERROR", message));
            };

        }, { "./UrlObject": 5, "./my-console.js": 14 }], 12: [function (require, module, exports) {
            "use strict";

            var log = require("./log");
            var domUtil = require("./domUtil");

            function unescapeTexts(texts) {
                if (!texts) {
                    return;
                }
                Object.keys(texts).forEach(function (key) {
                    texts[key] = domUtil.unescapeText(texts[key]);
                });
            }

            module.exports = function () {
                var loginData, rawLoginData;
                rawLoginData = document.body.dataset ? document.body.dataset.sapLogin : document.body.getAttribute("data-sap-login");

                try {
                    rawLoginData = atob(rawLoginData);
                    rawLoginData = decodeURIComponent(rawLoginData);
                    loginData = JSON.parse(rawLoginData);
                    unescapeTexts(loginData.texts);
                }
                catch (err) {
                    if (typeof console.log === "function") {
                        log.error("Failed to retrieve login data: " + err.message);
                    }
                    loginData = { _raw: rawLoginData };
                }
                return loginData;
            };

        }, { "./domUtil": 8, "./log": 11 }], 13: [function (require, module, exports) {
            "use strict";

            var constants = require("./constants");
            var domUtil = require("./domUtil");
            var events = require("./events");
            var log = require("./log");
            var HashMonitor = require("./HashMonitor");
            var Controller = require("./Controller");
            var UrlObject = require("./UrlObject");

            var loginController = new Controller({ LOGIN_SHADOW_FORM: "LOGIN_FORM" });

            module.exports = {
                controller: loginController,
                log: log
            };

            require("./oncomplete")(function () {
                loginController.setup();
            });

            loginController.formSetup = function () {
                var loginParams = this.loginData.login_params = this.loginData.login_params || {};
                if (!loginParams.lang_visible) {
                    domUtil.deleteElement("LANGUAGE_BLOCK");
                }
                if (!loginParams.client_visible) {
                    domUtil.deleteElement("CLIENT_BLOCK");
                }
                if (loginParams.url_register) {
                    this.setReturnUrl(document.getElementById("LOGIN_REGISTER_LINK"));
                }
                else {
                    domUtil.deleteElement("LOGIN_REGISTER_BLOCK");
                }
                if (loginParams.url_forgot_pwd) {
                    this.setReturnUrl(document.getElementById("LOGIN_FORGOT_PASSWORD_LINK"));
                }
                else {
                    domUtil.deleteElement("LOGIN_FORGOT_PASSWORD_BLOCK");
                }
                if (this.loginData.login_params.lang_visible) {
                    this.initLangSelect();
                }
            };

            loginController.main = function () {
                if (this.loginData.messages) {
                    this.messageContainer.setServerMessages(this.loginData.messages);
                }
                this.form = document.forms.loginForm;
                this.hashMonitor = new HashMonitor(this.form);
                this.attachHandlers();
            };

            loginController.attachHandlers = function () {
                var self = this;
                events.addEventListener(document.getElementById("LOGIN_LINK"), "click", function (event) {
                    self.submit(event, constants.CO_EVENT_LOGIN);
                });
                events.addEventListener(document.getElementById("CHANGE_PASSWORD_LINK"), "click", function (event) {
                    self.submit(event, constants.CO_EVENT_CHANGE_PASSWORD);
                })
            };

            function langCompare(x, y) {
                return x.text === y.text ? 0 : (x.text < y.text ? -1 : 1);
            }

            loginController.getLanguages = function () {
                var languages = [{ value: "", text: "" }], nwLanguages, appLanguages;
                nwLanguages = this.loginData.languages;
                appLanguages = this.loginData.properties.application_languages;
                appLanguages = appLanguages ? appLanguages.split(",") : Object.keys(nwLanguages);
                appLanguages.forEach(function (lang) {
                    lang = lang.trim();
                    if (nwLanguages[lang]) {
                        languages.push({ value: lang, text: decodeURIComponent(nwLanguages[lang]) });
                    }
                });
                return languages.sort(langCompare);
            };

            loginController.createLangOption = function (lang) {
                var option = document.createElement("option");
                option.value = lang.value;
                if (lang.value) {
                    option.text = lang.value + " - " + lang.text;
                }
                else {
                    option.text = lang.text;
                }
                return option;
            };

            loginController.initLangSelect = function () {
                var self = this, lang;
                this.languages = this.getLanguages();
                this.langSelect = document.getElementById("LANGUAGE_SELECT");
                this.langIndex = 0;
                lang = this.loginData.properties.lang;
                if (!this.langSelect) {
                    log.warn("Language selection control not found");
                    return;
                }
                this.languages.forEach(function (language, index) {
                    self.langSelect.add(self.createLangOption(language));
                    if (language.value === lang) {
                        self.langIndex = index;
                    }
                });
                this.langSelect.selectedIndex = this.langIndex;
            };

            loginController.getLanguage = function () {
                var select, index, lang = "";
                select = document.getElementById("LANGUAGE_SELECT");
                if (select) {
                    index = select.selectedIndex;
                    if ((index >= 0) && (index < this.languages.length)) {
                        lang = this.languages[index].value;
                    }
                }
                return lang;
            };

            loginController.validateInput = function () {
                var messageContainer = this.messageContainer, texts = this.loginData.texts;
                var valid = domUtil.validateInput("USERNAME_FIELD-inner", texts.error_user_initial, messageContainer)
                    && domUtil.validateInput("PASSWORD_FIELD-inner", texts.error_pwd_initial, messageContainer);
                if (this.loginData.login_params.client_visible) {
                    valid = valid && domUtil.validateInput("CLIENT_FIELD-inner", texts.error_client_initial, messageContainer, /\d{3}/);
                }
                return valid;
            };

            loginController.getTelegramCode = function () {
                return document.getElementById("TELEGRAM_FIELD-inner").value
            };

            loginController.getPassword = function () {
                return document.getElementById("PASSWORD_FIELD-inner").value
            };

            loginController.getUserName = function () {
                return document.getElementById("USERNAME_FIELD-inner").value
            };

            loginController.makeRequest = function (sMethod, sUrl, oParam) {
                return new Promise(function (resolve, reject) {
                    var oHttp = new XMLHttpRequest();
                    oHttp.open(sMethod, sUrl, true, this.getUserName(), this.getPassword());


                    if (oParam) {
                        for (var i = 0; i < Object.keys(oParam).length; i++) {
                            oHttp.setRequestHeader(Object.keys(oParam)[i], oParam[Object.keys(oParam)[i]]);
                        }
                    } else {
                        oParam = {
                            'X-CSRF-TOKEN': ''
                        }
                    }

                    oHttp.onload = function () {
                        if (oHttp.status >= 200 && oHttp.status < 300) {
                            resolve({
                                response: oHttp.response,
                                xsrf_token: oHttp.getResponseHeader('X-CSRF-TOKEN') ? oHttp.getResponseHeader('X-CSRF-TOKEN') : oParam['X-CSRF-TOKEN']
                            })
                        } else if (oHttp.status === 401) {
                            reject({
                                status: oHttp.status,
                                statusText: oHttp.statusText
                            });
                        }
                        else {
                            try {
                                var oResponse = JSON.parse(oHttp.responseText);
                            } catch (error) {
                                var oResponse = {
                                    error: {
                                        message: {
                                            value: oHttp.responseText
                                        }
                                    }
                                };
                            }
                            reject({
                                status: oHttp.status,
                                statusText: oHttp.statusText,
                                responseJSON: oResponse
                            });
                        }
                    };

                    oHttp.onerror = function () {
                        try {
                            var oResponse = JSON.parse(oHttp.responseText);
                        } catch (error) {
                            var oResponse = {
                                error: {
                                    message: {
                                        value: oHttp.responseText
                                    }
                                }
                            };
                        }
                        reject({
                            status: oHttp.status,
                            statusText: oHttp.statusText,
                            responseJSON: oResponse
                        });

                    };
                    oHttp.send();
                }.bind(this))
            };

            loginController.getXSRFToken = function () {
                return new Promise(function (resolve, reject) {
                    var sUrl = window.location.origin + "/sap/opu/odata/sap/ZTELEGRAM_AUTH_SRV/$metadata";
                    this.makeRequest('GET', sUrl, {
                        "X-CSRF-TOKEN": "Fetch"
                    }).then(function (oResponse) {
                        resolve(oResponse.xsrf_token);
                    }).catch(reject);
                }.bind(this));

            };

            loginController.handleError = function (oError) {
                this.logOff().then(function (bLoggedOff) {
                    if (bLoggedOff) {
                        this.messageContainer.clear();

                        if (oError.responseJSON) {
                            this.messageContainer.setMessages({ severity: "error", text: oError.responseJSON.error.message.value });
                        } else {
                            this.messageContainer.setMessages({ severity: "error", text: oError.status + ":" + oError.statusText });
                        }
                    }
                }.bind(this))
            };

            loginController.logOff = function () {
                return new Promise(function (resolve, reject) {
                    var sUrl = window.location.origin + "/sap/public/bc/icf/logoff";
                    this.makeRequest('GET', sUrl).then(function () {
                        resolve(true);
                    }).catch(reject);
                }.bind(this));

            };

            loginController.telegramState = {
                codeNotSend: true,
                codeSend: false,
                xsrf_token: ""
            };

            loginController.sendToken = function () {
                this.getXSRFToken().then(function (sToken) {

                    this.telegramState.xsrf_token = sToken;

                    var sUrl = window.location.origin + "/sap/opu/odata/sap/ZTELEGRAM_AUTH_SRV/SendToken";
                    this.makeRequest('POST', sUrl, {
                        "X-CSRF-TOKEN": sToken,
                        "accept": "application/json"
                    }).then(function (oResponse) {
                        document.getElementById("TELEGRAM_BLOCK").hidden = false;
                        this.telegramState.codeNotSend = false;
                        this.telegramState.codeSend = true;

                    }.bind(this))
                        .catch(function (oError) {
                            this.handleError(oError);
                        }.bind(this));
                }.bind(this)).catch(function (oError) {
                    this.handleError(oError);
                }.bind(this));
            };

            loginController.validateToken = function () {
                var sUrl = window.location.origin + "/sap/opu/odata/sap/ZTELEGRAM_AUTH_SRV/ValidateToken?Token='" + this.getTelegramCode() + "'";
                this.makeRequest('POST', sUrl, {
                    "X-CSRF-TOKEN": this.telegramState.xsrf_token,
                    "accept": "application/json"
                }).then(function (oResponse) {
                    if (JSON.parse(oResponse.response).d.ValidateToken.Ok) {
                        this.form.submit();
                    }
                }.bind(this))
                    .catch(function (oError) {
                        this.handleError(oError);
                    }.bind(this));
            };

            loginController.submit = function (event, action) {
                var userInput;
                if (this.loginData.login_params.lang_visible) {
                    domUtil.setFormField(this.form, "sap-language", this.getLanguage());
                }
                userInput = document.getElementById("USERNAME_FIELD-inner");
                if (userInput.value !== userInput.value.trim()) {
                    userInput.value = userInput.value.trim();
                }
                event.preventDefault();
                if (this.validateInput()) {
                    this.messageContainer.clear();

                    if (this.telegramState.codeNotSend) {
                        this.sendToken();
                    } else {
                        this.validateToken();
                    }
                    // domUtil.setFormField(this.form, constants.CO_EVENT_INPUT_PROCESSING, action);
                    // domUtil.addClass("sapUiSraAfterLogin", document.body);
                    // domUtil.addClass("sapUiSraShowLogonAnimation", document.body);

                    return false;

                    this.form.submit();
                    return true;



                }
                return false;
            };

            loginController.setReturnUrl = function (link) {
                var url;
                if (!link) {
                    return;
                }
                url = new UrlObject(link.href);
                url.setParameter("sap-return-url", window.location.href);
                link.href = url.href;
            };

        }, { "./Controller": 1, "./HashMonitor": 2, "./UrlObject": 5, "./constants": 6, "./domUtil": 8, "./events": 9, "./log": 11, "./oncomplete": 15 }], 14: [function (require, module, exports) {
            "use strict";

            var padding = ["", "0", "00", "000", "0000"];
            var isFirefox = navigator.userAgent.indexOf("Firefox") >= 0;

            var myConsole = module.exports;

            function pad(num, len) {
                var output = "" + num;
                if (output.length < len) {
                    output = padding[len - output.length] + output;
                }
                return output;
            }

            function timestamp() {
                var now = new Date();
                var time = pad(now.getHours(), 2) + ":" + pad(now.getMinutes(), 2) + ":";
                time += pad(now.getSeconds(), 2) + "." + pad(now.getMilliseconds(), 3);
                return time;
            }

            function format(message) {
                return isFirefox ? message : timestamp() + " " + message;
            }

            myConsole.timestamp = timestamp;

            myConsole.log = function (message) {
                try {
                    if (window.console && window.console.log) {
                        window.console.log(format(message));
                    }
                }
                catch (err) {
                    void 0;
                }
            };
            myConsole.warn = function (message) {
                try {
                    if (window.console && window.console.log) {
                        if (window.console.warn) {
                            window.console.warn(format(message));
                        }
                        else {
                            window.console.log(format(message));
                        }
                    }
                }
                catch (err) {
                    void 0;
                }
            };
            myConsole.error = function (message) {
                try {
                    if (window.console && window.console.log) {
                        if (window.console.error) {
                            window.console.error(format(message));
                        }
                        else {
                            window.console.log(format(message));
                        }
                    }
                }
                catch (err) {
                    void 0;
                }
            };

        }, {}], 15: [function (require, module, exports) {
            "use strict";

            module.exports = function (cb) {
                if (document.readyState === "complete") {
                    cb();
                }
                else {
                    document.onreadystatechange = function () {
                        if (document.readyState === "complete") {
                            cb();
                        }
                    }
                }
            };

        }, {}]
    }, {}, [13])(13)
});
