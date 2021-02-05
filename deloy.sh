#!/bin/bash
port="22"
password="qwer1234"

ip="root@192.168.1.21"
fileDir="/data/BigScreen/ui/dist-yth"

function check_result(){
  if [ "$1" != "0" ]
  then
    echo "打包出错了，请检查！";
    exit 2;
  fi
}

echo '打包中......'
npm run build:prod;
check_result $?;

ssh -p 22 $ip << eeooff

echo "删除$fileDir文件夹static/*, index.html文件"
rm -rf $fileDir/static
rm $fileDir/index.html

exit
eeooff

echo "输入密码后，将拷贝本地dist/static| index.html 到 远端服务器$fileDir"
scp -P 22 -r ./dist/static ./dist/index.html $ip:$fileDir/
echo "拷贝-发布完成！！！"
exit 0
