#!/bin/bash

#安装依赖
yarn
#打包
yarn build:prod
#删除 nginx 指向的文件夹下的文件
rm -rf /home/www/securem/*

#将打包好的文件复制过去
mv /tmp/securem/dist/* /home/www/securem
#删除 clone 的代码
rm -rf /tmp/securem