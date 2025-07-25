# IndusNetwork Plugin - Compilation Guide

## ✅ Issues Fixed

The following compilation errors have been resolved:

### 1. **Missing Package Imports**

- ❌ `package com.indusnetwork.database does not exist`
- ❌ `package com.indusnetwork.delivery does not exist`
- ✅ **Fixed**: Removed non-existent package imports from `IndusNetworkPlugin.java`

### 2. **LuckPerms API Usage**

- ❌ `no suitable method found for clear(net.luckperms.api.node.types.InheritanceNode)`
- ✅ **Fixed**: Updated to use `clear(node -> node instanceof InheritanceNode)`

### 3. **Bukkit Statistics Enum**

- ❌ `cannot find symbol: variable BLOCKS_MINED`
- ❌ `cannot find symbol: variable BLOCKS_PLACED`
- ✅ **Fixed**: Updated to use proper statistics API with material-specific tracking

### 4. **Switch Case Labels**

- ❌ `an enum switch case label must be the unqualified name`
- ✅ **Fixed**: Removed `Statistic.` prefix from case labels

### 5. **Java Version Compatibility**

- ✅ **Updated**: Changed from Java 17 to Java 11 for better Termux compatibility

## 🏗️ Building the Plugin

### Option 1: Using Maven (Recommended)

```bash
cd minecraft-plugin
mvn clean package
```

### Option 2: Using the Build Script

```bash
cd minecraft-plugin
chmod +x build.sh
./build.sh
```

### Option 3: Manual Steps (if Maven fails)

If you're having issues with Maven on Termux, you can try these steps:

1. **Install Maven on Termux:**

   ```bash
   pkg update
   pkg install openjdk-11 maven
   ```

2. **Set JAVA_HOME:**

   ```bash
   export JAVA_HOME=$PREFIX/lib/jvm/openjdk-11
   ```

3. **Try building with offline mode:**
   ```bash
   mvn clean package -o
   ```

## 🔧 Common Issues & Solutions

### Issue: "system modules path not set in conjunction with -source 17"

**Solution**: Updated pom.xml to use Java 11 instead of Java 17 for better compatibility.

### Issue: Maven takes too long or fails to download dependencies

**Solutions**:

1. Use offline mode: `mvn clean package -o`
2. Use local repository: `mvn clean package -Dmaven.repo.local=~/.m2/repository`
3. Skip tests: `mvn clean package -DskipTests`

### Issue: Out of memory errors

**Solution**: Increase Maven memory:

```bash
export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=256m"
```

### Issue: Network connectivity issues

**Solution**: Use a different Maven repository mirror or work offline after initial dependency download.

## 📦 Expected Output

When the build succeeds, you should see:

```
[INFO] Building jar: .../target/indusnetwork-plugin-1.0.0.jar
[INFO] BUILD SUCCESS
```

The plugin JAR will be located at: `target/indusnetwork-plugin-1.0.0.jar`

## 🚀 Installation

1. **Copy the JAR** to your Minecraft server's `plugins/` folder
2. **Install Dependencies**:
   - Vault: Download from [SpigotMC](https://www.spigotmc.org/resources/vault.34315/)
   - LuckPerms: Download from [SpigotMC](https://www.spigotmc.org/resources/luckperms.28140/)
3. **Start/Restart** your Minecraft server
4. **Configure** the plugin in `plugins/IndusNetworkPlugin/config.yml`

## 🔍 Verification

After installation, verify the plugin loaded correctly:

```
/plugins
```

You should see "IndusNetworkPlugin v1.0.0" in green.

Test basic commands:

```
/indus help
/coins
/rank
```

## 📞 Support

If you encounter any compilation issues:

1. **Check Java Version**: Ensure you have Java 11+ installed
2. **Check Maven Version**: Ensure Maven 3.6+ is installed
3. **Clear Maven Cache**: `rm -rf ~/.m2/repository`
4. **Try Offline Build**: `mvn clean package -o`

## 🌐 Integration

Once compiled and installed, configure your website integration:

1. Set your website URL in `config.yml`
2. Generate an API key for plugin-website communication
3. Test the connection with `/indus info`

The plugin will automatically sync player data with your IndusNetwork website!
