### 在线ip查询工具

之前看nes像素css很好看，就想着写个试试看。小白新手勿喷。。

### 功能实现：

- 获取本机ip
- 随机获取名字，街道，手机号，经纬度，以及地区信息
- ip欺诈查询（ip123(免费) | Scamalytics(需要自行获取token) 两个接口平台的数据）

### 如何使用：

```
git clone 
npm i 
修改.env.production里面的用户名 改为Scamalytics自己的
npm run build
```

```
nginx 配置跨越
 	location ^~ /samxa {
       proxy_pass https://api11.scamalytics.com;
   }
    location  ^~ /fraud_check {
       proxy_pass https://ip234.in;
   }
   
```

```
使用Scamalytics需要先配置一下token。后续如果要修改token,则长按Scamalytics就是修改token
```

