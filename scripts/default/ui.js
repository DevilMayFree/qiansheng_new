let loadingHasZoomed=false;
let loadingCanZoomed=false;
let canChangeBlock=false;
let view_section=[];
let target = 0;
let length=0;
let section3Swiper;
let isSection3TextMove=false;
let isSection3CansSrollDown=false;
let isSection3CanScrollUp=true;
let isSection3ImgMove=false;
let section4HasMoved=false;
let windowH,haederH;
let needReLoad=false;
let isOver1200;
let timeGap;
let section3Progress;
let secttion5CanChangeSection=true;
$(function(){
    $(window).resize(function(){
        resize();
    }).trigger('resize');
    layoutConfig();
    bindMouseWheelEvent();
    bindMenuClick();
    section3Init();
    section4Init(); 
    section5Init();     
    section7Init();
    section8Init();
    window.onload=()=>{
        aosInit();
    }
})
function resize(){
    windowH=$(window).height();
    windowW=$(window).width();
    headerH=$("header").height();
    if (windowW >= 1200) {
        $("header").addClass("open");
        if(isOver1200 === false){
            needReLoad=true;
        }
        isOver1200=true;
    }
    else{
        $("header").removeClass("open");
        $(".section-0").height(windowH)
        $(".section-1").css("margin-top",windowH);
        if(isOver1200 === true){
            needReLoad=true;
        }
        isOver1200=false;

        $(".button-wrapper").css("top",windowH / 2);
    }

    if(needReLoad){
        location.reload()
    }

    if(windowW>=1400){
        let commonLeft1=$(".section-1 .text-box").css("margin-left");
        $(".section-0 .text-block").css("left",commonLeft1);
        $(".section-3 .main-block .text-box").css("margin-left",commonLeft1);
        $(".section-6 .main-block").css("margin-left",commonLeft1);
        $(".section-7 .main-block").css("margin-left",commonLeft1);
        if($(".section-2 .text-inner").length!=0){    
            let commonLeft2=$(".section-2 .text-inner").css("margin-left").slice(0,-2);
            $(".section-6 .main-box").css("left",+(commonLeft2) + +($(".section-6 .main-block").width()/2))
        }
    }
    calcIframe($(".section-0 iframe"));
}
function layoutConfig(){
    $(window).scrollTop(0);

    $("#index").addClass("text-in");
    setTimeout(function () {
        $("#index").addClass("white-mask-out");
        loadingCanZoomed=true;
    },1000);
    setTimeout(function () {
        $("#index").addClass("text-out");
    },4000);

    if(getCookie('hasRead')){
        $(".cookie-block").addClass("d-none")
    }
    $("header .menu-toggle").click(() => {
        $("header").toggleClass("open");
    })
    $(".cookie-block .close-btn").click(() => {
        $(".cookie-block").hide();
        document.cookie = "hasRead=true"; 
    })
    if(windowW < 1200){
        timeGap=100
    }
    else if(windowW<1600 || isMac()){
        timeGap=1300
    }
    else{
        timeGap=250
    }
    $(".section").each(function () {
        view_section.push($(this));
    });
    length = view_section.length


}
function bindMouseWheelEvent() {  
    //目的： 1.控制loading動畫
    //       2.切換section區塊
    $('html').on('mousewheel DOMMouseScroll touchmove', function (e) {
        //loading執行結束沒
        if(!loadingHasZoomed && loadingCanZoomed){
            $("#index").addClass("zoom"); 
            $(".aside-section .main-block").addClass("active"); 
            $(".section-0").addClass("animate"); 
            
            loadingHasZoomed=true;
            setTimeout(function () {
                $("body").addClass("canScroll");
                canChangeBlock=true; 
            }, timeGap);
        }
        /*
        通則：canChangeBlock為true時，滾動會上下切換block(changeBlock())，並設定canChangeBlock為false，timeGap時間後，設定canChangeBlock為true，以防止block連續切換，timeGap因裝置而有不同

        */
        if (windowW >= 1200) {
            if (canChangeBlock) {
                    var _delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY);
                    e.preventDefault();
                    canChangeBlock = false;
                    if (_delta > 0) { //往上捲  
                        switch (target){
                            case 0:
                                break;
                            case 3:
                                isSection3CansSrollDown=false;
                                if(!isSection3ImgMove && isSection3TextMove){
                                    $(".section-3 .img-box").css("left",(+($(".section-3 .text-box").outerWidth())+ +($(".section-3 .text-box").css("margin-left").replace("px",""))) +"px");
                                    $(".section-3 .text-box").css("transform","translateX(0px)");
                                    $(".section-3 .img-box").removeClass("canScroll");
                                    isSection3TextMove = false;
                                    isSection3CanScrollUp = false;
                                }
                                else if(!isSection3TextMove){
                                    isSection3CanScrollUp = true;
                                }
                                else{
                                    if(windowW >= 2088){
                                        isSection3ImgMove=false;
                                    }
                                    else{
                                        section3Swiper.slidePrev();
                                    }
                                    
                                }
                                if(isSection3CanScrollUp){
                                    scrollUpChangeBlock(target);
                                }
                                break;
                            case 4:
                                if(section4HasMoved){
                                    section4HasMoved=false;
                                    $(".section-4").removeClass("moved");
                                }
                                else{
                                    scrollUpChangeBlock(target);
                                }
                                break;
                            case 5:
                                if($(".section-5 .main-wrapper").scrollTop() === 0 && secttion5CanChangeSection){
                                    scrollUpChangeBlock(target);
                                }
                                break;
                            default:
                                scrollUpChangeBlock(target);
                                break;
                        }
                    } else { //往下捲                 
                        switch(target){
                            case 3:
                                isSection3CanScrollUp=false
                                if(!isSection3TextMove){
                                    let textBoxW=+($(".section-3 .text-box").outerWidth());
                                    let textBoxMR=+($(".section-3 .text-box").css("margin-left").replace("px",""));
                                    $(".section-3 .text-box").css("transform","translateX(-"+(textBoxW+textBoxMR)+"px)");
                                    $(".section-3 .img-box").css("left",0);
                                    $(".section-3 .img-box").addClass("canScroll");
                                    isSection3TextMove=true;
                                }
                                else{
                                    if(windowW >= 2088){
                                        isSection3CansSrollDown=true;
                                    }
                                    else{
                                        isSection3ImgMove=true;
                                        section3Swiper.slideNext();
                                    }
                                    isSection3ImgMove=true;
                                    section3Swiper.slideNext();
                                }
                                if(isSection3CansSrollDown){
                                    scrollDownChangeBlock(target);
                                }
                                break;
                            case 4:
                                if(!section4HasMoved){
                                    section4HasMoved=true;
                                    $(".section-4").addClass("moved");
                                }
                                else{
                                    scrollDownChangeBlock(target);
                                }
                                break;
                            case 5:
                                let scrollTop=$(".section-5 .main-wrapper").scrollTop();
                                let clientHeight = $(".section-5 .main-wrapper").height();
                                let scrollHeight = $(".section.section-5 .main-container").height();
                                if(Math.abs(scrollTop + clientHeight - scrollHeight) < 1 && secttion5CanChangeSection){
                                    scrollDownChangeBlock(target);
                                }
                                break;
                            case 8:
                                break
                            default:
                                scrollDownChangeBlock(target);
                        }
                    }
                setTimeout(function () {
                    canChangeBlock = true;
                }, timeGap);
            }
        }
    });
   
}
function bindMenuClick(){
    if (windowW >= 1200) {
        $("header .menu button").click(function () {
            let new_target,buttonIndex;
            switch ($(this).parent().index()) {
                case 0:
                    new_target=1;
                    break;
                case 1:
                    new_target=2;
                    break;
                case 2:
                    new_target=5;
                    buttonIndex=0;
                    break;
                case 3:
                    new_target=5;
                    buttonIndex=1;
                    break;
                case 4:
                    new_target=5;
                    buttonIndex=2;
                    break;
                case 5:
                    new_target=6;
                    break;
                case 6:
                    new_target=7;
                    break;
            }
            
            var old_target = target;
            if (old_target !== new_target) {
                $(".inner .group").removeClass("active for-active back-active prev next");
                changeBlock({
                    'old': old_target,
                    'new': new_target,
                    'dir': old_target < new_target?'next':'prev'
                });
            }
    
            if(new_target === 5){
                if(old_target === 5){
                    $(".button-wrapper button").eq(buttonIndex).addClass("active").siblings().removeClass("active");
                    section5ChangeItem(buttonIndex);   
                }
                else{
                    //setTimeout是因為要展示畫面(先切換到該card，再橫向移動到定位)
                    setTimeout(function () {
                        $(".button-wrapper button").eq(buttonIndex).addClass("active").siblings().removeClass("active");
                        section5ChangeItem(buttonIndex);    
                    },800)
                }
            }
        }); 
    }
    else{
        $("header .menu button").click((e) => {
            $(window).scrollTop($($(e.target).data("target")).offset().top - headerH);
            $("header").removeClass("open");
        })
    }
}
function section3Init(){
    if(windowW>=1200){
        section3Swiper=new Swiper(".section-3 .img-box", {
            slidesPerView:'auto',
            spaceBetween: 40,
            speed:1000,
            loop:false,
            pagination: {
                el: ".section-3 .swiper-pagination.for-PC",
                type: "progressbar",
                progressbarOpposite:true,
                verticalClass: "swiper-pagination-vertical",
            },
            navigation: {
                nextEl: ".section-3 .swiper-button-next",
                prevEl: ".section-3 .swiper-button-prev",
            },
        });
        let value=+($(".section-3 .text-box").outerWidth()) + +($(".section-3 .text-box").css("margin-left").replace("px",""));
        $(".section-3 .img-box").css("left",value +"px");

        section3Swiper.on('reachEnd', function () {
            setTimeout(() => {
                isSection3CansSrollDown=true;
            },500);
        });
        section3Swiper.on('reachBeginning', function () {
            setTimeout(() => {
                isSection3ImgMove=false;
            },500);
        });
    }
    else{
        new Swiper(".section-3 .img-box", {
            slidesPerView:1,
            spaceBetween: 40,
            speed:800,
            loop:true,
            navigation: {
                nextEl: ".section-3 .swiper-button-next",
                prevEl: ".section-3 .swiper-button-prev",
            },
            pagination: {
                el: ".section-3 .swiper-pagination.for-PAD",
                type: "progressbar",
            },
            breakpoints: {
                768:{
                    slidesPerView: 1.13,
                    spaceBetween: 33,
                },
                992:{
                    slidesPerView: 2.3,
                    spaceBetween: 33,
                },
            }
        });
    }
}
function section4Init(){
    if(windowW<1200){
        $(window).scroll(() => {
            if($(window).scrollTop()>$(".section-4").offset().top - windowH/4){
                $(".section-4").addClass("moved")
            }
        });  
    }
}
function section5Init(){ 
   /*0 - 150 - 170 - 320 - 597.5
     150    20   150   277.5(第三張圖片寬度是前兩張的1.8倍) 

    20意思是20vh高度範圍內，完整顯示第二張圖用
    Trigger1~5 絕對定位，top設以上數值(第一行)


    概念：容器有一個隱藏的直向捲軸，三個item都是絕對定位，透過捲動，當trigger碰觸到螢幕頂部時，觸發trigger，以觸發動態
    main-container高度設定5.975 +100vh高


   */



    if(windowW>=1200){
        // fixme 修改成1/3
        $(".section-5 .main-container").css("height",(windowH * 6.975)/3);
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(".section-5 .item-1", {x:0,scale:1}, {
            x: "-20%",
            scale:0.8, 
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-1-trigger", 
                scrub: 0.5 ,
                start:"top top",
                endTrigger:".item-2-trigger"
            }
        });
        gsap.fromTo(".section-5 .item-1 .mask", {opacity:0}, {
            opacity:1, 
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-1-trigger", 
                scrub: 0.5 ,
                start:"top top",
                endTrigger:".item-2-trigger"
            }
        });
        gsap.fromTo(".section-5 .item-2", {x:"100%"}, {
            x: "0%",
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-1-trigger", 
                scrub: 0.5 ,
                start:"top top",
                endTrigger:".item-2-trigger"
            }
        });
        gsap.fromTo(".section-5 .item-2", {x:"0%",scale:1}, {
            x: "-20%",
            scale:0.8,
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-3-trigger", 
                scrub: 0.5 ,
                start:"top top",
                endTrigger:".item-4-trigger"
            }
        });
        gsap.fromTo(".section-5 .item-2 .mask", {opacity:0}, {
            opacity:1, 
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-3-trigger", 
                scrub: 0.5 ,
                start:"top top",
                endTrigger:".item-4-trigger"
            }
        });
        gsap.fromTo(".section-5 .item-3", {x:"55%"}, {
            x: "-45%",
            scrollTrigger: { 
                scroller: ".section-5 .main-wrapper",
                trigger: ".item-3-trigger", 
                scrub: 1 ,
                start:"top top",
                endTrigger:".item-5-trigger"
            }
        });
        gsap.set(".section-5 .item-2", {x:"100%"});

        $(".button-wrapper button").click((e) => {
            $(e.target).addClass("active").siblings().removeClass("active");
            let index=$(e.target).index();
            section5ChangeItem(index)

        })
        $(".section-5 .main-wrapper").scroll(() => {
            //預防很順利的往上或往下捲
            secttion5CanChangeSection=false;
            setTimeout(() => {
                secttion5CanChangeSection=true;
            },1000)
            //算捲動高度，用來設置button-wrapper button 看哪個要active
            if($(".section-5 .main-wrapper").scrollTop() < windowH * 0.5 - 0.5){
                $(".button-wrapper button").eq(0).addClass("active").siblings().removeClass("active");
            }
            else if($(".section-5 .main-wrapper").scrollTop() < windowH *2.2 - 1){
                $(".button-wrapper button").eq(1).addClass("active").siblings().removeClass("active");
            }
            else{
                $(".button-wrapper button").eq(2).addClass("active").siblings().removeClass("active");
            }
        })
    }
    else{
        $(window).scroll(() => {
            if($(window).scrollTop() > $(".section-5").offset().top -headerH && $(window).scrollTop() < $(".section-5").offset().top + $(".section-5").height() - windowH){
                $(".button-wrapper").addClass("show");
            }
            else{
                $(".button-wrapper").removeClass("show");
            }

            if($(window).scrollTop()>= Math.floor($(".section-5 .item-3").offset().top - headerH)){
                $(".button-wrapper button").eq(2).addClass("active").siblings().removeClass("active");
                $(".button-wrapper .text-group span").eq(2).addClass("active").siblings().removeClass("active");
            }
            else if($(window).scrollTop()>= Math.floor($(".section-5 .item-2").offset().top - headerH)){
                $(".button-wrapper button").eq(1).addClass("active").siblings().removeClass("active");
                $(".button-wrapper .text-group span").eq(1).addClass("active").siblings().removeClass("active");
            }
            else{
                $(".button-wrapper button").eq(0).addClass("active").siblings().removeClass("active");
                $(".button-wrapper .text-group span").eq(0).addClass("active").siblings().removeClass("active");
            }
        })
        $(".button-wrapper button").click((e) => {
            $(e.target).addClass("active").siblings().removeClass("active");
            let index=$(e.target).index();
            $(window).scrollTop($(".section-5 .item-"+(index+1)).offset().top - headerH);
            $(".button-wrapper .text-group span").eq(index).addClass("active").siblings().removeClass("active");
        })
    }
}
function section7Init(){
    new Swiper(".section-7 .swiper", {
        slidesPerView: 1.2,
        spaceBetween: 15,
        loop:true,
        speed: 600,
        autoplay: {
            delay: 3000,
            disableOnInteraction:false
        },
        navigation: {
            nextEl: ".section-7 .swiper-button-next",
            prevEl: ".section-7 .swiper-button-prev",
        },
        pagination: {
            el: ".section-7 .swiper-pagination-PAD",
            type: 'custom',
            renderCustom:function(swiper, current, total){
                return '<span>'+current+'</span><span>'+total+'</span>'
            }
        },
        breakpoints: {
            576:{
                slidesPerView: 2.3,
                spaceBetween: 15, 
                loop:true,
                speed: 600,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction:false
                },
            },
            1200: {
                slidesPerView: 1.8,
                spaceBetween: 24,
                pagination: {
                    el: ".section-7 .swiper-pagination",
                    type: 'custom',
                    renderCustom:function(swiper, current, total){
                        return '<span>'+current+'</span><span>'+total+'</span>'
                    }
                },
            },
            1400: {
                slidesPerView: 2.2,
                spaceBetween: 24,
                pagination: {
                    el: ".section-7 .swiper-pagination",
                    type: 'custom',
                    renderCustom:function(swiper, current, total){
                        return '<span>'+current+'</span><span>'+total+'</span>'
                    }
                },
            },
            1600: {
                slidesPerView: 2.5,
                spaceBetween: 24,
                pagination: {
                    el: ".section-7 .swiper-pagination",
                    type: 'custom',
                    renderCustom:function(swiper, current, total){
                        return '<span>'+current+'</span><span>'+total+'</span>'
                    }
                },
            }
        }
    });
    var progressBarOptionsEnter = {
        startAngle: -1.55,
        size: 63,
        value: 1,
        thickness:1,
        emptyFill: '#d5d5d5',
        fill: {
            color: '#fc8547'
        }
    }
    var progressBarOptionsLeave = {
        startAngle: -1.55,
        size: 63,
        value: 1,
        thickness:1,
        emptyFill: '#d5d5d5',
        fill: {
            color: '#d5d5d5'
        }
    }
    $(".section-7 .swiper-button-prev, .section-7 .swiper-button-next").mouseenter(function() {
        $(this).circleProgress(progressBarOptionsEnter).on('circle-animation-progress');
    });
    $(".section-7 .swiper-button-prev, .section-7 .swiper-button-next").mouseleave(function() {
        $(this).circleProgress(progressBarOptionsLeave).on('circle-animation-progress');
    });
}
function section8Init(){
    $(".goTop").click(function () {
        if(windowW>=1200){
            changeBlock({
                'old': 8,
                'new': 0,
                'dir': 'prev'
            });
        }
        else{
            $("body,html").scrollTop(0)
        }
    }); 
}
function calcIframe(item) {
    var ratio = 0.5625; 
    width = windowH / ratio; 
    if (windowW >= width) {
        $(item).css({ "width": windowW + 240, "height": (windowW + 240) * ratio });
    }
    else {
        $(item).css({ "width": (windowH + 150) / ratio ,  "height": windowH + 150}); 
    }
}
function aosInit(){
    $(window).scroll(() => {
        $("[data-aos]").each(function () {
            if ($(this).offset().top < $(window).scrollTop() + $(window).height() * 1) {
                $(this).addClass("aos-animate");
            }
            else{
                $(this).removeClass("aos-animate");
            }
        });
    });
}
function section5ChangeItem(index){
    let value;
    switch(index){
        case 0:
            value=0;
            break;
        case 1:
            value=1.5;
            break;
        case 2:
            value=3.2;
            break;
    }
    $(".section-5 .main-wrapper").animate({
        scrollTop : windowH * value
    });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function isMac() { 
    return /macintosh|mac os x/i.test(navigator.userAgent); 
};
function changeBlock(obj) {
    //card更改class，用以切換區塊
    $aside  = obj.dir == 'next'? 'prev' : 'next';
    $active = obj.dir == 'next'? 'for-active active':'back-active active';

    $(".section").removeClass("active for-active back-active prev next animate");
    view_section[obj.old].addClass($aside);
    view_section[obj.new].addClass($active);

    //隨著card變動，其他需變動部分
    $("#aside-menu li").removeClass("active").eq(obj.new).addClass("active");
    $(".dots-box .number-inner .number").removeClass("active prev").eq(obj.new).addClass("active").end().eq(obj.new -1).addClass("prev");
    $(".dots-box .dots-inner .dot").removeClass("active").eq(obj.new).addClass("active");
    $("body").removeClass().addClass("in-"+obj.new);

    target=obj.new;
    obj.new === 0 ? $("header").addClass("open") : $("header").removeClass("open");
    obj.new === 0 ? $(".section-0").addClass("animate"):"";
} 
function scrollDownChangeBlock(target){ 
    changeBlock({
        'old': target,
        'new': target + 1,
        'dir': 'next',
    });
}
function scrollUpChangeBlock(target){
    changeBlock({
        'old': target,
        'new': target - 1,
        'dir': 'prev',
    });
}
