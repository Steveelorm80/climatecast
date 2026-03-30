

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY target/weather-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

# 👇 THIS IS THE FIX
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -Dserver.address=0.0.0.0 -jar app.jar"]