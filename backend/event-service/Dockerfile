FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY target/event-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

#ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -Dserver.address=0.0.0.0 -jar app.jar"]