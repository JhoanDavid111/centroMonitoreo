#!/bin/sh
echo "**************************"
echo "iniciando el servidor de 6gw"
echo "**************************"
if [ ! -d "./node_modules" ];then
    npm install
fi
npm run build
nginx -g "daemon off;"