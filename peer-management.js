'use strict';

const video1 = document.querySelector('video#video1');
const video2 = document.querySelector('video#video2');
const video3 = document.querySelector('video#video3');
const video4 = document.querySelector('video#video4');

const welcome = document.getElementById('welcome');
const roomNumberPopup = document.getElementById('roomNumberPopup');
const enterRoomButton = document.getElementById('enterRoom');
const newRoomButton = document.getElementById('newRoom');
const roomNumberInput = document.getElementById('roomNumberInput');

const hideRoomNumberButton = document.getElementById('hideRoomNumberButton')

var myPeerId;
let myMediaStream;


function gotMyStream(stream){
    video1.srcObject = stream
    //video2.srcObject = stream
    //video3.srcObject = stream
    //video4.srcObject = stream
    //window.localStream = stream
    myMediaStream = stream
    //console.log(myMediaStream)
}

function callPeer(peerId,video){
    console.log("calling peer")
    var peerCall = peer.call(peerId,myMediaStream)
    peerCall.on('stream', function(stream){
	//console.log("call.on('stream'")
	video.srcObject = stream
    })
    peerCalls.push(peerCall)
}

function connectingPeer(video,stream){
    if(!connectedPeerMediaStreamIDs.includes(stream.id)){
	video.srcObject = stream;
	nextAvailablePeer = Math.min(5,nextAvailablePeer + 1);
	connectedPeerMediaStreamIDs.push(stream.id)
    }   
}

function disconnectingPeer(){
    nextAvailablePeer = Math.max(2,nextAvailablePeer - 1)
}

function startVideo(){
//mediaDevices is disabled in http... only available in https
window.navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(gotMyStream).catch(error => console.log('getUserMedia() error: ', error));
}

function becomePeer(roomNumber){
var peer = new Peer();
peer.on('open', function(id) {
    myPeerID = id
    if(roomNumber){
	roomNumberInput.innerHTML = roomNumber
    }
    else{
	roomNumberInput.innerHTML = myPeerID
    }
    //console.log(id,myPeerID.innerHTML)
});
    peer.on('connection', function(connection){

	if (roomNumber && connectedPeerIDs.length > 0) {
	    connection.send(connectedPeerIDs.join())
	}
	
    })
peer.on('call', function(call){
    console.log("answering call")
    call.answer(myMediaStream);
    call.on('stream', function(stream) {
	
	switch (nextAvailablePeer) {
	case 2:
	    connectingPeer(video2,stream);
	    break;
	case 3:
	    connectingPeer(video3,stream);
	    break;
	case 4:
	    connectingPeer(video4,stream);
	    break;
	default:
	    // haveli is full
	    break;
	}
	var connection = peer.connect(call.peer)
	peerConnections.push(connection)
    })
});

}

function enterRoom(){
    becomePeer(roomNumberInput.value)
    startVideo()
    callPeer(roomNumberInput.value,video2)
    hideWelcome()
    showRoomNumber()
}

function newRoom(){
    becomePeer()
    startVideo()
    hideWelcome()
    showRoomNumber()
}

function showRoomNumber(){
    roomNumberPopup.style.display = "block";
}

function hideWelcome(){
    welcome.style.display = "none";
}

function showWelcome(){
    welcome.style.display = "block";
}

function hideRoomNumber(){
    roomNumberPopup.style.display = "none";
}

enterRoomButton.onclick= enterRoom;
newRoomButton.onclick=newRoom;
hideRoomNumberButton.onclick=hideRoomNumber;
var peerCalls = []
var peerConnections = []
var nextAvailablePeer = 2;
var connectedPeerMediaStreamIDs = []
var connectedPeerIDs = [];

