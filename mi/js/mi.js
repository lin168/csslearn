
window.onload = function(){
    var pics = ['6a60c7eb2229733d85d8b4aea3be4ddd.webp','9ebff5f5c1f52f2dbdd611897adbefd4.webp',
        '0ef4160c861b998239bce9adb82341e7.webp','01d048d6ca5fea696b60c0431e24fbf3.jpg'];

    index = 0;

    // 设置按钮样式
    var radios = document.querySelectorAll(".radio li");
    console.log(radios);
    radios[index].style.cssText="background-color:rgba(0,0,0,.4);";

    var img = document.querySelector(".main .mid .banner img");

    
    radios[0].onclick=function(){
        radios[index].style.cssText="background-color:transparent;";
        index = 0;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }
    radios[1].onclick=function(){
        radios[index].style.cssText="background-color:transparent;";
        index = 1;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }
    radios[2].onclick=function(){
        radios[index].style.cssText="background-color:transparent;";
        index = 2;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }
    radios[3].onclick=function(){
        radios[index].style.cssText="background-color:transparent;";
        index = 3;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }



    

    // 添加下一个按钮动作
    var next = document.querySelector(".next");
    
    next.onclick = function(){
        radios[index].style.cssText="background-color:transparent;";
        index = ++index%4;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }

    var prev = document.querySelector(".prev");
    prev.onclick = function(){
        radios[index].style.cssText="background-color:transparent;";
        index = (--index+4)%4;
        img.src = "./images/" + pics[index];
        radios[index].style.cssText="background-color:rgba(0,0,0,.4);";
    }


}




