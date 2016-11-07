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

function doSnapshot() {
    fin.desktop.Window.getCurrent().getSnapshot(function(base64Snapshot) {
        var imgsrc = "data:image/png;base64," + base64Snapshot;
        var child = new fin.desktop.Window({
            name: "snapshot-window",
            defaultWidth: 600,
            defaultHeight: 600,
            frame: true,
            autoShow: true,
            defaultTop: 200,
            defaultLeft: 200,
            url: document.location.origin + "/blank.html"
        }, function() {
            child.getNativeWindow().document.getElementById("content").innerHTML = '<img src="' + imgsrc + '" style="width:100%;"/>';
            child.show();
            child.focus();
        });
    });
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

function launchBar() {
    var app = new fin.desktop.Application({
        "name": "Hyperblotter",
        "description": "Hyperblotter Demo",
        "url": "http://cdn.openfin.co/demos/hyperblotter/index.html",
        "__url": "http://localhost:5001/index.html?debug",
        "icon": "http://cdn.openfin.co/demos/hyperblotter/images/hyperblotter_icon.ico",
        "__icon": "http://localhost:5001/images/hyperblotter_icon.ico",
        "uuid": "hyperblotter",
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
    }, function() {
        app.run();
    });

    /*
      var child = new fin.desktop.({
          name: "launchBar",
          defaultWidth: 500,
          defaultHeight: 150,
          frame: true,
          autoShow: false,
          url: "http://localhost:5000/launchbar.html"
      }, function() {

          child.show();
          child.focus();
          callback(child);
      }, function(er) {
          console.log(er);
      });*/
}

function doNotification() {
    var notification = fin.desktop.Notification({
        url: document.location.origin + "/notification.html",
        onShow: function() {
            notification.sendMessage("Some message");
        },
        message: "Hello OpenFin"
    });
}


function launchApp() {
    var app = new fin.desktop.Application({
        url: "https://cdn.openfin.co/demos/hello/index.html",
        uuid: "74BED629-2D8E-4141-8582-73E364BDFA74",
        applicationIcon: "https://cdn.openfin.co/demos/hello/img/openfin.ico",
        name: "Application Name",
        mainWindowOptions: {

            defaultTop: 300,
            defaultLeft: 300,
            autoShow: true,
            frame: false
        }
    }, function() {
        console.log("Application successfully created");
        app.run(function() {
            console.log("successful run");
        }, function(er) {
            console.log(er);
        });
    }, function() {
        console.log("Error creating application");
    });
}
//animate and expand window...

var mInfo;

//toolbar handlers...

(function() {
    'use strict';
    var mainWindow,
        draggableArea,
        //start the cpu window in a hidded state
        cpuWindow,
        interAppWindow,
        flipContainer,
        githubLink,
        openFinApiLink,
        appGalleryLink,
        defaultWindowConfig = {
            defaultHeight: 525,
            defaultWidth: 395,
            maxWidth: 395,
            maxHeight: 525,
        };

    //    document.addEventListener('DOMContentLoaded', function() {


    //OpenFin is ready
    fin.desktop.main(function() {
        //check state of window and adjust restore/maximize button accordingle
        fin.desktop.System.getMonitorInfo(function(i) {
            var info = i;
            mainWindow.getBounds(function(bounds) {
                //is the window already maximized?
                if (info.virtualScreen.right === bounds.width && info.virtualScreen.bottom === (bounds.height + 30)) {
                    document.getElementById("size-icon").src = "img/rest.png";
                } else {
                    document.getElementById("size-icon").src = "img/max.png";
                }
            });
        });

        //request the windows.
        mainWindow = fin.desktop.Window.getCurrent();
        draggableArea = document.querySelector('.container');
        //set event handlers for the different buttons.
        var setEventHandlers = function() {
            let demoHandlers = {
                "new-win": function() {
                    let childWindow = new fin.desktop.Window({
                        name: "childWindow",
                        url: "child.html",
                        defaultWidth: 320,
                        defaultHeight: 320,
                        defaultTop: 10,
                        defaultLeft: 300,
                        frame: false,
                        resize: false,
                        windowState: "normal",
                        autoShow: true
                    }, function() {
                        console.log("The window has successfully been created");
                    }, function() {
                        console.log("Error creating window");
                    });
                }
            };
            //demos
            let demos = document.querySelectorAll('.demo-button');
            for (var i = 0; i < demos.length; i++) {
                let button = demos[i];
                button.addEventListener("click", function(event) {
                    let id = event.target.id;
                    let q = ".hljs." + id;
                    let txt = "";
                    debugger;
                    let selection = document.querySelector(q);
                    if (selection) {
                        txt = selection.innerText;
                    }
                    if (txt) {
                        eval(txt);
                    }
                });
            }

            //Buttons and components.
            var desktopNotificationButton = document.getElementById('desktop-notification'),
                cpuInfoButton = document.getElementById('cpu-info'),
                closeButton = document.getElementById('close-app'),
                arrangeWindowsButton = document.getElementById('arrange-windows'),
                minimizeButton = document.getElementById('minimize-window'),
                maximizeButton = document.getElementById('maximize-window'),
                interAppButton = document.getElementById('inter-app'),
                aboutButton = document.getElementById('about-app');
            flipContainer = document.querySelector('.two-sided-container');
            githubLink = document.getElementById('githubLink');
            openFinApiLink = document.getElementById('openFinApiLink');
            appGalleryLink = document.getElementById('appGalleryLink');

            //Close button event handler
            closeButton.addEventListener('click', function() {
                mainWindow.close();
            });

            //Minimize button event handler
            minimizeButton.addEventListener('click', function() {
                mainWindow.minimize();
            });

            //Minimize button event handler
            maximizeButton.addEventListener('click', function() {

                fin.desktop.System.getMonitorInfo(function(i) {
                    var info = i;
                    mainWindow.getBounds(function(bounds) {
                        //is the window already maximized?
                        if (info.virtualScreen.right === bounds.width && info.virtualScreen.bottom === (bounds.height + 30)) {

                            mainWindow.animate({
                                position: {
                                    left: (info.virtualScreen.right / 2) - 300,
                                    top: (info.virtualScreen.bottom / 2) - 300,
                                    duration: 50
                                },
                                size: {
                                    width: 300,
                                    height: 300,
                                    duration: 50
                                }
                            }, {
                                interrupt: false
                            }, function() {
                                document.getElementById("size-icon").src = "img/max.png";
                            });
                        } else {
                            let h = info.virtualScreen.bottom - 30;
                            mainWindow.animate({
                                position: {
                                    left: 0,
                                    top: 30,
                                    duration: 50
                                },
                                size: {
                                    width: info.virtualScreen.right,
                                    height: (info.virtualScreen.bottom - 30),
                                    duration: 50
                                }
                            }, {
                                interrupt: false
                            }, function() {
                                document.getElementById("size-icon").src = "img/rest.png";
                            });
                        }
                    });
                });
                /*    mainWindow.maximize(function(){},function(er){
                        debugger;
                    })*/
            });

            //  draggableArea = document.querySelector('.container'),

            var runtimeVersionNumberContainer = document.querySelector('#runtime-version-number');

            //Close button event handler
            closeButton.addEventListener('click', function() {
                mainWindow.hide();
            });

            //Minimize button event handler
            minimizeButton.addEventListener('click', function() {
                mainWindow.minimize();
            });

            fin.desktop.System.getVersion(function(version) {
                runtimeVersionNumberContainer.innerText = version;
            });

        };


        //register the event handlers.
        setEventHandlers();

        //set the drag animations.
        animations.defineDraggableArea(mainWindow, draggableArea);

        //show the main window now that we are ready.
        mainWindow.show();

        var flipDisplay = function() {
            flipContainer.classList.toggle("flip");
        };

    });
}());
