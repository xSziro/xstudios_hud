fx_version 'cerulean'
game 'gta5'
lua54 'yes'
author 'xSziro'

shared_script {
    '@ox_lib/init.lua',
    'config.lua'
}

client_script {
    'client/client.lua',

}
server_script {
    'server/server.lua',
    '@oxmysql/lib/MySQL.lua',
}
ui_page 'web/ui.html'
files {
    'web/ui.html',
    'web/styles.css',
    'web/js.js',
    'web/*',
    'web/icons/**',
    'web/icons/*',
    'locales/**',
}
