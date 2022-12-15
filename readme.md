The goal of this project is to be able to control a rc-car with any web browser connected to lan.

It uses the web framework [Tornado](https://www.tornadoweb.org/en/stable/) to create a multi sender single receiver system using websockets

### Current state:

- [X] Web server
  - [X] Any client can give any input
  - [X] Inter client button state syncing (switch colors on client 2 when client 1 press a button)
- [ ] Controller  
  - [ ] ?


Heavily insprired by [this github repo](https://github.com/cankav/simple_websocket_example) as i have close to 0 experience making webservers.