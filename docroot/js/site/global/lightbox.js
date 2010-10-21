STS.Lightbox = {
    Show : function() {
        STS.Lightbox.Center();
        
        STS.Lightbox._cache.lightbox.show();
        STS.Lightbox._cache.lightboxWrapper.delay(300).fadeIn('slow');
    },
    Hide : function() {
        STS.Lightbox._cache.lightboxWrapper.fadeOut('slow', function() {
            STS.Lightbox._cache.lightbox.hide();
        });        
    },
    Center : function() {    
        STS.Lightbox._cache.lightboxWrapper.css({
            top  : Math.max(0, STS.jQueryWindow.scrollTop() + ((STS.jQueryWindow.height() - STS.Lightbox._cache.lightboxWrapper.outerHeight()) / 2)),
            left : Math.max(0, ((STS.jQueryWindow.width() - STS.Lightbox._cache.lightboxWrapper.outerWidth()) / 2))
        });
    },
    _cache : {}
}

STS.jQueryDocument.ready(function() {
    STS.Lightbox._cache.lightbox        = $('#lightbox');
    STS.Lightbox._cache.lightboxWrapper = $('#lightboxWrapper');
    
    STS.Lightbox._cache.lightboxWrapper.draggable({
        handle : STS.Lightbox._cache.lightboxWrapper.find('#lightboxWrapperHeader')
    });
    
    STS.Lightbox._cache.lightbox.click(function(event) {
        STS.Lightbox.Hide();
    });
});