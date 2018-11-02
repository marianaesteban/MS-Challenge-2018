// Init slider
$(document).ready(function(){
  $slides = $('.slider').find($('.slide__container'));
  $slides.find('.slide__content').append('<div class="dots"></div>')
  $slides.each(function(i){
    i++
    var $this = $(this);
    var dataNumber =  i++;
    var $dot = '<a class="dots__item" data-product="'+dataNumber+'" href="#"></a>';
    $('.dots').append($dot);
    $this.attr('data-product', dataNumber);
  })
  $color = $('[data-product="1"]').find('.slide__item--variants a:first-child').attr('data-color');
  $('[data-color="'+$color+'"]').addClass('active');
  setTimeout(function(){
    $('[data-product="1"]').addClass('active');
  },100);

  $('.slide__item--variants a').on('click', function(e){
    activateVariant($(this),e);
  });

  $('.dots .dots__item').on('click', function(e){
    activateProduct($(this),e);
    $variant = $('.slide__container.active').find('.slide__item--variants a').first();
    activateVariant($($variant),e);
  });


  $(".slide__item").on('mouseenter', function(){
    $(this).find('.slide__image--skew').addClass('slide--enlarge');
    $(this).siblings().find('.slide__image--skew').addClass('slide--shrink');
  });

  $(".slide__item ").on('mouseleave', function(){
    $(this).find('.slide__image--skew').removeClass('slide--enlarge');
    $(this).siblings().find('.slide__image--skew').removeClass('slide--shrink');
  });

});

function activateProduct(el, e){
  $this = el;
  e.preventDefault();
  $product = $($this).attr('data-product');
  $('[data-product]').removeClass('active');
  $('[data-product="'+$product+'"]').addClass('active')
}
function activateVariant(el, e){
  $this = el;
  e.preventDefault();
  $color = $($this).attr('data-color');
  $('[data-color]').removeClass('active');
  $('[data-color="'+$color+'"]').addClass('active');
}
