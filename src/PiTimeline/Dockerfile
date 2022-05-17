FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim-arm32v7 AS base
EXPOSE 80
EXPOSE 443

ARG source

RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y --no-install-recommends ffmpeg
	
WORKDIR /app
COPY $source .
ENV CONFIG_PATH=/var/PiTimeline/config.json
ENTRYPOINT ["dotnet", "PiTimeline.dll"]
