export default {
  "expo": {
    "name": "giuaReg",
    "slug": "giuaReg",
    "version": "3.0",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photos",
        "NSPhotoLibraryAddUsageDescription": "Allow $(PRODUCT_NAME) to save photos"
      }
    },
    "android": {
      "adaptiveIcon": {
      },
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_MEDIA_LOCATION"
      ],
      "package": "com.iisgiua.giuaReg"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ],
    "extra": {
      "version": "giuaReg 3.0",
      "url": process.env.URL ?? "",
      "school": process.env.SCHOOL ?? "",
      "eas": {
        "projectId": "76d3d2af-7012-440b-b133-4fc9c24e3603"
      }
    }
  }
};
