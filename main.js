document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav.menu');
  if(toggle && menu){
    toggle.addEventListener('click', function(){
      menu.classList.toggle('open');
    });
  }

  document.querySelectorAll('nav.menu > ul > li').forEach(function(li){
    var link = li.querySelector('a.top');
    if(li.querySelector('.submenu')){
      link.addEventListener('click', function(e){
        if(window.innerWidth <= 880){
          e.preventDefault();
          var isOpen = li.classList.contains('open');
          document.querySelectorAll('nav.menu > ul > li.open').forEach(function(o){o.classList.remove('open');});
          if(!isOpen) li.classList.add('open');
        }
      });
    }
  });
});
