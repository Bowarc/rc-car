$(document).ready(function () {
    if ("WebSocket" in window){
        websocket = true;
    }else{
        // no web socket support
        websocket = false;
    }

    var msg = { event: 'register', };
    ws_send(msg);
}); // ready end



function ws_send(msg){
    if( websocket == true ){
        // if ws is not open call open_ws, which will call ws_send back
        if( typeof(ws) == 'undefined' || ws.readyState === undefined || ws.readyState > 1){
            open_ws(msg);
        }else{
            ws.send( JSON.stringify(msg) );
        console.log("ws_send sent");
        }
    }
}

function colorize_button(id){
    // switch id{
    // case 'button_up':
    //     console.log('Pressed button up');
    //     let btn = document.getEmementById("button_up");
    //     btn

    // case 'button_left':
    //     console.log('Pressed button left');
    // case 'button_down':
    //     console.log('Pressed button down');
    // case 'button_right':
    //     console.log('Pressed button right');
    // }

    document.getElementById(id).style.backgroundColor = "Red"
}


function open_ws(msg){
    if( typeof(ws) == 'undefined' || ws.readyState === undefined || ws.readyState > 1){
        // websocket on same server with address /websocket
        ws = new WebSocket("ws://localhost:8888/websocket");

        ws.onopen = function(){
            // Web Socket is connected, send data using send()
            console.log("ws open");
                if( msg.length != 0 ){
                    ws_send(msg);
                }
            };

        ws.onmessage = function (evt){
            var received_msg = evt.data;
            console.log(evt.data);
            msg = JSON.parse(evt.data)

            if( msg.event == "Directional Control" ){
                let button_id = '';
                console.log("switch")
                switch (msg.data){
                case 'Up':
                    console.log("up")
                    button_id = 'button_up';
                    break
                case 'Left':
                    console.log("left")
                    button_id = 'button_left';
                    break
                case 'Down':
                    console.log("down")
                    button_id = 'button_down';
                    break
                case 'Right':
                    console.log("right")
                    button_id = 'button_right';
                    break
                }
                if (button_id != ''){
                    colorize_button(button_id)
                }else{
                    console.log(`Could not find the right id for given button ${msg.data}`)
                }
               // process message x
            }else if( msg.event == 'y' ){
               // process message y
            }else if( msg.event == 'z' ) {
               // process message z
            }
        };

        ws.onclose = function(){ 
            // websocket is closed, re-open
            console.log("Connection is closed... reopen");
            var msg = { event: 'register', };
            setTimeout( function(){ws_send(msg);}, 1000 );
        };
   }
}

function button_up(){
    ws_send({event: "Directional Control", data: "Up"})
}
function button_left(){
    ws_send({event: "Directional Control", data: "Left"})
}
function button_down(){
    ws_send({event: "Directional Control", data: "Down"})
}
function button_right(){
    ws_send({event: "Directional Control", data: "Right"})
}
