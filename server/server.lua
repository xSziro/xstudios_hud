ESX = exports.es_extended.getSharedObject()

ESX.RegisterServerCallback('xstudios_uipack:getcolor', function(source, cb)
    local color = Config.defaultcolor
    MySQL.query('SELECT `maincolor`,`iconcolor`,`hudpos` FROM `users` WHERE `identifier` = ?', {
        ESX.GetPlayerFromId(source).identifier
    }, function(response)
        if response then
            for i = 1, #response do
                local row = response[i]
                color = row.maincolor
                iconcolor = row.iconcolor
                hudpos = row.hudpos
                cb(color,iconcolor,hudpos)
            end
        end
    end)

end)
RegisterNetEvent('xstudios_uipack:setcolor')
AddEventHandler("xstudios_uipack:setcolor",function (color)
    local color = color
    MySQL.update('UPDATE users SET maincolor = ? WHERE identifier = ?', {
        color, ESX.GetPlayerFromId(source).identifier
    }, function(affectedRows)
        print(affectedRows)
    end)
end)
RegisterNetEvent('xstudios_uipack:setpos')
AddEventHandler("xstudios_uipack:setpos",function (pos)
    local pos = pos
    MySQL.update('UPDATE users SET hudpos = ? WHERE identifier = ?', {
        pos, ESX.GetPlayerFromId(source).identifier
    }, function(affectedRows)
        print(affectedRows)
    end)
end)
RegisterNetEvent('xstudios_uipack:seticoncolor')
AddEventHandler("xstudios_uipack:seticoncolor",function (color)
    local color = color
    MySQL.update('UPDATE users SET iconcolor = ? WHERE identifier = ?', {
        color, ESX.GetPlayerFromId(source).identifier
    }, function(affectedRows)
        print(affectedRows)
    end)
end)
ESX.RegisterCommand('hud', 'user', function(xPlayer, args, showError)
    TriggerClientEvent("xstudios_uipack:opensettings",xPlayer.playerId)
end, false, {help =  "a"})