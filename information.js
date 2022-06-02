const farmBoxText = document.getElementById("farm-box-text");
const farmTitle = document.getElementById("farm-title");

const desTitle = document.getElementById("des-title");
const desBoxText = document.getElementById("des-box-text");

const sawTitle = document.getElementById("saw-title");
const sawBoxText = document.getElementById("saw-box-text");

const cultureTitle = document.getElementById("culture-title");
const cultureBoxText = document.getElementById("culture-box-text");

function showFarmText(){
    if(farmBoxText.style.display == "grid" && farmTitle.style.display == "none"){
        farmTitle.style.display = "grid"
        farmBoxText.style.display = "none"
    }
    else {
        farmBoxText.style.display = "grid"
        farmTitle.style.display = "none"
    }
}

function showDesText(){
    if(desBoxText.style.display == "grid" && desTitle.style.display =="none"){
        desTitle.style.display = "grid"
        desBoxText.style.display ="none"
    }
    else{
        desBoxText.style.display="grid"
        desTitle.style.display="none"
    }
}

function showSawText(){
    if(sawBoxText.style.display == "grid" && sawTitle.style.display =="none"){
        sawTitle.style.display ="grid"
        sawBoxText.style.display="none"
    }
    else{
        sawBoxText.style.display="grid"
        sawTitle.style.display ="none"
    }
}

function showCultureText(){
    if(cultureBoxText.style.display == "grid" && cultureTitle.style.display =="none"){
        cultureTitle.style.display ="grid"
        cultureBoxText.style.display="none"
    }
    else{
        cultureBoxText.style.display="grid"
        cultureTitle.style.display ="none"
    }
}





