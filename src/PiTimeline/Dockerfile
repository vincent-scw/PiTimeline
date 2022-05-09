#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install --yes nodejs

WORKDIR /src
COPY ["PiTimeline/PiTimeline.csproj", "PiTimeline/"]
COPY ["PiTimeline.Domain/PiTimeline.Domain.csproj", "PiTimeline.Domain/"]
COPY ["PiTimeline.Shared/PiTimeline.Shared.csproj", "PiTimeline.Shared/"]
COPY ["PiTimeline.Infrastructure/PiTimeline.Infrastructure.csproj", "PiTimeline.Infrastructure/"]
RUN dotnet restore "PiTimeline/PiTimeline.csproj"
COPY . .
WORKDIR "/src/PiTimeline"
RUN dotnet build "PiTimeline.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PiTimeline.csproj" -c Release -o /app/publish

FROM base AS final

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg libgdiplus
	
WORKDIR /app
COPY --from=publish /app/publish .
ENV CONFIG_PATH=/var/PiTimeline/config.json
ENTRYPOINT ["dotnet", "PiTimeline.dll"]
