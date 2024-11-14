ESX = exports.es_extended:getSharedObject()
local directions = {"N", "NE", "E", "SE", "S", "SW", "W", "NW"}
local hudState = false
local inVeh = false
local started = false
local hudcolor = ""
local iconcolor = ""
local shown = false
local locales = {}
local hidden = false


function loadLocale(lang)
    local file = LoadResourceFile(GetCurrentResourceName(), "locales/" .. Config.Locale .. ".json")
    if file then
        locales = json.decode(file) or {}

        Citizen.Wait(100)
        SendNUIMessage({
            type = "translations",
            data = locales,  
        })

    else
        Citizen.CreateThread(function ()
            while true do
                Citizen.Wait(1000)
                print("#-------xStudios-uipack-------#")
                print("| Language has not been found |")
                print("#-----------------------------#")
            end
        end)

    end
end
function sendTranslationsToNUI()
    SendNUIMessage({
        type = "translations",
        data = locales,  
    })
end
function _(key, params)
    local text = locales[key] or key
    if params then
        for k, v in pairs(params) do
            text = text:gsub("{" .. k .. "}", v)
        end
    end
    return text
end




RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function()
    loadLocale(Config.Locale)
    
    Citizen.Wait(1000)
    SetupHud()
end)

Citizen.CreateThread(function()
    loadLocale(Config.Locale)
    Citizen.Wait(1000)

    SetupHud()
end)

function SetupHud()
    loadLocale(Config.Locale)
    DisplayRadar(false)
    SetRadarBigmapEnabled(true, false)
    Wait(100)
    SetRadarBigmapEnabled(false, false)
    SendNUIMessage({action = 'showhud', state = true})
    hudState = true
    SendNUIMessage({
        type = 'updatecarhud',
        carhud = inVeh,
    })          

    if (not started) then
        started = true
    end
    Citizen.CreateThread(function()
        local minimap = RequestScaleformMovie("minimap")
        SetRadarBigmapEnabled(true, false)
        Wait(0)
        SetRadarBigmapEnabled(false, false)
        while true do
            Wait(0)
            BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
            ScaleformMovieMethodAddParamInt(3)
            EndScaleformMovieMethod()
        end
    end)
    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(500)
            local talking = NetworkIsPlayerTalking(PlayerId())
            SendNUIMessage({
                type = "updatemicstatus",
                status = talking,
            })
            SendNUIMessage({
                type = 'updatebelt',
                belticon = Config.seatbelt,
                belt = Config.seatbeltgetter(),

            })
        end
    end)
end

function hidehud()
    hidden = true
    SendNUIMessage({
        type = "hidehud",
    })
    SendNUIMessage({
        type = "opensettings",
        open = false,
    })
end
RegisterCommand("togglehud", function()
    ToggleHUD()
end,false)

RegisterKeyMapping("togglehud", "Przełącz HUD", "mouse_button", "MOUSE_MIDDLE")
AddEventHandler('esx:pauseMenuActive', function(isActive)
    hidehud()
end)

function showhud()

    hidden = false
    SendNUIMessage({
        type = "showhud",
    })
end




function ToggleHUD()
    if hudState then
        hudState = not hudState
        showhud()
        if inVeh then
            SendNUIMessage({
                type = "showcarhud",
                data = inVeh,
            })
        end
    else
        hudState = not hudState
        hidehud()
    end
end
local voiceMode = 2
local voiceModes = {}
local usingRadio = false
RegisterNetEvent('xstudios_uipack:opensettings')
AddEventHandler('xstudios_uipack:opensettings', function(data)
        SetNuiFocus(true,true)
        SendNUIMessage({
            type = "opensettings",
            open = true,
        })
end)
RegisterNUICallback("closesettings", function(data, cb)
    SetNuiFocus(false,false)

    cb()
end)
RegisterNUICallback("icon-event", function(data, cb)

    TriggerServerEvent("xstudios_uipack:seticoncolor", data.color)

    cb()
end)
RegisterNUICallback("changepos", function(data, cb)

    TriggerServerEvent("xstudios_uipack:setpos", data.pos)

    cb()
end)
RegisterNUICallback("event", function(data, cb)

    TriggerServerEvent("xstudios_uipack:setcolor", data.color)

    cb()
end)
AddEventHandler('esx_status:onTick', function(data)


    ESX.TriggerServerCallback('xstudios_uipack:getcolor', function(color,icon,position)
        if hudcolor ~= color or iconcolor ~= icon then
            hudcolor = color
            iconcolor = icon
            hudpos = position
            SendNUIMessage({
                type = "updatecolor",
                color = color,
                iconcolor = iconcolor,
                hudposition = hudpos,
            })
        end
    end)
    local heading = GetEntityHeading(PlayerPedId())
    local hp = math.floor((GetEntityHealth(PlayerPedId()) - 100) / (GetEntityMaxHealth(PlayerPedId()) - 100) * 100)
    local armor = (GetPedArmour(PlayerPedId()))
    local oxygen = (GetPlayerUnderwaterTimeRemaining(PlayerId()))
    local phone = LocalPlayer.state.PhoneOpen
    local voice = LocalPlayer.state.proximity.distance
    if voice then
        if voice == 1.5 then
            voice = 25
        elseif voice == 3.0 then
            voice = 50

        elseif voice == 6.0 then
            voice = 100

        else
            SetTextFont(0)
            SetTextProportional(1)
            SetTextScale(0.0, 0.3)
            SetTextColour(128, 128, 128, 255)
            SetTextDropshadow(0, 0, 0, 0, 255)
            SetTextEdge(1, 0, 0, 0, 255)
            SetTextDropShadow()
            SetTextOutline()
            SetTextEntry("STRING")
            AddTextComponentString("WŁĄCZ ROZMOWE GŁOSOWĄ W USTAWIENIACH")
            DrawText(0.005, 0.005)
        end

    end



    
    TriggerEvent('esx_status:getStatus', 'hunger', function(status)
        hunger = status.val/1000000*100
    end)
    TriggerEvent('esx_status:getStatus', 'thirst', function(status)
        thirst = status.val/1000000*100
    end)
    SendNUIMessage({
        type = "update",
        data = {hp,armor,hunger,thirst,oxygen,phone},
    })
    SendNUIMessage({
        type = "updatemic",
        voiceMode = voice,
    })



   

end)

lib.onCache('vehicle', function(value)

    inVeh = value and true or false

        
        SendNUIMessage({
            type = "showcarhud",
            data = inVeh,
        })


    DisplayRadar(inVeh)
    Citizen.CreateThread(function()
        while inVeh do
            local heading = 360.0 - ((GetGameplayCamRot(0).z + 360.0) % 360.0)
            local coords = GetEntityCoords(value)
            local speed = GetEntitySpeed(value)
            if(Config.metrics == "mph") then
                speed = speed * 2.236936
            else
                speed = speed * 3.6
            end

            SendNUIMessage({
                type = 'updatecarhud',
                carhud = inVeh,
                speed = math.floor(speed),
                metrics = Config.metrics,
                compass = directions[(math.floor((heading / 45) + 0.5) % 8) + 1],
                road = GetStreetNameFromHashKey(GetStreetNameAtCoord(coords.x, coords.y, coords.z)),
                fuel =  Entity(value).state.fuel,
                rpms = GetVehicleCurrentRpm(value)*20,
                belticon = Config.seatbelt,
                belt = Config.seatbeltgetter(),

            })
            Citizen.Wait(100)
        end
        if inVeh == false then
            SendNUIMessage({
                type = 'updatecarhud',
                carhud = inVeh,
            })                
            SendNUIMessage({
                type = "showcarhud",
                data = inVeh,
            })
        end
    end)
end)

