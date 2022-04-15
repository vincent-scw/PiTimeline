# PiTimeline
***PiTimeline*** is a web application contains timeline editor and photo gallery. It targets to be hosted in Raspberry Pi.

```
docker pull edentidus/pitimeline:latest
docker run -d -p {expose_port}:80 -v {timeline_folder_path}:/var/PiTimeline/ -v {photo_folder_path}:/Home/Photos/ --name pitimeline edentidus/pitimeline
```