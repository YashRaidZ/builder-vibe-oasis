#!/bin/bash

echo "Building IndusNetwork Plugin..."

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Please install Maven first."
    exit 1
fi

# Check Java version
echo "Java version:"
java -version

echo ""
echo "Starting Maven build..."

# Run Maven build with offline mode if needed
mvn clean package -q

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "Plugin JAR location: target/indusnetwork-plugin-1.0.0.jar"
    echo ""
    echo "To install:"
    echo "1. Copy the JAR file to your server's plugins/ folder"
    echo "2. Make sure Vault and LuckPerms are installed"
    echo "3. Restart your server"
    echo "4. Configure the plugin in plugins/IndusNetworkPlugin/config.yml"
else
    echo ""
    echo "❌ Build failed!"
    echo "Check the error messages above for details."
    exit 1
fi
