/*
 * ZoomScroll - FancyBox Plugin
 * Zooming image with scroll
 *
 * Examples and documentation at: http://zoomscroll.com/
 *
 * Copyright (c) 2011 Kirill Shaparov, http://shaparov.ru/
 *
 * Version: 2.0.1 (09/12/2011)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function($) {
	
	
	/************************
	 * LOCAL VARIABLES 
	 ************************/
	 var 	imgPath = '', // путь до изображения
	 		preloadedImg = '', // предзагрузка изображения
	 		
	 		idImgView = "zoomscroll-image-view", // показываемое изображение
	 		idImgClose = "zoomscroll-image-close", // закрытие
	 		idImgOverlay = "zoomscroll-image-overlay", // подложка
	 		idImgPreload = "zoomscroll-image-preload", // предзагружаемое изображение
	 
	 		w = 0, // ширина изображения
	 		h = 0, // высота изображения
        	t_b = l_b = 20, // отступ от бордюра по высоте и ширине
        	h_o = w_o = 0, // оригинальная высота ширина
        	
	 
	 
	/************************
	 * PRIVATE METHODS
	 ************************/
	 
    // вычисление относительно ширины
    _fun_w = function() {
        w_n = w_o-l_b;
        $('#'+idImgView).css({ 'width' : w_n });
        
        h_n = h*w_n/w;
        $('#'+idImgView).css({ 'height' : h_n });            
    },

    
    // вычисление относительно высоты
    _fun_h = function() {            
        h_n = h_o-t_b;
        $('#'+idImgView).css({ 'height' : h_n });
        
        w_n = w*h_n/h;
        $('#'+idImgView).css({ 'width' : w_n });
    },
    
    
    // инициализация draggable 
    _initDrag = function() {
    	$('#'+idImgView).draggable('enable');
    },
    
        
    // функция перерасчета границ за которые нельзя вытащить изображение
    _dragContainment = function() {
        return [30-$('#'+idImgView).width(),30-$('#'+idImgView).height(),w_o-30,h_o-30];
    },
    
       
    // показать или скрыть изображение
    _visible = function(v) {
        $('#'+idImgView).animate({
                opacity: v 
            },
            300,
            function() {
                // показываем
                if(v) {
					$('body').css({'overflow':'hidden','position':'fixed','width':'100%','height':'100%'}); // чтобы нельзя было вытащить за пределы окна
                }
                else {
					$('#'+idImgOverlay+', #'+idImgClose+', #'+idImgView).remove();
					//TODO: возвращать начальные значения, а не обнулять
					$('body').css({'overflow':'','position':'','width':'','height':''});
                }
            }            
        )
    },
    
    
    // движение колесика мыши
    _mousewheel = function(e, delta) {
		
		// останавливаем анимацию
        $('#'+idImgView).stop();
        
        
        /* VARIABLES
        ***********************************************/
        var img = $('#'+idImgView);
        
        var imgW = img.width(); // ширина изображения
        var imgH = img.height(); // высота изображения
        
        var imgX = img.position().left; // координата изображения x
        var imgY = img.position().top; // координата изображения x
        
        var x = e.layerX == undefined ? (e.offsetX == undefined ? e.pageX : e.offsetX) : e.layerX ; // координата мыши x
        var y = e.layerY == undefined ? (e.offsetY == undefined ? e.pageY : e.offsetY) : e.layerY ; // координата мыши y
        
        var screenW = $('#'+idImgOverlay).width(); // ширина экрана
        var screenH = $('#'+idImgOverlay).height(); // высота экрана
        
        //TODO: вынести в настройки
        var k = ( delta > 0 ) ? 1.25 : 0.555; // 0.8 коэффициент приближения
        
        //TODO: в настройки вынести
        if( (imgW < 100 && delta < 0) || (imgW > 10000 && delta > 0) ) return; // выходит за границы
        
        
        /* КОНЕЧНЫЕ ПАРАМЕТРЫ
        ***********************************************/
        
        // конечные размеры изображения
        var imgW2 = imgW+delta*Math.round(imgW*k);
        var imgH2 = imgH+delta*Math.round(imgH*k);
        
        
        /* РАСЧЕТ СДВИГА ИЗОБРАЖЕНИЯ
        ***********************************************/
        
        // сдвиг изображения вверх влево, чтобы скролл от точки происходил
        var pageX = Math.ceil( imgX - (x*((imgW2/imgW)-1)) );
        var pageY = Math.ceil( imgY - (y*((imgH2/imgH)-1)) );        
        
        console.log('pageX: '+pageX);
        console.log('imgX: '+imgX);
        console.log('x: '+x);
        console.log('imgW2: '+imgW2);
        console.log('imgW: '+imgW);
        
        /* АНИМАЦИЯ
        ***********************************************/
        
        // запрещаем draggable во время скролла
        img.draggable("disable").animate( { left: pageX, width: imgW2, top: pageY, height: imgH2 }, 600, _initDrag );            
    },
        
	 
	// инициализация увеличенного изображения 
	_myImageHandler = function() {
		
        // изображение
        w = preloadedImg.width;
        h = preloadedImg.height;
        
        // убираем подгрузчик
        $("#"+idImgPreload).remove();
        
        // добавляем подложку
        $("body").append("<div id='"+idImgOverlay+"'></div><img id='"+idImgView+"' src='"+imgPath+"' /><div id='"+idImgClose+"'></div>");
        
        $('#'+idImgOverlay).css({
            'height' : $(window).height()+20
        });
        
        // подложка
        h_o = $(window).height();
        w_o = $(window).width();
        
        // определяем высоту и ширину для изображения
        if(w > w_o-l_b) {            
            _fun_w();            
            if(h_n > h_o-t_b) _fun_h();
        }
        else if(h > h_o-t_b) {
            _fun_h();            
            if(w_n > w_o-l_b) _fun_w();            
        }
        else {
            h_n = h;
            w_n = w;
        }
        
        // стили для изображения
        $('#'+idImgView).css({        
            'top' : (h_o-h_n)/2,
            'left' : (w_o-w_n)/2
        });
       
        
        // обработчик для закрытия
        $('#'+idImgOverlay+', #'+idImgClose).on('click', $.zoomscroll.close)
        
        
        // увеличение при скролле
        $('#'+idImgView).bind('mousewheel', function(e, delta){ _mousewheel(e, delta) });
        
        // двойной клик по изображению
        $('#'+idImgView).dblclick(function(){            
            
            // запрещаем draggable во время анимации
            $('#'+idImgView).draggable( "disable" );
            
            // изображение
            $('#'+idImgView).stop().animate( { width: w_n, height: h_n, left:(w_o-w_n)/2, top:(h_o-h_n)/2}, 500, _initDrag );
            
        });
        
        // хак для гугл хром, т.к. там срабатывает дефолтный draggable
        $('#'+idImgView).on('mousedown', function(){return false;});
        
        
        // draggable
        $('#'+idImgView).draggable({
            containment: [30-w_n,30-h_n,w_o-30,h_o-30]
        })
        
        // показать изображение
        _visible(1);
        
	};

	
	
	
	/************************
	 * PUBLIC METHODS
	 ************************/
	 
	// Инициализация zoomscroll
	$.fn.zoomscroll = function() {
		
		// обработчик: клик
		$(this).on("click", $.zoomscroll.open )
		
		return this;
	};
	
	$.zoomscroll = function() { };
	
	// Открыть изображение
	$.zoomscroll.open = function() {
		
		// проверяем нет ли прелоадера
		if($("#"+idImgPreload).length) return false;    
		
		// добавляем значок процесса
		$(this).append("<div id='"+idImgPreload+"'></div>");
		
		// позиционируем изображение прелоадера
        $('#'+idImgPreload).css({
            'margin-left' : ($(this).find('img').width()/2 - 21),
            'margin-top' : -($(this).find('img').height()/2 + 21)
        });        
        
		// инициируем путь до изображения
		imgPath = $(this).attr('href');
		
		// инициируем изображение
		preloadedImg = new Image();
		
		// предзагрузка изображения
		preloadedImg.src = imgPath;
		
		// Проверяем загружено ли изображение 
		if(preloadedImg.complete) {
		    // Если да, то просто выполняем обработчик 
		    _myImageHandler(); 
		} else {
		    // Иначе - инициализируем событие onload 
		    preloadedImg.onload = _myImageHandler; 
		}
		
		return false;
	}

	// Закрыть изображение
	$.zoomscroll.close = function() {
        _visible(0); // скрыть
	}

})(jQuery);