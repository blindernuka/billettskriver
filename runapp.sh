cd /home/pi/billettskriver/app

PATH=$PATH:/opt/node/bin
/usr/local/bin/forever start bin/www >>mylog 2>&1
