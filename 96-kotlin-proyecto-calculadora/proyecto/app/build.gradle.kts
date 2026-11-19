// EL MÓDULO DE LA APP: qué es (una app de Android con Compose), para qué Android sale y qué librerías usa.
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.tuusuario.calculadora"
    compileSdk = 36

    defaultConfig {
        // El documento de identidad de la app: cámbialo por el tuyo antes de publicar (no se cambia después).
        // Distinto del de la calculadora de React Native (com.tuusuario.calculadora): si fueran iguales, Android
        // cree que una es la versión nueva de la otra y no deja instalar las dos (encontrado al probar).
        applicationId = "com.tuusuario.calculadorakotlin"
        minSdk = 26 // Android 8
        targetSdk = 36
        versionCode = 1 // súbelo en cada versión que va a Google Play (clase 20)
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    debugImplementation(libs.androidx.compose.ui.tooling)

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
}
