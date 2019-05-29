$(document).ready(function(){
  const logInButton = $('button.login');
  const likeButton = $('button.likeButton');
  const unLikeButton = $('button.unLikeButton')
  const user_id = $('input');
  const rankButton = $('input.rankButton');
  const commentButton = $('.commentBox input');
  const pathName = window.location.pathname;
  const pathInt = parseInt(pathName.slice(1,pathName.length));

  const renderPage = () => {
    $('#anchor').empty();
    $.get('/api/resources/'+ pathInt) //---->>> 2 is resource id, hardcoded
      .then((object) => {
        if(Cookies.get('user_id') === undefined) {
          renderUserPublicPage(object);
        } else {
          renderUserSpecificPage(object);
        }
      }); 
  };

  const renderUserSpecificPage = (resource) => {
    renderComments(resource.comments); 
    renderLikes(resource.likes);
    renderRank(resource.ranks);
    renderResources(resource.resourceProperties[0]);
    checkPersonalLike(resource.personalLike);
    checkPersonalRank(resource.personalRank);
    $('.rankBox').show();
    $('.commentBox').show();
    
  };
  const renderComments = (comments) => {
    const reverseComments = comments.reverse()
    for(comment of reverseComments) {
      $('.comment-box').append(renderComment(comment));
    }
  };

  const renderComment = (comment) => {
    const newArticle = $('<article>').addClass('comment');
    const parag = $('<p>').addClass('comment-text').text(comment.comment);
    return newArticle.append(parag);
  };

  const renderLikes = (like) => {
    $('.totalLike').empty();
    const count = like[0].count;
    $('.totalLike').text(`this resource has ${count} likes`);
  };

  const renderRank = (rank) => {
    $('.averageRank').empty();
    if(rank[0].avg === null) {
      $('.averageRank').text('No rank');
    }
    else {
      const avg_rank = parseFloat(Math.round(rank[0].avg * 100) / 100).toFixed(0);
      $('.averageRank').append($('<p>').text(`average rank: ${avg_rank}`));
    }
  };

  const renderResources = (properties) => {
    $('div.properties').empty();
    const createdWhen = properties.create_at;
    const createdThen = createdWhen.slice(0,-14);
    $('div.properties')
      .append(`<p class = 'title'> ${properties.title}</p>`)
      .append(`<p class = 'description'> ${properties.description}</p>`)
      .append(`<p class = 'category'> ${properties.category}</p>`)
      .append(`<p class = 'url'> <a href = "${properties.url}">${properties.url}</a></p>`)
      .append(`<img class = 'image' src = ${properties.url_img}>`)
      .append(`<p class = 'createdTime'> created: ${createdThen}</p>`)
      .addClass('properties');

  };

  const checkPersonalRank = (personalRanks) => {
    $('.personalRank').empty();
    if(personalRanks === undefined) {
      $('.personalRank').append(`<p> </p>`);
    } 
    else {
      for(personalRank of personalRanks) {
        if(personalRank.user_id === parseInt(Cookies.get('user_id'))){
          $('.personalRank').append(`<p>my ranking: ${parseInt(personalRank.rank_value)}</p>`);
          return;
        }
      }
      $('.personalRank').append(`<p> </p>`);
    }
  };

  const checkPersonalLike = (personalLikes) => {
    $('.personalLike').empty();
    if(personalLikes === undefined) {
      $('.personalLike').text('Not Liked');
      $('form.like').show();
      $('form.unlike').hide();
    }
    else {
      for(personalLike of personalLikes) {
        if(personalLike.user_id === parseInt(Cookies.get('user_id'))){
          $('.personalLike').text('LIKED!');
          $('form.like').hide(); 
          $('form.unlike').show();
          return;
        }
      } 
      $('.personalLike').text('Not Liked');
      $('form.like').show();
      $('form.unlike').hide();
    }
  };

  const renderUserPublicPage = (resource) => {
    renderLikes(resource.likes);
    renderRank(resource.ranks);
    renderResources(resource.resourceProperties[0]);
    renderComments(resource.comments);
    $('form.like').hide();
    $('form.unlike').hide();
    $('form.rankBox').hide();
    $('.commentBox').hide();
    
  }

  likeButton.on('click', function(e) {
    e.preventDefault();
    $.post('/api/resources/'+ pathInt + '/like',{user_id : Cookies.get('user_id')});
    renderPage();
    $('form.like').hide();
    $('form.unlike').show();
  });

  unLikeButton.on('click', function(e) {
    e.preventDefault();
    $.post('/api/resources/'+ pathInt +'/like/delete',{user_id : Cookies.get('user_id')})
  });
  

  logInButton.on('click', function(e) {
    e.preventDefault();
    Cookies.set('user_id',user_id.val());
    renderPage();
  }); 

  rankButton.on('click',function(e) {
    e.preventDefault();
    const rankValue = $('select option:selected').val()
    $.post('/api/resources/'+ pathInt + '/rank',{user_id : Cookies.get('user_id'),
      rank_value : parseInt(rankValue)});
    renderPage();
  });

  commentButton.on('click', function(e) {
    e.preventDefault();
    const newComment = $('.commentBox textarea').val();
    $.post('/api/resources/'+ pathInt +'/comment', {user_id :Cookies.get('user_id'), comment : newComment})
    renderPage();
  })
  renderPage()
})
