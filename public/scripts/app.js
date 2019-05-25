

$(document).ready(function() {
  $(".new-url").hide();

  console.log(document.cookie.split("=")[1]);


  const $grid = $(".grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: 200,
    gutter:15
  });

  function createTile(resource){
    let newDiv = $("<div>");
    newDiv.addClass("eachResource grid-item");
    $("<div>").addClass("title dataResource").text(resource.title).appendTo(newDiv);
    $("<div>").addClass("description dataResource ").text(resource.description).appendTo(newDiv);
    $("<div>").addClass("category dataResource ").text(resource.category).appendTo(newDiv);
    const imgURL = resource.url_img;
    newDiv.css("background", "url(" + imgURL + ")" + " center / cover no-repeat");
    newDiv.prependTo($(".existing-resource"));
    $grid.masonry( 'prepended', newDiv);
  }

  

  $(() => {
    $.ajax({
      method: "GET",
      url: "api/resources"
    }).done((resources) => {
      for(let resource of resources) {
        createTile(resource);
      }
      
    });
  });

  const addButton = $("#nav-bar .add-button");
  addButton.on("click", function() {
    const newResourceSection = $(".new-url"); 
    if (newResourceSection.is(":hidden")) {
      newResourceSection.slideDown();
      $(".url-area").focus();
    } else {
      newResourceSection.slideUp();
    }
  });

  const submitButton = $(".add-resource");
  submitButton.on("click", function(event) {
    event.preventDefault();
    const data = { 
      url: $(".url-area").val(),
      title: $(".title-area").val(),
      description: $(".descr-area").val(),
      category: $(".cat-area").val(),
      url_img: $(".img-area").val()
    };
    $.ajax({
      method: "POST",
      url: "api/resources",
      data: data
    }).done((response) => {
      const resourceInfo = response.result[0];
      console.log("resourceinfo", resourceInfo);
      createTile(resourceInfo);
    });
  });

  const searchBar = $(".searchbar");
  searchBar.on('click', function (event){
    var data = "css";
    $.ajax({
      url: '/api/resources/search/'+ data,
      method: 'GET',
      dataType: 'json',
      success: function(result){
        console.log("we are good ",result);
      }, 
      error: function(err){
        console.log("we are not good ",err);
      }
    });

    //do it through the params

  //  ` $ajax({
  //     method: "GET",
  //     url: "api/resources/search"
  //   }).done((resources) => {
  //     for(let resource of resources) {
  //       createTile(resource);
  //     }
      
  //   })`;
  });




});