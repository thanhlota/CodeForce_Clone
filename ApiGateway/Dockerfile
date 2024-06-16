FROM kong/kong-gateway:latest

# Ensure any patching steps are executed as root user
USER root

# Add custom plugin to the image
COPY ./kong/plugins/auth-plugin /usr/local/share/lua/5.1/kong/plugins/auth-plugin
ENV KONG_PLUGINS=bundled,auth-plugin

# Ensure kong user is selected for image execution
USER kong