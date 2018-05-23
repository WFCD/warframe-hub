$(document).ready(function(){
  //Moving Background
  var movementStrength = 4;
  var height = movementStrength / $(window).height();
  var width = movementStrength / $(window).width();
  $('#content').mousemove(function(e){
    var pageX = e.pageX - ($(window).width() / 2);
    var pageY = e.pageY - ($(window).height() / 2);
    var newvalueX = width * pageX * -1 - 4;
    var newvalueY = height * pageY * -1 - 8;
    $('#content').css("background-position", newvalueX+"vw     "+newvalueY+"vh");
  });

  //Dropdown
  $(".dropdown").click(function(){
    $(this).find(".dropdownList").slideToggle("fast");
  });
});

$(document).on("click", function(event){
  var $trigger = $(".dropdown");
  if($trigger !== event.target && !$trigger.has(event.target).length){
    $(".dropdownList").slideUp("fast");
  }
});
