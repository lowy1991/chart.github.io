var carousel		= $('.carousel');
var carouselInner 	= $('#carousel-inner');
var currPage		= $('#current-page');
var totalPage 		= $('#total-page');
var carouselPage	= 1;
var count 			= 0;
var countWeek		= 0;
var countMonth		= 0; 
var countYear		= 0;
var page 			= 0;
var	lastLogin		= 0;
var maxCol 			= 10;
var maxColMobile	= 5;
var maxItem			= 1000;
var maxNum			= 0;
var maxPage			= 0;

function change() {
	if (page <= maxPage) {
		if (count >= 0) {
			$(`#chart-${page} #lion-${count}`).css('filter', 'grayscale(0%)');
			$(`#chart-${page} #lion-${count}`).css('cursor', 'default');
			$(`#chart-${page} #lion-${count}`).off('click', change);
			update();
			$(`#chart-${page} #lion-${count}`).css('cursor', 'pointer');
			$(`#chart-${page} #lion-${count}`).on('click', change);
		}
	}
}

function checkCookie() {
	var currCount 	= getCookie('count');
	var d 			= new Date();
	if (currCount == "") {
		setCookie('count', 0, 365);
		setCookie('countWeek', 0, 365);
		setCookie('countMonth', 0, 365);
		setCookie('countYear', 0, 365);
		setCookie('lastLogin', d.toUTCString(), 365);
		setCookie('page', 0, 365);
	}
	else {
		count 		= parseInt(currCount);
		countWeek	= parseInt(getCookie('countWeek'));
		countMonth	= parseInt(getCookie('countMonth'));
		countYear	= parseInt(getCookie('countYear'));
		lastLogin	= new Date(Date.parse(getCookie('lastLogin')));
		page 		= parseInt(getCookie('page'));
	}
}	

function getCookie(cname) {
	var name = cname + "=";
  	var decodedCookie = decodeURIComponent(document.cookie);
  	var ca = decodedCookie.split(';');
  	for(var i = 0; i < ca.length; i++) {
  		var c = ca[i];
   		while (c.charAt(0) == ' ') {
      		c = c.substring(1);
    	}
    	if (c.indexOf(name) == 0) {
      		return c.substring(name.length, c.length);
    	}
    }
  	return "";
}

function getMaxpages() {
	if (window.matchMedia("(max-width: 768px)").matches) {
		maxNum		= 25;
	}
	else {
		maxNum		= 50;
	}
	maxPage		= maxItem/maxNum;
	currPage.text(carouselPage);
	totalPage.text(maxPage);
}

function getWidth() {
	var carouselItem= $('.carousel-item');
	var imgWidth 	= 0; 
	if (window.matchMedia("(max-width: 768px)").matches) {
		return imgWidth	= Math.floor(parseInt(carouselItem.width())/maxColMobile);
	}
	else {
		return imgWidth	= Math.floor(parseInt(carouselItem.width())/maxCol);	
	}
}

function loadCarousel() {
	var	imgWidth 	= 0;
	getMaxpages();
	for (i = 0; i < maxPage; i++) {
		if (i == 0) {
			carouselInner.append(`<div class="active carousel-item m-0 w-50"><div class="d-flex flex-wrap justify-content-center" id="chart-${i}"></div></div>`);
		}
		else {
			carouselInner.append(`<div class="carousel-item m-0 w-50"><div class="d-flex flex-wrap justify-content-center" id="chart-${i}"></div></div>`);
		}
		imgWidth = getWidth();
		loadChart(i, imgWidth);
	}
}

function loadChart(selector, imgWidth) {
	var padding	= imgWidth/10;
	for (j = 0; j < maxNum; j++) {
  		$(`#chart-${selector}`).append(`<img src="static/img/lion.svg" class="center-block" id="lion-${j}"/>`);
  		if (selector > page || (selector == page && j >= count)) {
  			$(`#chart-${selector} #lion-${j}`).css('filter', 'grayscale(100%)');	
  		}
  		$(`#chart-${selector} #lion-${j}`).css('padding', padding);
  		$(`#chart-${selector} #lion-${j}`).width(imgWidth-padding*2);
	}
	readyChart();
}

function readyChart() {
	$(`#chart-${page} #lion-${count}`).css('cursor', 'pointer');
	$(`#chart-${page} #lion-${count}`).on('click', change);
}

function setCookie(cname, cvalue, exdays) {
  	var d = new Date();
  	var expires; 
  	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  	expires = "expires="+ d.toUTCString();
  	document.cookie 	= cname + "=" + cvalue + ";" + expires + ";path=/";
}

function update() {
	if (count == (maxNum-1)) {
		count 	= 0;
		page++;
		carousel.carousel('next');	
	}
	else {
		count 	= (count+1)%maxNum;
	}
	setCookie('count', count, 365);
	setCookie('page', page, 365);
}

carousel.bind('slide.bs.carousel', function (e) {
    if (e.direction == 'left') {
    	if (carouselPage == maxPage) {
    		carouselPage	= 1;
    	}
    	else {
    		carouselPage++;
    	}
    }
    else {
    	if (carouselPage == 1) {
    		carouselPage	= maxPage;
    	}
    	else {
    		carouselPage--;	
    	}
    }
    currPage.text(carouselPage);
});

$(document).ready(function() {
	checkCookie();
	loadCarousel();
});