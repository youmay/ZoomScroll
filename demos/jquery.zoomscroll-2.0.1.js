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
	 var 	imgPath = '', // ���� �� �����������
	 		preloadedImg = '', // ������������ �����������
	 		
	 		idImgView = "zoomscroll-image-view", // ������������ �����������
	 		idImgClose = "zoomscroll-image-close", // ��������
	 		idImgOverlay = "zoomscroll-image-overlay", // ��������
	 		idImgPreload = "zoomscroll-image-preload", // ��������������� �����������
	 
	 		w = 0, // ������ �����������
	 		h = 0, // ������ �����������
        	t_b = l_b = 20, // ������ �� ������� �� ������ � ������
        	h_o = w_o = 0, // ������������ ������ ������
        	
	 
	 
	/************************
	 * PRIVATE METHODS
	 ************************/
	 
    // ���������� ������������ ������
    _fun_w = function() {
        w_n = w_o-l_b;
        $('#'+idImgView).css({ 'width' : w_n });
        
        h_n = h*w_n/w;
        $('#'+idImgView).css({ 'height' : h_n });            
    },

    
    // ���������� ������������ ������
    _fun_h = function() {            
        h_n = h_o-t_b;
        $('#'+idImgView).css({ 'height' : h_n });
        
        w_n = w*h_n/h;
        $('#'+idImgView).css({ 'width' : w_n });
    },
    
    
    // ������������� draggable 
    _initDrag = function() {
    	$('#'+idImgView).draggable('enable');
    },
    
        
    // ������� ����������� ������ �� ������� ������ �������� �����������
    _dragContainment = function() {
        return [30-$('#'+idImgView).width(),30-$('#'+idImgView).height(),w_o-30,h_o-30];
    },
    
       
    // �������� ��� ������ �����������
    _visible = function(v) {
        $('#'+idImgView).animate({
                opacity: v 
            },
            300,
            function() {
                // ����������
                if(v) {
					$('body').css({'overflow':'hidden','position':'fixed','width':'100%','height':'100%'}); // ����� ������ ���� �������� �� ������� ����
                }
                else {
					$('#'+idImgOverlay+', #'+idImgClose+', #'+idImgView).remove();
					//TODO: ���������� ��������� ��������, � �� ��������
					$('body').css({'overflow':'','position':'','width':'','height':''});
                }
            }            
        )
    },
    
    
    // �������� �������� ����
    _mousewheel = function(e, delta) {
		
		// ������������� ��������
        $('#'+idImgView).stop();
        
        
        /* VARIABLES
        ***********************************************/
        var img = $('#'+idImgView);
        
        var imgW = img.width(); // ������ �����������
        var imgH = img.height(); // ������ �����������
        
        var imgX = img.position().left; // ���������� ����������� x
        var imgY = img.position().top; // ���������� ����������� x
        
        var x = e.layerX == undefined ? (e.offsetX == undefined ? e.pageX : e.offsetX) : e.layerX ; // ���������� ���� x
        var y = e.layerY == undefined ? (e.offsetY == undefined ? e.pageY : e.offsetY) : e.layerY ; // ���������� ���� y
        
        var screenW = $('#'+idImgOverlay).width(); // ������ ������
        var screenH = $('#'+idImgOverlay).height(); // ������ ������
        
        //TODO: ������� � ���������
        var k = ( delta > 0 ) ? 1.25 : 0.555; // 0.8 ����������� �����������
        
        //TODO: � ��������� �������
        if( (imgW < 100 && delta < 0) || (imgW > 10000 && delta > 0) ) return; // ������� �� �������
        
        
        /* �������� ���������
        ***********************************************/
        
        // �������� ������� �����������
        var imgW2 = imgW+delta*Math.round(imgW*k);
        var imgH2 = imgH+delta*Math.round(imgH*k);
        
        
        /* ������ ������ �����������
        ***********************************************/
        
        // ����� ����������� ����� �����, ����� ������ �� ����� ����������
        var pageX = Math.ceil( imgX - (x*((imgW2/imgW)-1)) );
        var pageY = Math.ceil( imgY - (y*((imgH2/imgH)-1)) );        
        
        console.log('pageX: '+pageX);
        console.log('imgX: '+imgX);
        console.log('x: '+x);
        console.log('imgW2: '+imgW2);
        console.log('imgW: '+imgW);
        
        /* ��������
        ***********************************************/
        
        // ��������� draggable �� ����� �������
        img.draggable("disable").animate( { left: pageX, width: imgW2, top: pageY, height: imgH2 }, 600, _initDrag );            
    },
        
	 
	// ������������� ������������ ����������� 
	_myImageHandler = function() {
		
        // �����������
        w = preloadedImg.width;
        h = preloadedImg.height;
        
        // ������� ����������
        $("#"+idImgPreload).remove();
        
        // ��������� ��������
        $("body").append("<div id='"+idImgOverlay+"'></div><img id='"+idImgView+"' src='"+imgPath+"' /><div id='"+idImgClose+"'></div>");
        
        $('#'+idImgOverlay).css({
            'height' : $(window).height()+20
        });
        
        // ��������
        h_o = $(window).height();
        w_o = $(window).width();
        
        // ���������� ������ � ������ ��� �����������
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
        
        // ����� ��� �����������
        $('#'+idImgView).css({        
            'top' : (h_o-h_n)/2,
            'left' : (w_o-w_n)/2
        });
       
        
        // ���������� ��� ��������
        $('#'+idImgOverlay+', #'+idImgClose).on('click', $.zoomscroll.close)
        
        
        // ���������� ��� �������
        $('#'+idImgView).bind('mousewheel', function(e, delta){ _mousewheel(e, delta) });
        
        // ������� ���� �� �����������
        $('#'+idImgView).dblclick(function(){            
            
            // ��������� draggable �� ����� ��������
            $('#'+idImgView).draggable( "disable" );
            
            // �����������
            $('#'+idImgView).stop().animate( { width: w_n, height: h_n, left:(w_o-w_n)/2, top:(h_o-h_n)/2}, 500, _initDrag );
            
        });
        
        // ��� ��� ���� ����, �.�. ��� ����������� ��������� draggable
        $('#'+idImgView).on('mousedown', function(){return false;});
        
        
        // draggable
        $('#'+idImgView).draggable({
            containment: [30-w_n,30-h_n,w_o-30,h_o-30]
        })
        
        // �������� �����������
        _visible(1);
        
	};

	
	
	
	/************************
	 * PUBLIC METHODS
	 ************************/
	 
	// ������������� zoomscroll
	$.fn.zoomscroll = function() {
		
		// ����������: ����
		$(this).on("click", $.zoomscroll.open )
		
		return this;
	};
	
	$.zoomscroll = function() { };
	
	// ������� �����������
	$.zoomscroll.open = function() {
		
		// ��������� ��� �� ����������
		if($("#"+idImgPreload).length) return false;    
		
		// ��������� ������ ��������
		$(this).append("<div id='"+idImgPreload+"'></div>");
		
		// ������������� ����������� ����������
        $('#'+idImgPreload).css({
            'margin-left' : ($(this).find('img').width()/2 - 21),
            'margin-top' : -($(this).find('img').height()/2 + 21)
        });        
        
		// ���������� ���� �� �����������
		imgPath = $(this).attr('href');
		
		// ���������� �����������
		preloadedImg = new Image();
		
		// ������������ �����������
		preloadedImg.src = imgPath;
		
		// ��������� ��������� �� ����������� 
		if(preloadedImg.complete) {
		    // ���� ��, �� ������ ��������� ���������� 
		    _myImageHandler(); 
		} else {
		    // ����� - �������������� ������� onload 
		    preloadedImg.onload = _myImageHandler; 
		}
		
		return false;
	}

	// ������� �����������
	$.zoomscroll.close = function() {
        _visible(0); // ������
	}

})(jQuery);