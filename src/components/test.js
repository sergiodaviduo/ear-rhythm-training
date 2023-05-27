function test() {
    alert('hierfg');
}

function launch(included) {
    included();
}

launch(test);
alert("I live at the end of the file!");
alert("I live of the file!xf");