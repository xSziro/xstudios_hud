
$(document).ready(function(){

    var maxvaluehud = $("#healths").css("height")
    var maxcarvaluehud = $("#fuels").css("height")
    let currentDeg = 0;
    var hidden = true 
    var color = "#00FFFF"
    var iconcolor = "#000000"
    var showmax = false
    var position = 0
    var incar = false
    document.getElementById("position1").addEventListener("click",function () {
        document.getElementById("main").style.flexDirection = "row"
        document.getElementById("main").style.right = "0.5vw"
        document.getElementById("main").style.borderTopRightRadius = "1.04vh"
        document.getElementById("main").style.borderBottomRightRadius = "1.04vh"
        document.getElementById("main").style.transform = "translateY(0%)"

        position = 0
        if (incar) {
            $("#main").css("bottom", "10vh");
        }else{
            document.getElementById("main").style.bottom = "0.4%"
        }
        $.post('https://xstudios_uipack/changepos', JSON.stringify({pos:0}));
        
    })
    document.getElementById("position2").addEventListener("click",function () {
        document.getElementById("main").style.flexDirection = "column"
        document.getElementById("main").style.bottom = "50%"
        document.getElementById("main").style.right = "0vw"
        document.getElementById("main").style.borderTopRightRadius = "0vh"
        document.getElementById("main").style.borderBottomRightRadius = "0vh"
        document.getElementById("main").style.transform = "translateY(50%)"

        position = 1


        $.post('https://xstudios_uipack/changepos', JSON.stringify({pos:1}));
        
    })
    document.getElementById("apply").addEventListener("click",function () {
        document.getElementById("setting").style.display = "none"
        $.post('https://xstudios_uipack/closesettings', JSON.stringify({}));
        
    })
    document.getElementById("showfull").addEventListener("click",function () {
        if(document.getElementById("showfull").checked){
            showmax = true
        }else{
            showmax = false

        }
    })
    document.getElementById("showfull").addEventListener("click",function () {
        if (document.getElementById("showfull").checked) {
            document.getElementById("showfull").style.backgroundColor = color
            document.getElementsByClassName("slider")[0].style.backgroundColor = color
        }else{
            document.getElementById("showfull").style.backgroundColor = '#222222'
            document.getElementsByClassName("slider")[0].style.backgroundColor = '#222222'
        }
        
    })

    var translations = {};



    function _(key, params = {}) {
        let text = translations[key] || key;
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value);
        }
        return text;
    }

    function rpm(a) {
        const rpmsElement = document.getElementById("rpms");
        rpmsElement.innerHTML = ``;

        for (let i = 0; i < a && i < 25; i++) {
            rpmsElement.innerHTML += `<div class="rpm" style="background-color:${iconcolor};"></div>`;
        }

        const rpmElements = document.getElementsByClassName("rpm");
        
        if (rpmElements.length === 25) {
            let isRed = false;

            intr = setInterval(function() {
                if (document.getElementsByClassName("rpm").length < 25) {
                    clearInterval(intr); 
                    intr = null; 
                    return; 
                }


                for (let i = 0; i < rpmElements.length; i++) {
                    rpmElements[i].style.opacity = isRed ? "0.0" : "1.0";
                }
                isRed = !isRed;
            }, 100);
        }
    }
    function setspeed(speed) {
        const speedoElement = document.getElementById("speedo");
        speedoElement.innerHTML = speed;
        
        speedoElement.style.fontFamily = "'Uni Sans Demo', sans-serif";
        speedoElement.style.fontWeight = "800"
        speedoElement.style.textAlign = "center"
    }
    function hidehud(type){
        const parent = document.getElementById(type).parentNode;
        parent.style.opacity = 0;  
        setTimeout(() => {
            parent.style.display = "none";  
        }, 50); 
    }

    function showhud(type){
        const parent = document.getElementById(type).parentNode;
        parent.style.display = "block";
        setTimeout(() => {
            parent.style.opacity = 1; 
        }, 50); 
    }

    function updatehud(type, value) {
        const element = document.getElementById(type);
        const parent = element.parentNode;

        if (value < 0) {
            value = 0;
        }
    

        if (type === "shields" || type === "mics") {
            if (value > 0) {
                if (value > 95) {
                    value = 100;
                }
                parent.style.display = "block";
                setTimeout(() => { parent.style.opacity = 1; }, 10);
            } else {
                if (!showmax) {
                    hidehud(type);
                }
            }
        } 

        else if (type === "oxygens") {
            if (value === 100) {
                hidehud(type);
            } else {
                showhud(type);
            }
        }

        else {
            if (showmax || value < 95) {
                showhud(type);
            } else {
                hidehud(type);
            }

        }


        element.style.height = parseInt(maxvaluehud) * (value / 100) + "px";
    }
    
    function updatecarhud(type,value) {
        const element = document.getElementById(type);
        const parent = element.parentNode;
        if (value<0) {
            value = 0
        }




        document.getElementById(type).style.height = parseInt(maxcarvaluehud) * (value/100)+"px";



    }
    function talking(value) {
       if (value) {
            document.getElementById("mic").style.transform = "scale(1.1)"
       }else{
            document.getElementById("mic").style.transform = "scale(1.0)"
       }



    }
    window.addEventListener('message', (event) => {
        let data = event.data
        if(data.type == 'update') {
            updatehud("healths",data.data[0])
            updatehud("shields",data.data[1])
            updatehud("foods",data.data[2])
            updatehud("waters",data.data[3])
            updatehud("waters",data.data[3])
            updatehud("oxygens",data.data[4]*10)

        }else if(data.type == 'groups') {
            if (event.data.data[0] == undefined) {
                $("#grouplista").css("right", "-55.5vw");
                return
            }
            $("#grouplista").css("right", "0");
            event.data.data[0]["name"] = event.data.data[0]["name"] + " (HOST)"
            event.data.data.forEach(element => {
                $("#job").text(element.job)

            });
            document.getElementById("memberlist").innerHTML= "";
            for (i = 0; i < event.data.data.length; ++i) {
                let li = document.createElement('li');
 
                li.innerText = event.data.data[i]["name"];
                document.getElementById("memberlist").appendChild(li);
            }
            
        
        
        
        
        }else if(data.type == "updatecarhud"){
            document.getElementById("metrics").innerHTML = data.metrics
            setspeed(Math.round(data.speed))
            rpm(data.rpms*1.3)
            $("#street").text(data.road);
            $("#compasssq").text(data.compass);
            updatecarhud("fuels",data.fuel)
        }else if(data.type == "updatebelt"){
            if (data.belticon) {
                document.getElementById("backbelt").style.display = 'block'
                document.getElementById("carhud").style.gridTemplateColumns = '25% 45% auto'

                if (data.belt) {
                    document.getElementById("backbelt").style.transform = 'scale(1.0)'
                    document.getElementById("belt").style.backgroundColor = color
                    document.getElementById("belticon").style.fill = iconcolor
                }else{
                    document.getElementById("belt").style.backgroundColor = iconcolor
                    document.getElementById("belticon").style.fill = color
                    setTimeout(() => {
                        document.getElementById("backbelt").style.transform = 'scale(1.2)'
                        
                    }, 400);
                    document.getElementById("backbelt").style.transform = 'scale(1.0)'
                }
                
            }else{
                document.getElementById("carhud").style.gridTemplateColumns = '25% 60% auto'

                document.getElementById("backbelt").style.display = 'none'
            }

        } else if(data.type == "showhud"){
            if (hidden) {
                hidden = false
                $("#hud").css("display", "flex")
                setTimeout(() => {
                    $("#main").css("right", "0.5vw");
                    $("#carhud").css("right", "0.5vw");
                    $("#compass").css("right", "0.5vw");
                    $("#streetname").css("right", "0.5vw");
                
                }, 600);
            }
            
        }else if(data.type == "hidehud"){
            if (!hidden) {
                hidden = true
                $("#main").css("right", "-55.5vw");
                $("#carhud").css("right", "-55.5vw");
                $("#compass").css("right", "-55.5vw");
                $("#streetname").css("right", "-55.5vw");
                setTimeout(() => {
                    $("#hud").css("display", "none")
                }, 600);
            }

            
        }else if(data.type == "updatemic"){
            updatehud("mics",data.voiceMode)
        }else if (data.type == "updatemicstatus") {
            talking(data.status)
        
        }else if(data.type == "showcarhud"){
            if (data.data) {
                incar = true
                $("#carhudcontainer").css("display", "flex");
                if (position == 0 ) {
                    $("#main").css("bottom", "10vh");
                    
                }
                setTimeout(() => {
                    
                    $("#carhud").css("right", "0.5vw");
                    $("#compass").css("right", "0.5vw");
                    $("#streetname").css("right", "0.5vw");
                }, 600);

            }else{
                incar = false
                if (position == 0 ) {
                    $("#main").css("bottom", "0.69vh");
                }
                $("#carhud").css("right", "-55.5vw");
                $("#compass").css("right", "-55.5vw");
                $("#streetname").css("right", "-55.5vw");
                setTimeout(() => {
                    $("#carhudcontainer").css("display", "none");
                }, 600);

            }
        }
        else if(data.type == "updatecolor"){
            color = data.color
            iconcolor = data.iconcolor
            position = data.hudposition
            document.getElementById("belticon").style.fill = iconcolor

            if (position == 0) {
                document.getElementById("position1").checked = true
                document.getElementById("position2").checked = false
                document.getElementById("main").style.flexDirection = "row"
                document.getElementById("main").style.transform = "translateY(0%)"
                position = 0
                document.getElementById("main").style.right = "0.5vw"
                document.getElementById("main").style.borderTopRightRadius = "1.04vh"
                document.getElementById("main").style.borderBottomRightRadius = "1.04vh"
                if (incar) {
                    $("#main").css("bottom", "10vh");
                }else{
                    document.getElementById("main").style.bottom = "0.4%"
                }
                $.post('https://xstudios_uipack/changepos', JSON.stringify({pos:0}));

            }else if (position == 1) {
                document.getElementById("position1").checked = false
                document.getElementById("position2").checked = true

                                    
                document.getElementById("main").style.right = "0.0vw"
                document.getElementById("main").style.borderTopRightRadius = "0.0vw"
                document.getElementById("main").style.borderBottomRightRadius = "0.0vw"
                
                document.getElementById("main").style.flexDirection = "column"
                document.getElementById("main").style.bottom = "50%"
                document.getElementById("main").style.transform = "translateY(50%)"
                position = 1
        
        
                $.post('https://xstudios_uipack/changepos', JSON.stringify({pos:1}));
                
            }
            document.body.style.color = iconcolor
            for (let index = 0; index < document.getElementsByClassName("rpm").length; index++) {
                document.getElementsByClassName("rpm")[index].style.backgroundColor = iconcolor
                
            }
            var colored = document.getElementsByClassName("backcolor")
            if (color == undefined) {
                return
            }
            for (let index = 0; index < colored.length; index++) {
                const element = colored[index];
                element.style.backgroundColor = data.color
            }
            const pickr = Pickr.create({
                el: '#color-picker-container',
                theme: 'nano', // or 'monolith', or 'nano'
                defaultRepresentation: 'HEX',
                comparison: false,
                default: color,

        
            
                components: {
            

                    preview: true,
                    hue: true,
            
  
        
                }
            });
            pickr.on('change', (color, source, instance) => {
                const selectedColor = color.toHEXA().toString();
                color = selectedColor
                document.getElementById("showfull").style.backgroundColor = color
                document.getElementsByClassName("slider")[0].style.backgroundColor = color
                var colored = document.getElementsByClassName("backcolor")
                if (color == undefined) {
                    return
                }
                for (let index = 0; index < colored.length; index++) {
                    const element = colored[index];
                    element.style.backgroundColor = selectedColor
                }
                $.post('https://xstudios_uipack/event', JSON.stringify({color:selectedColor}));
            });
            const pickr2 = Pickr.create({
                el: '#icon-color-picker-container',
                theme: 'nano', // or 'monolith', or 'nano'
                defaultRepresentation: 'HEX',
                comparison: false,
                default: iconcolor,
        
            
                components: {
            

                    preview: true,
                    hue: true,
            

        
                }
            });
            pickr2.on('change', (color, source, instance) => {
                const selectedColor = color.toHEXA().toString();
                color = selectedColor
                document.body.style.color = color
                document.getElementById("belticon").style.fill = color
                $.post('https://xstudios_uipack/icon-event', JSON.stringify({color:selectedColor}));
            });
        }else if(data.type == "opensettings"){
            if(data.open){
                document.getElementById("setting").style.display = "flex"

            }else{
                document.getElementById("setting").style.display = "none"

            }
        }else if (data.type == "translations") {
            translations = event.data.data;
            document.getElementById("apply").innerHTML = _("apply")
            document.getElementById("labelcolor").innerHTML = _("hudcolor")
            document.getElementById("iconcolor").innerHTML = _("iconcolor")

            document.getElementById("showfulllabel").innerHTML = _("showfull")

            document.getElementById("hudpos").innerHTML = _("hudlayout")

            document.getElementById("pos1label").innerHTML = _("vert")
            document.getElementById("pos2label").innerHTML = _("hor")


        }
    })



});
