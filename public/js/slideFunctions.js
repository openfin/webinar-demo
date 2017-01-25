function doFlash() {
    fin.desktop.Window.getCurrent().blur(function() {
        fin.desktop.Window.getCurrent().flash();
    });
}

function doBlur() {
    fin.desktop.Window.getCurrent().blur(function() {
        window.setTimeout(function() {
            fin.desktop.Window.getCurrent().focus();
        }, 1500);
    });
}

function launchHyperblotter() {
    var hyperb = new fin.desktop.Application({
        url: "http://cdn.openfin.co/demos/hyperblotter/index.html",
        uuid: "hyperblotter-demo",
        applicationIcon: "http://cdn.openfin.co/demos/hyperblotter/images/hyperblotter_icon.ico",
        name: "Hyperblotter",
        mainWindowOptions: {
            "autoShow": true,
            "defaultWidth": 360,
            "maxWidth": 360,
            "minWidth": 360,
            "maxHeight": 90,
            "defaultHeight": 90,
            "minHeight": 90,
            "defaultTop": 50,
            "defaultLeft": 10,
            "resizable": false,
            "maximizable": false,
            "frame": false,
            "alwaysOnTop": true,
            "cornerRounding": {
                "width": 5,
                "height": 5
            }
        }
    }, function() {
        console.log("Application successfully created");
        hyperb.run();
    }, function() {
        console.log("Error creating application");
    });
}

function externalLink(event) {
    var url = event.target.getAttribute("data-link");
    fin.desktop.System.openUrlWithBrowser(url);
}

var start;

function doMulti() {
    start = Date.now();
    var text = "HELLOWORLD";
    var windows = [];
    fin.desktop.System.getMonitorInfo(function(info) {
        console.log("monitor info @ " + (Date.now() - start));
        start = Date.now();
        var width = info.virtualScreen.right - 150;
        var height = info.virtualScreen.bottom;
        var cols = 4; //Math.floor(width/200);
        var rows = Math.ceil(text.length / cols);
        var i = 0;
        var r = 0;
        var c = 0;

        function drawWin() {
            if (i < text.length) {
                //end of row?
                if (c > cols) {
                    c = 0;
                    r++;
                }
                var msg = text[i];
                msgWin(msg, r, c, function(child) {
                    windows.push(child);
                    c++;
                    i++;
                    drawWin();
                });
            }
        }
        drawWin();

    });

    window.closeMultiDemo = function() {
        windows.forEach(function(win) {
            win.focus();
            win.close();
        });
        windows = [];

    };
}

function msgWin(msg, r, c, callback) {
    console.log("call msgWin @ " + (Date.now() - start));
    start = Date.now();
    var child = new fin.desktop.Window({
        name: "multi_" + r + "_" + c,
        defaultWidth: 150,
        defaultHeight: 150,
        frame: false,
        autoShow: false,
        defaultTop: 200 * r,
        defaultLeft: 200 * c,
        url: document.location.origin + "/blank.html"
    }, function() {
        console.log("window @ " + (Date.now() - start));
        //	child.moveTo((200 * c),(200 *r));
        // gets the HTML window of the child
        var wnd = child.getNativeWindow();

        wnd.document.getElementById("content").innerHTML = '<h1>' + msg + '</h1>';

        child.show();
        child.focus();
        callback(child);
    }, function(er) {
        console.log(er);
    });
}




var mInfo;

//toolbar handlers...

(function() {
    'use strict';
    var mainWindow;


    //OpenFin is ready
    fin.desktop.main(function() {

        //request the windows.
        mainWindow = fin.desktop.Window.getCurrent();
        //set event handlers for the different buttons.
        var setEventHandlers = function() {

            //hyperblotter link
            document.getElementById("hyperblotter").addEventListener("click", launchHyperblotter);

            //demos
            var demos = document.querySelectorAll('.demo-button');

            function demoClick(event) {
                let id = event.target.id;
                let q = ".hljs." + id;
                let txt = "";
                let selection = document.querySelector(q);
                if (selection) {
                    txt = selection.innerText;
                }
                if (txt) {
                    eval(txt);
                }
            }

            for (var i = 0; i < demos.length; i++) {
                let button = demos[i];
                button.addEventListener("click", demoClick);
            }

            var runtimeVersionNumberContainer = document.querySelector('#runtime-version-number');

            var exLinks = document.querySelectorAll(".external");
            for (var i = 0; i < exLinks.length; i++) {
                let lnk = exLinks[i];
                lnk.addEventListener("click", externalLink);
            }
        };


        //register the event handlers.
        setEventHandlers();


        //show the main window now that we are ready.
        mainWindow.show();


    });
}());
