cd /home/pi/billettskriver/app

PATH=$PATH:/usr/local/bin
NODE_ENV=production /usr/local/bin/forever start bin/www >>mylog 2>&1
