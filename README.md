# PiTimeline
***PiTimeline*** is a web application contains timeline editor and photo gallery. It targets to be hosted on low resource servers (eg, ***Raspberry Pi***).

![demo](doc/demo.gif)

## How to start
It is recommended to start with docker image. This image is built with ***bullseye arm32v7*** architecture, tested in Raspberry Pi 4b.
```
docker pull edentidus/pitimeline:latest
docker run -d -p {expose_port}:80 -v {timeline_folder_path}:/var/PiTimeline/ -v {photo_folder_path}:/Home/Photos/ --name pitimeline edentidus/pitimeline
```

|Parameter|Description|
|---------|-----------|
|expose_port|Container port|
|timeline_folder_path|The folder for PiTimeline generated files (thumbnails, db file, etc...)|
|photo_folder_path|The folder contains your photo|

## Configuration
By default, you can put a ```config.json``` file into ```timeline_folder_path```. The application will load the configuration on startup. A sample configuration file can be found [here]](src/PiTimeline/appsettings.json).
It is recommended to update ```Auth:Secret```, ```Auth:DefaultAdmin``` and ```Auth:DefaultAdminPassword```.