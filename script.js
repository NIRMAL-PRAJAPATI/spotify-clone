var windowWidth = window.innerWidth;
var navbar = document.getElementById("navbar");
let leftbox = document.querySelector("#left_box");

$(document).ready(function() {
    $('.song_card').click(function() {
        $('#right_box').load("play_song.html #song_list_container",function(){
            main();
        });
        
    });

    if (windowWidth < 650) {
        console.log("qweqeq")
        navbar.innerHTML = `<img id="navicon" src="img/menu.png" height="27" width="32">`;

        $('#navicon').click(function() {
            leftbox.style.position = "absolute";
            leftbox.style.left = "0vw";
            leftbox.style.width = "100vw";
            leftbox.style.transition = "0.5s";
        })

        $('#closenav').click(function() {
            leftbox.style.left = "-100vw";
        })
    }
})