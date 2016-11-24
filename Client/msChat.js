//jeg aner ikke om noe av dette funker
var button = document.getElementByName("gameButton");
var input = document.getElementByName("chatField");
button.addEventListener("click", function() {
    var msg = input.value;
    connection.send(msg);
})
connection.onmessage

function(e) {
    var msgEl = document.createElement("p");
    msgEl.innerHTML = e.data;
    document.querySelector("chatLog").appendChild(msgEl);
}
