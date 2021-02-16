

window.onload=function(){
    var parts = document.querySelectorAll(".part");
    var lis = document.querySelectorAll(".screen-change li");
    parts[0].style.display="block";
    lis[0].style.backgroundColor="#fff";

}

function handclick(index){
    var parts = document.querySelectorAll(".part");
    var lis = document.querySelectorAll(".screen-change li");
    for(var i=0;i<4;i++){
        if(i == index){
            parts[i].style.display="block";
            lis[i].style.backgroundColor="#fff";
        } else{
            parts[i].style.display="none";
            lis[i].style.backgroundColor="transparent";
        }



    }


}
