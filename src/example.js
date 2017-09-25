$(document).ready(function(){
  //JSS.fromFile("example2.jss")
  $("#buttonOfSomething").on("click", function(){
    JSS.fromFile("example2.jss")
  })
  $("#backAtItAgain").on("click", function(){
    JSS.fromFile("example.jss")
  })
})
