# ===== Stage 1: build (Maven + JDK 17) =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copia o pom primeiro para aproveitar cache de dependencias
COPY pom.xml .
COPY src ./src

# Empacota a aplicacao Quarkus (fast-jar). Testes pulados no build da imagem.
RUN mvn -B -DskipTests clean package

# ===== Stage 2: runtime (apenas JRE 17) =====
FROM eclipse-temurin:17-jre
WORKDIR /app

# Layout fast-jar do Quarkus
COPY --from=build /build/target/quarkus-app/lib/ ./lib/
COPY --from=build /build/target/quarkus-app/*.jar ./
COPY --from=build /build/target/quarkus-app/app/ ./app/
COPY --from=build /build/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080
ENV QUARKUS_HTTP_HOST=0.0.0.0
ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]
